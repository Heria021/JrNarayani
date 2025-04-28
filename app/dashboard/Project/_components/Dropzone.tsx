'use client';
import React, { useState, useEffect, useCallback } from "react";
import DropBox from "@/components/shared/DropBox";
import FileList from "./FileCard";
import { useUploadContext } from "@/context/UploadContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const Dropzone = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [isUploading, setIsUploading] = useState(false);
    const [uploads, setUploads] = useState<any[]>([]); 
    const { projectId, setProjectId, setReset, reset } = useUploadContext();
    const addGallery = useMutation(api.gallery.addGallery);

    // Load saved files from localStorage on component mount
    useEffect(() => {
        const savedFiles = JSON.parse(localStorage.getItem('uploadFiles') || '[]');
        setFiles(savedFiles);
    }, []);

    // Save files to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('uploadFiles', JSON.stringify(files));
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        setFiles(prevFiles => [...prevFiles, ...imageFiles]);
    }, []);

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();                        
        formData.append('file', file);
        
        // Add projectId to the form data if available
        if (projectId) {
            formData.append('projectId', projectId);
        }

        try {
            const response = await fetch('/api/cloudinary/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            return {
                name: file.name,
                url: data.secure_url,
                type: file.type,
                size: file.size,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const uploadFiles = useCallback(async () => {
        if (!projectId || isUploading || files.length === 0) return;

        setIsUploading(true);
        const filesToUpload = files.filter(file => !uploads.some(upload => upload.name === file.name));

        try {
            const newUploads = await Promise.all(filesToUpload.map(async (file) => {
                try {
                    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
                    const result = await uploadToCloudinary(file);
                    setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
                    return result;
                } catch (error) {
                    toast.error(`Failed to upload ${file.name}`);
                    throw error;
                }
            }));

            setUploads(prev => [...prev, ...newUploads]);
            if (newUploads.length > 0) {
                await addGallery({ projectId, uploads: newUploads });
                toast.success('Files uploaded successfully');
            }
            
            // Clear files
            setFiles([]);
            localStorage.removeItem('uploadFiles');
            
            // Set reset flag to true after successful upload
            setReset(true);
            
            // Clear the projectId
            setProjectId(null);
        } catch (error) {
            console.error("Error uploading files", error);
            toast.error('Failed to upload some files');
        } finally {
            setIsUploading(false);
        }
    }, [projectId, files, uploads, isUploading, addGallery, setProjectId, setReset]);

    // Add a useEffect to handle the reset flag
    useEffect(() => {
        // This effect will run when the component mounts and when reset changes
        // We don't need to do anything here, just ensure the effect is registered
    }, [reset]);

    // Trigger upload when projectId changes
    useEffect(() => {
        if (projectId) {
            console.log("ProjectId received, starting upload:", projectId);
            uploadFiles();
        }
    }, [projectId, uploadFiles]);

    const handleDelete = (name: string) => {
        setFiles(prev => prev.filter(file => file.name !== name));
        setUploadProgress(prev => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
        setUploads(prev => prev.filter(upload => upload.name !== name));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4">
                <DropBox onDrop={onDrop} isUploading={isUploading} />
            </div>

            {files.length > 0 && (
                <div className="flex-1 overflow-auto">
                    <FileList 
                        files={files} 
                        onDelete={handleDelete}
                        uploadProgress={uploadProgress}
                    />
                </div>
            )}
        </div>
    );
};

export default Dropzone;