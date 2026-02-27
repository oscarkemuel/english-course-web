import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import useLocalStorage from "./useLocalStorage";

export type ActivityType = "audio" | "video" | "reading";
export interface ActivityEntry {
  date: string;
  count: number;
  level: number;
  types: ActivityType[];
}

const useActivity = () => {
  const { ACTIVITY, LAST_MODULE_WATCHED } = LOCAL_STORAGE_KEYS;
  const [activity, setActivity] = useLocalStorage(ACTIVITY, []);
  const [lastModuleWatched, setLastModuleWatched] = useLocalStorage(
    LAST_MODULE_WATCHED,
    { module: "", stage: "" },
  );

  const activityTyped = activity as ActivityEntry[];

  const saveLastModuleWatched = ({
    module,
    stage,
  }: {
    module: string;
    stage: string;
  }) => {
    setLastModuleWatched({ module, stage });
  };

  const loadLastModuleWatched = () => {
    return lastModuleWatched as { module: string; stage: string };
  };

  const saveActivity = (type: ActivityType) => {
    const today = new Date().toISOString().split("T")[0];
    const activityData = activityTyped || [];
    const todayActivity = activityData.find((entry) => entry.date === today);

    if (todayActivity) {
      todayActivity.count += 1;
      todayActivity.level = Math.min(todayActivity.count, 4);
      if (!todayActivity.types.includes(type)) {
        todayActivity.types.push(type);
      }
    } else {
      activityData.push({ date: today, count: 1, level: 1, types: [type] });
    }

    setActivity(activityData);
  };

  const loadActivity = () => {
    const activityData = activityTyped || [];
    return activityData;
  };

  const getConsecutiveDays = () => {
    const activityData = activityTyped || [];
    const sortedData = activityData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    let maxStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedData.length; i++) {
      if (
        i === 0 ||
        new Date(sortedData[i].date).getTime() -
          new Date(sortedData[i - 1].date).getTime() ===
          86400000
      ) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    return { currentStreak, maxStreak };
  };

  return {
    saveActivity,
    loadActivity,
    getConsecutiveDays,
    saveLastModuleWatched,
    loadLastModuleWatched,
  };
};

export default useActivity;
