import AudioPlayerComponent, { RHAP_UI } from "react-h5-audio-player";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useActivity from "@/hooks/useActivity";

interface IProps {
  open: boolean;
  onClose: () => void;
  src: string;
}

const AudioPlayer = ({ src, open, onClose }: IProps) => {
  const [repeatCounter, setRepeatCounter] = useState(0);
  const { saveActivity } = useActivity();

  const onChangeCounter = () => {
    setRepeatCounter((old) => old + 1);
  };

  const getCounter = () => {
    if (repeatCounter >= 2) {
      return repeatCounter / 2;
    }
    return repeatCounter;
  };

  const resetCounter = () => setRepeatCounter(0);

  if (!open) return null;

  return (
    <div className="fixed bottom-10 right-10 w-100 z-1301 shadow-2xl rounded-md overflow-hidden border border-zinc-800 bg-zinc-950">
      <AudioPlayerComponent
        src={src}
        className="bg-zinc-950! p-4!"
        customAdditionalControls={[
          RHAP_UI.LOOP,

          <div className="flex items-center gap-2">
            <Button
              key="close-btn"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              key="counter-btn"
              variant="ghost"
              onClick={resetCounter}
              className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 flex items-center gap-0.5 px-2"
            >
              <span className="text-base">{getCounter()}</span>
              <span className="text-base font-bold">x</span>
            </Button>
          </div>,
        ]}
        volume={0.5}
        loop
        showJumpControls={false}
        onPlaying={onChangeCounter}
        onPause={resetCounter}
        onLoadStart={resetCounter}
        onPlay={saveActivity}
      />
    </div>
  );
};

export default AudioPlayer;
