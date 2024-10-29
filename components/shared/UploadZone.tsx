// Dropzone.tsx
'use client';
import React from 'react';
import { useDropzone } from 'react-dropzone';

export interface DropzoneProps {
    onDrop: (acceptedFiles: File[]) => Promise<void>;
    isUploading: boolean;
    uploadProgress: { fileName: string; progress: number } | null;
    children: (uploadProgress: { fileName: string; progress: number } | null, isUploading: boolean) => React.ReactNode;
}

const Dropzone = ({ onDrop, isUploading, uploadProgress, children }: DropzoneProps) => {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div
            {...getRootProps({
                className: `border-2 border-dashed border-primary rounded-lg p-4 flex items-center justify-center h-60 cursor-pointer transition-colors hover:bg-blue-100 ${isUploading ? 'pointer-events-none' : ''}`,
            })}
        >
            <input {...getInputProps()} />
            {children(uploadProgress, isUploading)}
        </div>
    );
};

export default Dropzone;