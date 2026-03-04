import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "@tanstack/react-router";

export default function PlaylistButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/playlist" });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Go to Playlist"
            onClick={handleClick}
          >
            <Play className="h-5 w-5" color="#fff" />
          </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Go to Playlist</TooltipContent>
    </Tooltip>
  );
}
