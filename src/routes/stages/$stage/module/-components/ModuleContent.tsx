import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Files, FileStructure } from "@/hooks/useModules";
import { AccodionItemContent } from "./AccodionItemContent";

interface ModuleContentProps {
  files: Files;
  handleSelectFile: (file: FileStructure) => void;
}

export const ModuleContent = ({
  files,
  handleSelectFile,
}: ModuleContentProps) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full w-full">
        <Accordion
          type="single"
          defaultValue="lessons"
          collapsible
          className="w-full"
        >
          <AccodionItemContent
            name="Aulas"
            value="lessons"
            fileContent={files.videos}
            handleSelectFile={handleSelectFile}
          />

          {files.audios.length > 0 && (
            <AccodionItemContent
              name="Áudios"
              value="audios"
              fileContent={files.audios}
              handleSelectFile={handleSelectFile}
            />
          )}

          {files.materials.length > 0 && (
            <AccodionItemContent
              name="Materiais"
              value="materials"
              fileContent={files.materials}
              handleSelectFile={handleSelectFile}
            />
          )}
        </Accordion>
      </ScrollArea>
    </div>
  );
};
