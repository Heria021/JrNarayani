'use client';
import { uploadFile } from "@/firebase/services";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUpload } from "@/context/UploadContext";
import { DropzoneComponent } from "@/components/shared/DropzoneComponenet";

const DropzoneCard = () => {
    const { handleUploadResponses } = useUpload();
    const [uploadProgress, setUploadProgress] = useState<{ fileName: string; progress: number } | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setIsUploading(true);
            setUploadProgress({ fileName: file.name, progress: 0 });

            const response = await uploadFile(file, (progress) => {
                setUploadProgress({ fileName: file.name, progress });
            });

            setIsUploading(false);
            setUploadProgress(null);

            const uploadResponse = {
                name: response.name,
                url: response.url,
                type: response.type,
                size: response.size,
                timestamp: response.timestamp.toString(),
            };

            handleUploadResponses([uploadResponse]);
        }
    };

    // const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <DropzoneComponent
            onDrop={onDrop}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
        />
    );
};

export default DropzoneCard;