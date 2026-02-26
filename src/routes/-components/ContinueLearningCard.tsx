import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import useActivity from "@/hooks/useActivity";
import { useModules } from "@/hooks/useModules";

export default function ContinueLearningCard() {
  const { loadLastModuleWatched } = useActivity();
  const { getModuleName, getSubmoduleName } = useModules();
  const lastWatched = loadLastModuleWatched();

  const hasProgress = lastWatched && lastWatched.module !== "";

  const defaultName = "Unknown Module";
  const stageName = hasProgress
    ? getModuleName(Number(lastWatched.stage)) || defaultName
    : defaultName;
  const submoduleName = hasProgress
    ? getSubmoduleName(Number(lastWatched.stage), Number(lastWatched.module)) ||
      defaultName
    : defaultName;

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-blue-500" />
          {hasProgress ? "Continue Learning" : "Start Your Journey"}
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-2">
        {hasProgress ? (
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-900 p-3 rounded-md border border-zinc-800 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
              <div className="overflow-hidden">
                <p
                  className="text-sm font-medium text-zinc-300 truncate"
                  title={stageName || "Unknown Stage"}
                >
                  {stageName}
                </p>
                <p className="text-xs text-zinc-500 mt-1 truncate">
                  Module: {submoduleName}
                </p>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Link
                to={"/stages/$stage/module/$module"}
                params={{
                  stage: lastWatched.stage,
                  module: lastWatched.module,
                }}
              >
                <p className="text-white flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 " />
                  Return to class
                </p>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="text-center py-4 text-zinc-500 text-sm bg-zinc-900/50 rounded-md border border-zinc-800/50">
              <p>
                You haven't started any class yet. <br />
                Your journey begins now!
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Link to={"/stages"}>
                <p className="text-white flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 " />
                  Browse Classes
                </p>
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
