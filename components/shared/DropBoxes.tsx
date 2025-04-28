import { Progress } from "@/components/ui/progress";
import Dropzone, { DropzoneProps } from "./UploadZone";
import { FileClockIcon, LucideUploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <div className={cn(
            "p-4 rounded-full transition-colors duration-200",
            isUploading 
              ? "bg-primary/10 text-primary" 
              : "bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
          )}>
            {isUploading ? (
              <FileClockIcon className="w-8 h-8 animate-pulse" />
            ) : (
              <LucideUploadCloud className="w-8 h-8" />
            )}
          </div>
          
          {isUploading ? (
            uploadProgress && (
              <div className="w-full max-w-md space-y-2">
                <p className="text-sm text-foreground truncate text-center">
                  {uploadProgress.fileName}
                </p>
                <Progress 
                  value={uploadProgress.progress} 
                  className="h-2"
                />
              </div>
            )
          ) : (
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Drag & Drop a {acceptOnlyDocuments ? "document" : "image"} here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse files
              </p>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
}

