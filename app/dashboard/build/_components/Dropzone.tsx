'use client';
import React, { useState, useEffect, useCallback } from "react";
import DropBox from "@/components/shared/DropBox";
import FileList from "./FileCard";
import { uploadFileToFolder } from "@/firebase/services";
import { useUploadContext } from "@/context/UploadContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const Dropzone = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [isUploading, setIsUploading] = useState(false);
    const [uploads, setUploads] = useState<any[]>([]); 
    const { projectId, setProjectId, setReset } = useUploadContext();
    const addGallery = useMutation(api.gallery.addGallery);

    useEffect(() => {
        const savedFiles = JSON.parse(localStorage.getItem('uploadFiles') || '[]');
        setFiles(savedFiles);
    }, []);

    useEffect(() => {
        localStorage.setItem('uploadFiles', JSON.stringify(files));
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const uploadFiles = useCallback(async () => {
        if (!projectId || isUploading || files.length === 0) return;

        setIsUploading(true);
        const filesToUpload = files.filter(file => !uploads.some(upload => upload.name === file.name));

        try {
            const newUploads = await Promise.all(filesToUpload.map(async (file) => {
                const response = await uploadFileToFolder(file, projectId, (progress) => {
                    setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
                });

                return {
                    name: response.name,
                    url: response.url,
                    type: response.type,
                    size: response.size,
                    timestamp: response.timestamp.toString(),
                };
            }));

            setUploads(prev => [...prev, ...newUploads]);
            if (newUploads.length > 0) {
                await addGallery({ projectId, uploads: newUploads });
            }
        } catch (error) {
            console.error("Error uploading files", error);
        } finally {
            setIsUploading(false);
            setFiles([]);
            setReset(true);
        }
    }, [projectId, files, uploads, isUploading, addGallery, setReset]);

    useEffect(() => {
        if (projectId) uploadFiles();
        setProjectId(null);
    }, [projectId, files, uploadFiles, setProjectId]);

    const handleDelete = (name: string) => {
        setFiles(prev => prev.filter(file => file.name !== name));
        setUploadProgress(prev => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
        setUploads(prev => prev.filter(upload => upload.name !== name));
    };

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <DropBox onDrop={onDrop} isUploading={isUploading} />
            <FileList files={files} uploadProgress={uploadProgress} onDelete={handleDelete} />
        </div>
    );
};

export default Dropzone;