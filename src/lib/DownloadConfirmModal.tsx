import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, File } from "lucide-react";

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}

const DownloadConfirmModal = ({ open, onClose, onConfirm, fileName }: IProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <Download className="w-5 h-5 text-blue-400" />
            Confirmar Download
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 text-base mt-2">
            Você está prestes a baixar o seguinte arquivo de apoio. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-3 p-3 my-4 rounded-md bg-zinc-900 border border-zinc-800">
          <File className="w-5 h-5 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-300 truncate w-full">
            {fileName}
          </span>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Baixar Arquivo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DownloadConfirmModal;