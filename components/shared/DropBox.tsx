'use client';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FileClockIcon, LucideUploadCloud } from 'lucide-react';

interface DropBoxProps {
  onDrop: (acceptedFiles: File[]) =>  void;
  isUploading: boolean;
  activeStepType?: string;
}

const DropBox = ({ onDrop, isUploading, activeStepType }: DropBoxProps) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps({  
        className: `border-2 border-dashed border-primary rounded-lg p-4 flex items-center justify-center h-60 cursor-pointer transition-colors hover:bg-blue-100 ${isUploading ? 'pointer-events-none' : ''}`,
      })}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col text-center items-center justify-center gap-2">
        <FileClockIcon size={36} className="text-primary p-2" />
        <p>Drag & Drop a file here {activeStepType ? `for ${activeStepType} work` : ''}</p>
      </div>
    </div>
  );
};

export default DropBox;