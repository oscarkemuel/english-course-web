import { Toaster } from "@/components/ui/sonner";
import { ModulesProvider } from "@/hooks/useModules";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <ModulesProvider>
    <main className="min-h-screen w-[calc(100vw)] dark bg-background text-foreground">
      <Outlet />
    </main>
    <Toaster theme="dark" />
    <TanStackRouterDevtools />
  </ModulesProvider>
);

export const Route = createRootRoute({ component: RootLayout });
