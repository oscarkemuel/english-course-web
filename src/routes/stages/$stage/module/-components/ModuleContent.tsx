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
  function getPriority(str: string) {
    const firstChar = str.charAt(0);

    if (/^[a-zA-Z]/.test(firstChar)) return 0;
    if (/^[0-9]/.test(firstChar)) return 1;
    return 2;
  }

  const audios = files.audios.sort((a, b) => {
    const priorityA = getPriority(a.name);
    const priorityB = getPriority(b.name);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

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
            name="Lessons"
            value="lessons"
            fileContent={files.videos}
            handleSelectFile={handleSelectFile}
          />

          {files.audios.length > 0 && (
            <AccodionItemContent
              name="Audios"
              value="audios"
              fileContent={audios}
              handleSelectFile={handleSelectFile}
            />
          )}

          {files.materials.length > 0 && (
            <AccodionItemContent
              name="Materials"
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
