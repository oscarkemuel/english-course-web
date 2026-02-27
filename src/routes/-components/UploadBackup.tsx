import { Button } from "@/components/ui/button";
import useBackup from "@/hooks/useBackup";
import { Upload } from "lucide-react";
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UploadBackup() {
  const { loadBackupFromFile } = useBackup();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Upload Backup"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-5 w-5" />

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                loadBackupFromFile(file);
              }
            }}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">Upload Backup</TooltipContent>
    </Tooltip>
  );
}
