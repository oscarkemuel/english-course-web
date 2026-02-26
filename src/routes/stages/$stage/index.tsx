import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlayCircle,
  ArrowLeft,
  Video,
  FileText,
  Check,
  AudioLines,
} from "lucide-react";
import { useModules } from "@/hooks/useModules";

export const Route = createFileRoute("/stages/$stage/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { getModules, getStageName, getFilesCount, getModuleProgress } =
    useModules();
  const { stage } = Route.useParams();
  const navigate = useNavigate();

  const modules = getModules(Number(stage));
  const stageName = getStageName(Number(stage));

  const handleBack = () => {
    navigate({
      to: "/stages",
    });
  };

  const handleAccessModule = (moduleId: number) => {
    navigate({
      to: "/stages/$stage/module/$module",
      params: {
        module: String(moduleId),
        stage,
      },
    });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <Button
            variant="ghost"
            className="pl-0 text-zinc-400 hover:text-zinc-50 hover:bg-transparent w-fit mb-3"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Phases
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
            {stageName}
          </h1>
          <p className="text-zinc-400">
            Select a module to access the lessons and materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const { videosCount, materialsCount, audiosCount } = getFilesCount(
              module.files,
            );
            const progress = getModuleProgress(Number(stage), module.number);
            const isFinished = progress === 100;

            return (
              <Card
                key={module.number}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 justify-between">
                    <CardTitle className="text-2xl text-zinc-100">{`Módulo 0${module.number}`}</CardTitle>
                    {isFinished && (
                      <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-0.5 rounded-md text-sm">
                        <Check className="w-4 h-4" /> Completed
                      </div>
                    )}
                  </div>

                  {progress > 0 && !isFinished && (
                    <div className="w-full bg-zinc-800 rounded-full h-2 mt-3">
                      <div
                        className="bg-zinc-700 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-400">
                    {videosCount > 0 && (
                      <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1 rounded-md">
                        <Video className="w-4 h-4 text-zinc-500" />{" "}
                        <span>{videosCount} Videos</span>
                      </div>
                    )}
                    {materialsCount > 0 && (
                      <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1 rounded-md">
                        <FileText className="w-4 h-4 text-zinc-500" />{" "}
                        <span>{materialsCount} Materials</span>
                      </div>
                    )}
                    {audiosCount > 0 && (
                      <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1 rounded-md">
                        <AudioLines className="w-4 h-4 text-zinc-500" />{" "}
                        <span>{audiosCount} Audios</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardFooter className="pt-0">
                  <Button
                    className="pl-0 text-zinc-400 hover:text-zinc-50 hover:bg-transparent h-11 w-full bg-gray-800!"
                    onClick={() => handleAccessModule(module.number)}
                  >
                    <PlayCircle className="w-5 h-5" /> Access classes
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
