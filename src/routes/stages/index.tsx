import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, Home } from "lucide-react";
import { useModules } from "@/hooks/useModules";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/stages/")({
  component: Stages,
});

function Stages() {
  const { stages } = useModules();
  const navigate = useNavigate();

  return (
    <div className="dark min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Button
          variant="ghost"
          className="pl-0 text-zinc-400 hover:text-zinc-50 hover:bg-transparent w-fit mb-3"
          onClick={() => navigate({ to: "/" })}
        >
          <Home className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
            Study phases
          </h1>
          <p className="text-zinc-400 mt-2">
            Choose a phase to access the modules and lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stages.map((stage) => (
            <Link
              to="/stages/$stage"
              params={{ stage: String(stage.number) }}
              key={stage.number}
            >
              <Card
                key={stage.number}
                className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-primary hover:bg-zinc-800/50 transition-all group"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl text-zinc-100">{`0${stage.number} - ${stage.name}`}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {stage.submodules.length} Módulos disponíveis
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
