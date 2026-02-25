import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import type { FileStructure } from "@/hooks/useModules";
import { AudioLines, Download, FileText, PlayCircle } from "lucide-react";
import React from "react";

const getFileIcon = (type: FileStructure["type"]) => {
  switch (type) {
    case "mp4":
      return <PlayCircle className="w-4 h-4 text-zinc-300" />;
    case "pdf":
      return <FileText className="w-4 h-4 text-red-400" />;
    case "apkg":
      return <Download className="w-4 h-4 text-blue-400" />;
    case "mp3":
      return <AudioLines className="w-4 h-4 text-green-400" />;
    default:
      return <FileText className="w-4 h-4 text-zinc-300" />;
  }
};

interface AccodionItemContentProps {
  fileContent: FileStructure[];
  name: string;
  value?: string;
  handleSelectFile: (file: FileStructure) => void;
}

export const AccodionItemContent = ({
  fileContent,
  name,
  value,
  handleSelectFile,
}: AccodionItemContentProps) => (
  <AccordionItem value={value || "mod-0"} className="border-b-0 border-zinc-800">
    <AccordionTrigger className="px-4 py-3 hover:bg-zinc-800 bg-zinc-900 text-zinc-200">
      <span className="font-semibold text-sm">{name}</span>
    </AccordionTrigger>

    <AccordionContent className="pt-0 pb-0 bg-zinc-950">
      <div className="flex flex-col">
        {fileContent.map((file, index) => (
          <React.Fragment key={index}>
            <div
              className="flex items-start gap-3 p-4 cursor-pointer hover:bg-zinc-800 transition-colors group"
              onClick={() => handleSelectFile(file)}
            >
              <div className="mt-1">{getFileIcon(file.type)}</div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium leading-snug text-zinc-300 group-hover:text-zinc-50 transition-colors ${file.isWatched && `line-through text-zinc-500`}`}
                >
                  {file.name.replace(/\.[^/.]+$/, "")}
                </p>
                <p className="text-xs text-zinc-500 mt-1 uppercase font-semibold tracking-wider">
                  {file.type}
                </p>
              </div>
            </div>
            <Separator className="bg-zinc-800" />
          </React.Fragment>
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
);
