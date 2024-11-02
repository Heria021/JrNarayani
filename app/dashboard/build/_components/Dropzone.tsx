'use client';
import React, { useState, useEffect, useCallback } from "react";
import DropBox from "@/components/shared/DropBox";
import FileList from "./FileCard";
import { uploadFileToFolder } from "@/firebase/services";
import { useUploadContext } from "@/context/UploadContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UploadResponse {
    name: string;
    url: string;
    type: string;
    size: number;
    timestamp: string;
}

const Dropzone = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [isUploading, setIsUploading] = useState(false);
    const [uploads, setUploads] = useState<UploadResponse[]>([]); 
    const { projectId, setProjectId, setReset } = useUploadContext();
    const addGallery = useMutation(api.gallery.addGallery);

    useEffect(() => {
        const savedFiles = JSON.parse(localStorage.getItem('uploadFiles') || '[]');
        if (savedFiles.length > 0) setFiles(savedFiles);
    }, []);

    useEffect(() => {
        localStorage.setItem('uploadFiles', JSON.stringify(files));
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }, []);

    // Function to handle the uploading of files
    const uploadWithFolder = useCallback(async () => {
        if (!projectId || isUploading || files.length === 0) return;

        setIsUploading(true);
        const newUploads: UploadResponse[] = [];
        
        const filesToUpload = files.filter(file => !uploads.some(response => response.name === file.name));
        
        const uploadPromises = filesToUpload.map(async (file) => {
            try {
                const response = await uploadFileToFolder(file, projectId, (progress) => {
                    setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
                });

                const uploadResponse: UploadResponse = {
                    name: response.name,
                    url: response.url,
                    type: response.type,
                    size: response.size,
                    timestamp: response.timestamp.toString(),
                };
                newUploads.push(uploadResponse);
            } catch (error) {
                console.error(`Upload failed for ${file.name}:`, error);
            }
        });

        await Promise.all(uploadPromises);

        setUploads((prev) => [...prev, ...newUploads]);
        setIsUploading(false);

        if (newUploads.length > 0) {
            await addGallery({ projectId, uploads: newUploads });
        }
        
        setReset(true);
        setFiles([]);
    }, [projectId, files, uploads, isUploading, addGallery, setReset]);

    useEffect(() => {
        if (projectId && files.length > 0) {
            uploadWithFolder();
        }
        setProjectId(null);
    }, [projectId, files, uploadWithFolder, setProjectId]);

    const handleDelete = (name: string) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
        setUploadProgress((prev) => {
            const { [name]: _, ...remainingProgress } = prev;
            return remainingProgress;
        });
        setUploads((prevUploads) => prevUploads.filter(upload => upload.name !== name));
    };

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <DropBox onDrop={onDrop} isUploading={isUploading} />
            <FileList files={files} uploadProgress={uploadProgress} onDelete={handleDelete} />
        </div>
    );
};

export default Dropzone;