import { Button } from "@/components/ui/button";
import usePlaylist from "@/hooks/usePlaylist";
import AudioPlayer from "@/lib/AudioPlayer";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Home, Music, Play, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/playlist")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { playlist, removeFromPlaylist, clearPlaylist } = usePlaylist();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const stageName = "Playlist";
  const currentTrack = currentIndex !== null ? playlist[currentIndex] : null;

  const handleBack = () => {
    navigate({ to: "/" });
  };

  const handlePlayAll = () => {
    if (playlist.length > 0) setCurrentIndex(0);
  };

  const handlePlayAudio = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < playlist.length - 1) {
      setCurrentIndex((prev) => (prev !== null ? prev + 1 : null));
    } else {
      setCurrentIndex(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex((prev) => (prev !== null ? prev - 1 : null));
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <Button
              variant="ghost"
              className="pl-0 text-zinc-400 hover:text-zinc-50 hover:bg-transparent w-fit mb-3"
              onClick={handleBack}
            >
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
              {stageName}
            </h1>
            <p className="text-zinc-400">
              This is where your audio playlist will be displayed. You can
              listen to your saved audio clips here and manage your playlist.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {playlist.length > 0 && (
              <>
                <Button
                  variant="destructive"
                  onClick={clearPlaylist}
                  className="pl-0 text-zinc-400 hover:text-zinc-50 hover:bg-transparent w-fit transition-all"
                >
                  <Trash2 className="w-5 h-5 mr-1" /> Clear
                </Button>

                <Button
                  onClick={handlePlayAll}
                  className="pl-0 text-zinc-400 hover:text-zinc-50 hover:bg-transparent w-fit transition-all"
                >
                  <Play className="w-5 h-5 mr-1 fill-current" /> Play All
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {playlist.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-zinc-700" />
              </div>
              <p className="text-zinc-300 font-medium text-lg">
                Your playlist is empty
              </p>
              <p className="text-zinc-500 mt-1">
                Go back and add some audio files to listen later.
              </p>
            </div>
          ) : (
            playlist.map((item, index) => (
              <div
                key={item.url || index}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                  currentIndex === index
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/80"
                }`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                    <Music
                      className={`w-5 h-5 transition-colors ${currentIndex === index ? "text-emerald-400" : "text-zinc-400 group-hover:text-emerald-400"}`}
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className={`text-base font-medium truncate transition-colors ${currentIndex === index ? "text-emerald-400" : "text-zinc-200 group-hover:text-emerald-50"}`}
                      title={item.title || "Unknown Audio"}
                    >
                      {item.title || "Unknown Audio"}
                    </span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">
                      Audio Track
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePlayAudio(index)}
                    className={`rounded-full ${currentIndex === index ? "text-emerald-400 bg-emerald-400/10" : "text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10"}`}
                    title={currentIndex === index ? "Playing" : "Play audio"}
                  >
                    <Play
                      className={`w-5 h-5 ${currentIndex === index ? "fill-current" : "fill-current"}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeFromPlaylist(item.url);
                      if (currentIndex === index) setCurrentIndex(null);
                    }}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AudioPlayer
        open={currentIndex !== null}
        onClose={() => setCurrentIndex(null)}
        src={currentTrack?.url || ""}
        name={currentTrack?.title || ""}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onEnded={handleNext}
        showSkipControls={playlist.length > 1}
        autoPlay
      />
    </div>
  );
}
