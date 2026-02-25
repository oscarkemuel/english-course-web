import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useModules } from "@/hooks/useModules";

export const Route = createFileRoute("/stages/")({
  component: Stages,
});

function Stages() {
  const { modules } = useModules();

  return (
    <div className="dark min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
            Trilha de Estudos
          </h1>
          <p className="text-zinc-400 mt-2">
            Selecione uma fase para começar a estudar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <Link
              to="/stages/$stage"
              params={{ stage: String(module.number) }}
              key={module.number}
            >
              <Card
                key={module.number}
                className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-primary hover:bg-zinc-800/50 transition-all group"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl text-zinc-100">{`0${module.number} - ${module.name}`}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {module.submodules.length} Módulos disponíveis
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
