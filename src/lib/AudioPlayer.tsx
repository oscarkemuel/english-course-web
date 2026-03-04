import AudioPlayerComponent, { RHAP_UI } from "react-h5-audio-player";
import { useState, useRef } from "react";
import { GripHorizontal, X, Music, ListPlus, ListCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import useActivity from "@/hooks/useActivity";
import Draggable from "react-draggable";
import usePlaylist from "@/hooks/usePlaylist";

interface IProps {
  open: boolean;
  onClose: () => void;
  src: string;
  name?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  showSkipControls?: boolean; 
  autoPlay?: boolean;
}

const AudioPlayer = ({ 
  src, 
  name, 
  open, 
  onClose, 
  onNext, 
  onPrevious, 
  onEnded, 
  showSkipControls = false,
  autoPlay = false,
}: IProps) => {
  // ... (mantenha todo o restante do código do hook e dos handlers igual)
  const { hasAudioInPlaylist, addToPlaylist, removeFromPlaylist } = usePlaylist();
  const [repeatCounter, setRepeatCounter] = useState(0);
  const nodeRef = useRef(null);
  const lastTimeRef = useRef(0);
  const { saveActivity } = useActivity();

  const isSaved = hasAudioInPlaylist(src);
  const handlePlaylistToggle = () => {
    if (isSaved) {
      removeFromPlaylist(src);
    } else {
      addToPlaylist({ url: src, title: name || 'Unknown' });
    }
  };

  const handlePlay = () => {
    if (repeatCounter === 0) {
      saveActivity("audio");
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

  const handleDragStart = () => {
    document.body.classList.add("is-dragging-player");
  };

  const handleDragStop = () => {
    document.body.classList.remove("is-dragging-player");
  };

  if (!open) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds="body"
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      <div
        ref={nodeRef}
        id="global-audio-player"
        className="fixed bottom-10 right-10 w-100 z-100 shadow-2xl rounded-md overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col"
      >
        <div className="drag-handle w-full flex items-center justify-center py-1.5 bg-zinc-900 hover:bg-zinc-800 cursor-grab active:cursor-grabbing border-b border-zinc-800 transition-colors">
          <GripHorizontal className="w-5 h-5 text-zinc-500" />
        </div>

        {name && (
          <div className="px-4 pt-4 pb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-inner">
              <Music className="w-4 h-4 text-zinc-400" />
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                Tocando agora
              </span>
              <span
                className="text-sm font-medium text-zinc-200 truncate"
                title={name}
              >
                {name}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlaylistToggle}
              title={isSaved ? "Remover da playlist" : "Adicionar à playlist"}
              className={`shrink-0 transition-colors ${
                isSaved
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                  : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
              }`}
            >
              {isSaved ? (
                <ListCheck className="w-5 h-5" />
              ) : (
                <ListPlus className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}

        <AudioPlayerComponent
          src={src}
          autoPlay={autoPlay}               
          autoPlayAfterSrcChange={true}
          className={
            name ? "bg-zinc-950! px-4! pb-4! pt-2!" : "bg-zinc-950! p-4!"
          }
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
              </Button>
            </div>,
          ]}
          volume={0.5}
          loop={!showSkipControls} 
          showJumpControls={false}
          showSkipControls={showSkipControls}
          onClickNext={onNext}
          onClickPrevious={onPrevious}
          onEnded={onEnded}
          onPlay={handlePlay}
          onListen={handleListen}
          onLoadStart={resetCounter}
        />
      </div>
    </Draggable>
  );
};

export default AudioPlayer;