import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import useActivity from "./useActivity";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

export type FileType =
  | "pdf"
  | "mp4"
  | "mp3"
  | "apkg"
  | "txt"
  | "png"
  | "jpg"
  | "jpeg";

export interface FileStructure {
  path: string;
  name: string;
  type: FileType;
  isWatched: boolean;
}

export type Files = {
  videos: FileStructure[];
  audios: FileStructure[];
  materials: FileStructure[];
};

export interface Module {
  number: number;
  name: string;
  files: FileStructure[];
}

export interface Stage {
  number: number;
  name: string;
  submodules: Module[];
}

interface IModulesProvider {
  children: React.ReactNode;
}

interface IModulesContext {
  stages: Stage[];
  getModules: (number: number) => Module[];
  getFiles: (stageId: number, moduleId: number) => Files;
  toggleWatchedVideo: (params: {
    stage: string;
    module: string;
    videoName: string;
  }) => void;
  getModuleProgress: (stageId: number, moduleId: number) => number;
  getStageProgress: (stageId: number) => number;
  getStageName: (stageId: number) => string;
  getModuleName: (stageId: number, moduleId: number) => string;
  getFilesCount: (files: FileStructure[]) => {
    videosCount: number;
    audiosCount: number;
    materialsCount: number;
  };
  selectAllVideosAsWatched: (stageId: number, moduleId: number) => void;
  getNextModule: (
    currentStageId: number,
    currentModuleId: number,
  ) => { stageId: number; moduleId: number } | null;
}

const ModulesContext = createContext({} as IModulesContext);

export function ModulesProvider({ children }: IModulesProvider) {
  const { WATCHED_VIDEOS } = LOCAL_STORAGE_KEYS;
  const [stages, setStages] = useState<Stage[]>([]);
  const [watchedVideos, setWatchedVideos] = useLocalStorage(WATCHED_VIDEOS, []);
  const { saveActivity, saveLastModuleWatched } = useActivity();

  const getModules = (number: number) => {
    const stage = stages.find((stage) => stage.number === number);

    if (!stage) return [];

    return stage.submodules;
  };

  const getFiles = (stageId: number, moduleId: number) => {
    const stage = stages.find((stage) => stage.number === stageId);

    if (!stage) return { videos: [], audios: [], materials: [] };

    const module = stage.submodules.find((mod) => mod.number === moduleId);

    if (!module) return { videos: [], audios: [], materials: [] };

    const videos = module.files
      .filter((file) => file.type === "mp4")
      .map((file) => ({
        ...file,
        isWatched: isVideoWatched(`${stageId}-${moduleId}-${file.name}`),
      }));
    const audios = module.files.filter((file) => file.type === "mp3");
    const materials = module.files.filter(
      (file) => file.type !== "mp4" && file.type !== "mp3",
    );

    return {
      videos,
      audios,
      materials,
    };
  };

  const toggleWatchedVideo = ({
    stage,
    module,
    videoName,
  }: {
    stage: string;
    module: string;
    videoName: string;
  }) => {
    const videoId = `${stage}-${module}-${videoName}`;
    const updatedWatchedVideos = watchedVideos.includes(videoId)
      ? watchedVideos.filter((id: string) => id !== videoId)
      : [...watchedVideos, videoId];

    setWatchedVideos(updatedWatchedVideos);
    saveActivity('video');
    saveLastModuleWatched({ module, stage });
  };

  const isVideoWatched = (videoId: string) => watchedVideos.includes(videoId);

  const getStageProgress = (stageId: number) => {
    const stage = stages.find((s) => s.number === stageId);
    if (!stage) return 0;

    const moduleProgress = stage.submodules.map((module) =>
      getModuleProgress(stageId, module.number),
    );
    const totalProgress = moduleProgress.reduce(
      (acc, progress) => acc + progress,
      0,
    );
    const averageProgress =
      moduleProgress.length > 0 ? totalProgress / moduleProgress.length : 0;

    return Math.round(averageProgress);
  };

  const getModuleProgress = (stageId: number, moduleId: number) => {
    const files = getFiles(stageId, moduleId);
    const totalVideos = files.videos.length;
    const watchedVideosCount = files.videos.filter(
      (file) => file.isWatched,
    ).length;

    const progress =
      totalVideos > 0 ? (watchedVideosCount / totalVideos) * 100 : 0;

    return Math.round(progress);
  };

  const getStageName = (stageId: number) => {
    const stage = stages.find((m) => m.number === stageId);
    if (!stage) return "";

    return stage.name;
  };

  const getModuleName = (stageId: number, moduleId: number) => {
    const stage = stages.find((s) => s.number === stageId);
    if (!stage) return "";
    const module = stage.submodules.find((m) => m.number === moduleId);
    if (!module) return "";

    return `Módulo 0${moduleId}`;
  };

  const getFilesCount = (files: FileStructure[]) => {
    const videosCount = files.filter((file) => file.type === "mp4").length;
    const audiosCount = files.filter((file) => file.type === "mp3").length;
    const materialsCount = files.filter(
      (file) => file.type !== "mp4" && file.type !== "mp3",
    ).length;

    return { videosCount, audiosCount, materialsCount };
  };

  const selectAllVideosAsWatched = (stageId: number, moduleId: number) => {
    const files = getFiles(stageId, moduleId);

    const videoIds = files.videos.map(
      (file) => `${stageId}-${moduleId}-${file.name}`,
    );

    const updatedWatchedVideos = Array.from(
      new Set([...watchedVideos, ...videoIds]),
    );

    setWatchedVideos(updatedWatchedVideos);
    saveLastModuleWatched({ module: String(moduleId), stage: String(stageId) });
    saveActivity('video');
  };

  const getNextModule = (currentStageId: number, currentModuleId: number) => {
    const currentStageIndex = stages.findIndex(
      (s) => s.number === currentStageId,
    );
    if (currentStageIndex === -1) return null;

    const currentModuleIndex = stages[currentStageIndex].submodules.findIndex(
      (m) => m.number === currentModuleId,
    );
    if (currentModuleIndex === -1) return null;

    // Try to get next module in the same stage
    if (currentModuleIndex < stages[currentStageIndex].submodules.length - 1) {
      return {
        stageId: currentStageId,
        moduleId:
          stages[currentStageIndex].submodules[currentModuleIndex + 1].number,
      };
    }

    // If no next module in the same stage, try to get the first module of the next stage
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1];

      if (nextStage.submodules.length > 0) {
        return {
          stageId: nextStage.number,
          moduleId: nextStage.submodules[0].number,
        };
      }
    }

    // If no next module or stage, return null
    return null;
  };

  useEffect(() => {
    fetch("/curso_ingles.json")
      .then((response) => response.json())
      .then((data) => setStages(data))
      .catch((error) => console.error("Erro ao carregar JSON:", error));
  }, []);

  return (
    <ModulesContext.Provider
      value={{
        stages,
        getModules,
        getFiles,
        toggleWatchedVideo,
        getModuleProgress,
        getStageProgress,
        getStageName,
        getModuleName,
        getFilesCount,
        selectAllVideosAsWatched,
        getNextModule,
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModules() {
  const context = useContext(ModulesContext);

  if (!context) {
    throw new Error("useModules must be used within a ModulesProvider");
  }

  return context;
}
