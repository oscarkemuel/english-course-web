import { createFileRoute } from "@tanstack/react-router";
import StreakCalendar from "./-components/StreakCalendar";
import StreakStatsCard from "./-components/StreakStatsCard";
import ContinueLearningCard from "./-components/ContinueLearningCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER } from "@/utils/constants";
import UploadBackup from "./-components/UploadBackup";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full">
      <div className="flex justify-between bg-linear-to-r from-zinc-950 to-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 ">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-zinc-900 shadow-lg">
            <AvatarImage
              src={USER.avatarUrl}
              alt={USER.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-800 text-zinc-300 text-2xl font-bold">
              {USER.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col text-center sm:text-left justify-center pt-1 sm:pt-3">
            <p className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight flex items-center justify-center sm:justify-start gap-2">
              Welcome back, {USER.firstName}! <span>👋</span>
            </p>
            <p className="text-zinc-400 text-sm sm:text-base mt-2">
              Ready to keep your offensive streak going? Continue from where you
              left off and reach your goals today.
            </p>
          </div>
        </div>

        <UploadBackup />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakStatsCard />
        <ContinueLearningCard />
      </div>

      <div className="w-full">
        <StreakCalendar />
      </div>
    </div>
  );
}
