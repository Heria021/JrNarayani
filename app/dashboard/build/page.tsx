"use client";

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectForm } from './_components/ProjectForm';
import { FileCard } from './_components/Uploads';
import { useUpload } from '@/context/UploadContext';
import DropzoneCard from './_components/Dropzone';

function Page() {
  const { uploadResponses, handleDelete, handleDeleteAllUploads } = useUpload();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handleDeleteAllUploads();
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleDeleteAllUploads]);

  return (
    <div className="p-4 w-full h-full">
      <div className="h-full w-full flex items-center gap-4">
        <div className="h-full min-w-[700px]">
          <ProjectForm />
        </div>
        <div className="w-full h-full">
          <Card className="w-full h-full shadow-none flex flex-col">
            <div className="mb-8 p-4">
              <DropzoneCard />
            </div>
            {/* <CardHeader className='p-4'>
              <div className="text">
                <h1 className="text-2xl font-semibold">Collections</h1>
                <p className="text-primary leading-none text-sm">
                  Upload files to organize and showcase collections effortlessly.
                </p>
              </div>
              <div className="border-b border-border"></div>
            </CardHeader> */}
            <CardContent className="flex-grow overflow-auto p-4">
              <FileCard uploadResponses={uploadResponses} handleDelete={handleDelete} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;