import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IProps {
  open: boolean;
  handleClose: () => void;
  fileUrl: string;
}

const PdfViewerModal = ({ handleClose, open, fileUrl }: IProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden bg-zinc-950 border-zinc-800 [&>button]:text-zinc-300 [&>button]:hover:text-zinc-50 [&>button]:bg-zinc-900 [&>button]:p-1 [&>button]:rounded-md [&>button]:right-6 [&>button]:top-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Material de Apoio</DialogTitle>
        </DialogHeader>

        <div className="flex-1 w-full h-full bg-zinc-900 overflow-hidden">
          <iframe
            src={`${fileUrl}#zoom=100`}
            title="Visualizador de PDF"
            className="w-full h-full border-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerModal;
