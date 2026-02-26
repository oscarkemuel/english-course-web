import AudioPlayerComponent, { RHAP_UI } from "react-h5-audio-player";
import { useState, useRef } from "react";
import { GripHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useActivity from "@/hooks/useActivity";
import Draggable from "react-draggable";

interface IProps {
  open: boolean;
  onClose: () => void;
  src: string;
}

const AudioPlayer = ({ src, open, onClose }: IProps) => {
  const [repeatCounter, setRepeatCounter] = useState(0);
  const nodeRef = useRef(null);
  const lastTimeRef = useRef(0);
  const { saveActivity } = useActivity();

  const handlePlay = () => {
    if (repeatCounter === 0) {
      saveActivity();
      setRepeatCounter(1);
    }
  };

  const handleListen = (e: Event) => {
    const currentTime = (e.target as HTMLAudioElement).currentTime;

    if (lastTimeRef.current > currentTime + 1 && currentTime < 1) {
      setRepeatCounter((prev) => prev + 1);
    }

    lastTimeRef.current = currentTime;
  };

  const resetCounter = () => {
    setRepeatCounter(0);
    lastTimeRef.current = 0;
  };

  if (!open) return null;

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="body">
      <div
        ref={nodeRef}
        id="global-audio-player"
        className="fixed bottom-10 right-10 w-100 z-100 shadow-2xl rounded-md overflow-hidden border border-zinc-800 bg-zinc-950"
      >
        <div className="drag-handle w-full flex items-center justify-center py-1.5 bg-zinc-900 hover:bg-zinc-800 cursor-grab active:cursor-grabbing border-b border-zinc-800 transition-colors">
          <GripHorizontal className="w-5 h-5 text-zinc-500" />
        </div>

        <AudioPlayerComponent
          src={src}
          className="bg-zinc-950! p-4!"
          customAdditionalControls={[
            RHAP_UI.LOOP,

            <div key="custom-controls" className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
              >
                <X className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                onClick={resetCounter}
                className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 flex items-center gap-0.5 px-2"
              >
                <span className="text-base">{repeatCounter}</span>
                <span className="text-base font-bold">x</span>
              </Button>
            </div>,
          ]}
          volume={0.5}
          loop
          showJumpControls={false}
          onPlay={handlePlay}
          onListen={handleListen}
          onLoadStart={resetCounter}
        />
      </div>
    </Draggable>
  );
};

export default AudioPlayer;
