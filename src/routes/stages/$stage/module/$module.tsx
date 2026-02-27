import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, ArrowLeft, CheckCircle, CircleX, Home } from "lucide-react";
import React, { useEffect, useTransition } from "react";
import { useModules, type FileStructure } from "@/hooks/useModules";
import Video from "@/lib/Video";
import { ModuleContent } from "./-components/ModuleContent";
import PdfViewerModal from "@/lib/PDFViewerModal";
import AudioPlayer from "@/lib/AudioPlayer";
import DownloadConfirmModal from "@/lib/DownloadConfirmModal";
import { Button } from "@/components/ui/button";
import useActivity from "@/hooks/useActivity";

export const Route = createFileRoute("/stages/$stage/module/$module")({
  component: RouteComponent,
});

function RouteComponent() {
  const { module, stage } = Route.useParams();
  const navigate = useNavigate();
  const {
    getFiles,
    getModuleName,
    getStageName,
    toggleWatchedVideo,
    selectAllVideosAsWatched,
    getNextModule
  } = useModules();
  const [, startTransition] = useTransition();
  const { saveActivity } = useActivity();

  const [selectedVideoName, setSelectedVideoName] = React.useState<
    string | null
  >(null);

  const [selectedPdf, setSelectedPdf] = React.useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = React.useState<string | null>(null);
  const [selectedDocumentDownload, setSelectedDocumentDownload] =
    React.useState<FileStructure | null>(null);

  const files = getFiles(Number(stage), Number(module));
  const moduleName = getModuleName(Number(stage), Number(module));
  const stageName = getStageName(Number(stage));

  const hasUnwatchedVideos = files.videos.some((video) => !video.isWatched);

  const handleBack = () => {
    navigate({
      to: "/stages/$stage",
      params: {
        stage,
      },
    });
  };

  const selectedVideo = React.useMemo(() => {
    if (!selectedVideoName) return null;
    return files.videos.find((f) => f.name === selectedVideoName) || null;
  }, [files, selectedVideoName]);

  const handleSelectFile = (file: FileStructure) => {
    switch (file.type) {
      case "mp4":
        setSelectedVideoName(file.name);
        break;
      case "mp3":
        setSelectedAudio(file.path);
        break;
      case "apkg":
        setSelectedDocumentDownload(file);
        break;
      case "pdf":
        saveActivity('reading');
        setSelectedPdf(file.path);
        break
      default:
        setSelectedPdf(file.path);
        break;
    }
  };

  const handleToggleWatched = () => {
    if (selectedVideo) {
      toggleWatchedVideo({
        module: String(module),
        stage: String(stage),
        videoName: selectedVideo.name,
      });
    }

    const nextVideo = files.videos.find(
      (file) => !file.isWatched && file.name !== selectedVideo?.name,
    );

    if (nextVideo && !selectedVideo?.isWatched) {
      startTransition(() => {
        setSelectedVideoName(nextVideo.name);
      });
    } else {
      setSelectedVideoName(null);
    }
  };

  const handleConfirmDownload = () => {
    if (selectedDocumentDownload) {
      window.open(selectedDocumentDownload.path, "_blank");
      setSelectedDocumentDownload(null);
    }
  };

  useEffect(() => {
    if (files.videos.length > 0 && !selectedVideo) {
      const firstVideo = files.videos.find((file) => !file.isWatched);
      if (firstVideo) {
        startTransition(() => {
          setSelectedVideoName(firstVideo.name);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, stage, files]);

  if (!files || !moduleName || !stageName) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 p-8 flex-col gap-3">
        <p className="text-zinc-50">Module not found.</p>
        
        <Button
          variant="ghost"
          className="pl-0 text-zinc-400 hover:text-zinc-50 hover:bg-transparent w-fit"
          onClick={() => navigate({ to: "/" })}
        >
          <Home className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
    );
  }

  const nextModule = getNextModule(Number(stage), Number(module));

  return (
    <div className="dark flex flex-col lg:flex-row h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-start justify-between">
          <button
            className="text-sm text-zinc-400 hover:text-zinc-50 flex items-center gap-2 transition-colors"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Modules
          </button>

          {hasUnwatchedVideos && (
            <button
              className="text-sm text-zinc-400 hover:text-zinc-50 flex items-center gap-2 transition-colors"
              onClick={() => {
                setSelectedVideoName(null);
                selectAllVideosAsWatched(Number(stage), Number(module));
              }}
            >
              Complete module
            </button>
          )}
        </div>

        <div className="w-full bg-black aspect-video flex items-center justify-center relative border-b border-zinc-800">
          {!selectedVideo && (
            <div className="text-center">
              <PlayCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">{!hasUnwatchedVideos ? "All videos watched!" : "Select a video to watch"}</p>

              {!hasUnwatchedVideos && !!nextModule && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    navigate({
                      to: "/stages/$stage/module/$module",
                      params: {
                        stage: String(nextModule.stageId),
                        module: String(nextModule.moduleId),
                      },
                    });
                  }}
                >
                  Next Module
                </Button>
              )}
            </div>
          )}
          {selectedVideo && (
            <Video
              path={selectedVideo.path}
              name={selectedVideo.name}
              key={selectedVideo.name}
            />
          )}
        </div>

        {/* Tabs de Informação */}
        <div className="p-6 max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-start gap-6 mb-6">
            <p
              className={`text-2xl max-w-2xl font-bold mb-6 text-zinc-50 ${selectedVideo && selectedVideo.isWatched ? `line-through text-zinc-500` : ``}`}
            >
              {selectedVideo
                ? selectedVideo.name.replace(/\.[^/.]+$/, "")
                : moduleName}
            </p>

            {selectedVideo && (
              <button
                className="text-sm text-zinc-400 hover:text-zinc-50 flex items-center gap-2 transition-colors"
                onClick={() => handleToggleWatched()}
                key={selectedVideo.name}
              >
                {selectedVideo.isWatched ? (
                  <>
                    <CircleX className="w-4 h-4 text-red-400" /> Unmark as
                    Watched
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" /> Mark as
                    Watched
                  </>
                )}
              </button>
            )}
          </div>

          <Tabs defaultValue="visao-geral" className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger
                value="visao-geral"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50 text-zinc-400"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="visao-geral" className="mt-4">
              <p className="text-zinc-400 leading-relaxed">
                This module is part of the {stageName} phase of the English course.
                Here you will find video lessons and supporting materials to improve your learning.
                Mark videos as watched to track your progress and never miss an important lesson!
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="w-full lg:w-100 border-l border-zinc-800 bg-zinc-900 flex flex-col h-125 lg:h-screen">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
          <h2 className="font-bold text-lg text-zinc-50">Module Content</h2>
        </div>

        <ModuleContent files={files} handleSelectFile={handleSelectFile} />
      </div>

      <PdfViewerModal
        open={!!selectedPdf}
        handleClose={() => setSelectedPdf(null)}
        fileUrl={selectedPdf || ""}
      />

      <AudioPlayer
        open={!!selectedAudio}
        onClose={() => setSelectedAudio(null)}
        src={selectedAudio || ""}
      />

      <DownloadConfirmModal
        open={!!selectedDocumentDownload}
        onClose={() => setSelectedDocumentDownload(null)}
        fileName={selectedDocumentDownload?.name || ""}
        onConfirm={() => handleConfirmDownload()}
      />
    </div>
  );
}
