import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useActivity from "@/hooks/useActivity";
import { Trophy, Flame } from "lucide-react";

export default function StreakStatsCard() {
  const { getConsecutiveDays } = useActivity();
  const { currentStreak, maxStreak } = getConsecutiveDays();

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-50 h-full justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          My offensive streaks
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-md border border-zinc-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-zinc-300">Current Offensive</span>
          </div>
          <span className="text-xl font-bold text-zinc-50">{currentStreak} <span className="text-xs text-zinc-500 font-normal">days</span></span>
        </div>
        
        <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-md border border-zinc-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-zinc-300">Maximum Offensive</span>
          </div>
          <span className="text-xl font-bold text-zinc-50">{maxStreak} <span className="text-xs text-zinc-500 font-normal">days</span></span>
        </div>
      </CardContent>
    </Card>
  );
}