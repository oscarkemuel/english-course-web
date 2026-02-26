import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useActivity from "@/hooks/useActivity";
import { Flame } from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";

const StreakCalendar = () => {
  const { loadActivity } = useActivity();

  const data = loadActivity();

  const theme = {
    dark: ["#2a2a2c", "#064e3b", "#047857", "#059669", "#10b981"],
  };

  const hasData = data && data.length > 0;

  const renderContent = () => {
    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-zinc-500 w-full">
          <Flame className="w-8 h-8 mb-2" />
          <p className="text-sm">No activity recorded yet.</p>
        </div>
      );
    }
    return (
      <ActivityCalendar
          data={data}
          theme={theme}
          colorScheme="dark"
          blockSize={12}
          blockMargin={4}
          fontSize={12}
          showMonthLabels
          showWeekdayLabels
          tooltips={{
            activity: {
              text: (activity) =>
                `${activity.count} activities on ${activity.date}`,
              placement: "right",
              offset: 6,
              hoverRestMs: 300,
              transitionStyles: {
                duration: 100,
                common: { fontFamily: "monospace" },
              },
              withArrow: true,
            },
          }}
        />
    );
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-50 w-full gap-1">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Flame className="w-5 h-5 text-orange-500" />
          Study Calendar
        </CardTitle>
      </CardHeader>

      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
