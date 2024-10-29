'use client'
import React, { createContext, useContext, useState } from "react";
import { deleteFile } from "@/firebase/services";

export type UploadResponse = {
  name: string;
  url: string;
  type: string;
  size: number;
  timestamp: string;
};

type UploadContextType = {
  uploadResponses: UploadResponse[];
  handleUploadResponses: (responses: UploadResponse[]) => void;
  handleDelete: (name: string, timestamp: string) => void;
  handleDeleteAllUploads: () => void;
  eraseUpload: () => void; 
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [uploadResponses, setUploadResponses] = useState<UploadResponse[]>([]);

  const handleUploadResponses = (responses: UploadResponse[]) => {
    setUploadResponses((prevResponses) => [...prevResponses, ...responses]);
    console.log("Upload Responses:", responses);
  };

  const handleDelete = async (name: string, timestamp: string) => {
    const fileId = `${timestamp}_${name}`;
    try {
      await deleteFile(fileId);
      setUploadResponses((prevResponses) =>
        prevResponses.filter((response) => response.timestamp !== timestamp)
      );
      console.log(`File ${fileId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting file: ", error);
    }
  };

  const handleDeleteAllUploads = () => {
    uploadResponses.forEach((response) => {
      const fileId = `${response.timestamp}_${response.name}`;
      deleteFile(fileId);
    });
    setUploadResponses([]);
  };

  const eraseUpload = () => {
    setUploadResponses([]);
  };


  return (
    <UploadContext.Provider
      value={{
        uploadResponses,
        handleUploadResponses,
        handleDelete,
        handleDeleteAllUploads,
        eraseUpload,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};