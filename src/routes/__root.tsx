import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModulesProvider } from "@/hooks/useModules";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <TooltipProvider>
    <ModulesProvider>
      <main className="min-h-screen w-[calc(100vw)] dark bg-background text-foreground">
        <Outlet />
      </main>
      <Toaster theme="dark" />
      <TanStackRouterDevtools />
    </ModulesProvider>
  </TooltipProvider>
);

export const Route = createRootRoute({ component: RootLayout });
