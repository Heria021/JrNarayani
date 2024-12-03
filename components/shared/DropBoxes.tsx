import { Progress } from "@/components/ui/progress";
import Dropzone, { DropzoneProps } from "./UploadZone";
import { FileClockIcon, LucideUploadCloud } from "lucide-react";

interface DropzoneComponentProps {
  onDrop: DropzoneProps["onDrop"];
  isUploading: boolean;
  uploadProgress: {
    fileName: string;
    progress: number;
  } | null;
  acceptOnlyDocuments?: boolean; 
}

export function DropBoxes({
  onDrop,
  isUploading,
  uploadProgress,
  acceptOnlyDocuments = false, 
}: DropzoneComponentProps) {
  return (
    <Dropzone
      onDrop={async (acceptedFiles) => {
        const validExtensions = acceptOnlyDocuments
          ? [".pdf", ".max"]
          : [".jpg", ".jpeg", ".png", ".gif", ".webp"];

        const filteredFiles = acceptedFiles.filter((file) =>
          validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
        );

        await onDrop(filteredFiles);
      }}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
    >
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
            <p>
              Drag & Drop a {acceptOnlyDocuments ? ".pdf or .max file" : "image"} here
            </p>
          )}
        </div>
      )}
    </Dropzone>
  );
}

