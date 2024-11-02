
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



// 'use client';
// import React from 'react';
// import { useDropzone } from 'react-dropzone';
// import { FileClockIcon, LucideUploadCloud } from 'lucide-react';
// import { Progress } from '@/components/ui/progress';

// interface DropBoxProps {
//   onDrop: (acceptedFiles: File[]) => Promise<void>;
//   isUploading: boolean;
//   uploadProgress: {
//     fileName: string;
//     progress: number;
//   } | null;
// }

// const DropBox = ({ onDrop, isUploading, uploadProgress }: DropBoxProps) => {
//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   return (
//     <div
//       {...getRootProps({
//         className: `border-2 border-dashed border-primary rounded-lg p-4 flex items-center justify-center h-60 cursor-pointer transition-colors hover:bg-blue-100 ${isUploading ? 'pointer-events-none' : ''}`,
//       })}
//     >
//       <input {...getInputProps()} />
//       <div className="flex flex-col text-center items-center justify-center gap-2">
//         <div className="text-primary p-2 flex items-center justify-center">
//           {isUploading ? (
//             <FileClockIcon size={36} />
//           ) : (
//             <LucideUploadCloud size={36} />
//           )}
//         </div>
//         {isUploading ? (
//           uploadProgress && (
//             <div className="mt-2 w-[400px]">
//               <p>{uploadProgress.fileName}</p>
//               <Progress value={uploadProgress.progress} />
//             </div>
//           )
//         ) : (
//           <p>Drag & Drop a file here</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DropBox;