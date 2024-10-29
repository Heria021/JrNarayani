
import { FileClockIcon, LucideUploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Dropzone, { DropzoneProps } from "./UploadZone";

interface DropzoneComponentProps {
  onDrop: DropzoneProps["onDrop"];
  isUploading: boolean;
  uploadProgress: {
    fileName: string;
    progress: number;
} | null;
}

export function DropzoneComponent({ onDrop, isUploading, uploadProgress }: DropzoneComponentProps) {
  return (
    <Dropzone onDrop={onDrop} isUploading={isUploading} uploadProgress={uploadProgress}>
      {() => (
        <div className="flex flex-col text-center items-center justify-center gap-2">
          <div className="text-primary p-2 flex items-center justify-center">
            {isUploading ? (
              <FileClockIcon size={36} />
            ) : (
              <LucideUploadCloud size={36} />
            )}
          </div>
          {isUploading ? (
            uploadProgress && (
              <div className="mt-2 w-[400px]">
                <p>{uploadProgress.fileName}</p>
                <Progress value={uploadProgress.progress} />
              </div>
            )
          ) : (
            <p>Drag & Drop a file here</p>
          )}
        </div>
      )}
    </Dropzone>
  );
}