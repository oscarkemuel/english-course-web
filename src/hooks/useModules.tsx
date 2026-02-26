import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import useActivity from "./useActivity";

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

export interface Submodule {
  number: number;
  name: string;
  files: FileStructure[];
}

export interface Module {
  number: number;
  name: string;
  submodules: Submodule[];
}

interface IModulesProvider {
  children: React.ReactNode;
}

interface IModulesContext {
  modules: Module[];
  getSubmodules: (number: number) => Submodule[];
  getFiles: (moduleId: number, submoduleId: number) => Files;
  toggleWatchedVideo: (params: { stage: string; module: string; videoName: string }) => void;
  getSubmoduleProgress: (moduleId: number, submoduleId: number) => number;
  getModuleProgress: (moduleId: number) => number;
  getModuleName: (moduleId: number) => string;
  getSubmoduleName: (moduleId: number, submoduleId: number) => string;
  getFilesCount: (files: FileStructure[]) => {
    videosCount: number;
    audiosCount: number;
    materialsCount: number;
  };
  selectAllVideosAsWatched: (moduleId: number, submoduleId: number) => void;
}

const ModulesContext = createContext({} as IModulesContext);

export function ModulesProvider({ children }: IModulesProvider) {
  const listViewsId = "watched_videos";
  const [modules, setModules] = useState<Module[]>([]);
  const [watchedVideos, setWatchedVideos] = useLocalStorage(listViewsId, []);
  const { saveActivity, saveLastModuleWatched } = useActivity();

  const getSubmodules = (number: number) => {
    const module = modules.find((module) => module.number === number);

    if (!module) return [];

    return module.submodules;
  };

  const getFiles = (moduleId: number, submoduleId: number) => {
    const module = modules.find((module) => module.number === moduleId);

    if (!module) return { videos: [], audios: [], materials: [] };

    const submodule = module.submodules.find(
      (sub) => sub.number === submoduleId,
    );

    if (!submodule) return { videos: [], audios: [], materials: [] };

    const videos = submodule.files
      .filter((file) => file.type === "mp4")
      .map((file) => ({
        ...file,
        isWatched: isVideoWatched(`${moduleId}-${submoduleId}-${file.name}`),
      }));
    const audios = submodule.files.filter((file) => file.type === "mp3");
    const materials = submodule.files.filter(
      (file) => file.type !== "mp4" && file.type !== "mp3",
    );

    return {
      videos,
      audios,
      materials,
    };
  };

  const toggleWatchedVideo = ({ stage, module, videoName }: { stage: string; module: string; videoName: string }) => {
    const videoId = `${stage}-${module}-${videoName}`;
    const updatedWatchedVideos = watchedVideos.includes(videoId)
      ? watchedVideos.filter((id: string) => id !== videoId)
      : [...watchedVideos, videoId];

    setWatchedVideos(updatedWatchedVideos);
    saveActivity();
    saveLastModuleWatched({ module, stage });
  };

  const isVideoWatched = (videoId: string) => watchedVideos.includes(videoId);

  const getModuleProgress = (moduleId: number) => {
    const module = modules.find((m) => m.number === moduleId);
    if (!module) return 0;

    const submoduleProgresses = module.submodules.map((submodule) =>
      getSubmoduleProgress(moduleId, submodule.number),
    );
    const totalProgress = submoduleProgresses.reduce(
      (acc, progress) => acc + progress,
      0,
    );
    const averageProgress =
      submoduleProgresses.length > 0
        ? totalProgress / submoduleProgresses.length
        : 0;

    return Math.round(averageProgress);
  };

  const getSubmoduleProgress = (moduleId: number, submoduleId: number) => {
    const files = getFiles(moduleId, submoduleId);
    const totalVideos = files.videos.length;
    const watchedVideosCount = files.videos.filter(
      (file) => file.isWatched,
    ).length;

    const progress =
      totalVideos > 0 ? (watchedVideosCount / totalVideos) * 100 : 0;

    return Math.round(progress);
  };

  const getModuleName = (moduleId: number) => {
    const module = modules.find((m) => m.number === moduleId);
    if (!module) return "";

    return module.name;
  };

  const getSubmoduleName = (moduleId: number, submoduleId: number) => {
    const module = modules.find((m) => m.number === moduleId);
    if (!module) return "";
    const submodule = module.submodules.find((s) => s.number === submoduleId);
    if (!submodule) return "";

    return `Módulo 0${submoduleId}`;
  };

  const getFilesCount = (files: FileStructure[]) => {
    const videosCount = files.filter((file) => file.type === "mp4").length;
    const audiosCount = files.filter((file) => file.type === "mp3").length;
    const materialsCount = files.filter((file) => file.type !== "mp4" && file.type !== "mp3").length;

    return { videosCount, audiosCount, materialsCount };
  };

  const selectAllVideosAsWatched = (moduleId: number, submoduleId: number) => {
    const files = getFiles(moduleId, submoduleId);
    
    const videoIds = files.videos.map(
      (file) => `${moduleId}-${submoduleId}-${file.name}`,
    );

    const updatedWatchedVideos = Array.from(
      new Set([...watchedVideos, ...videoIds]),
    );

    setWatchedVideos(updatedWatchedVideos);
    saveLastModuleWatched({ module: String(submoduleId), stage: String(moduleId) });
    saveActivity();
  };

  useEffect(() => {
    fetch("/curso_ingles.json")
      .then((response) => response.json())
      .then((data) => setModules(data))
      .catch((error) => console.error("Erro ao carregar JSON:", error));
  }, []);

  return (
    <ModulesContext.Provider
      value={{
        modules,
        getSubmodules,
        getFiles,
        toggleWatchedVideo,
        getSubmoduleProgress,
        getModuleProgress,
        getModuleName,
        getSubmoduleName,
        getFilesCount,
        selectAllVideosAsWatched,
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
