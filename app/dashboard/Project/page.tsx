"use client";
import React from 'react';
import { Card } from '@/components/ui/card';
import { ProjectForm } from './_components/Create';
import Dropzone from './_components/Dropzone';

function Page() {

  return (
    <div className="p-4 w-full h-full">
      <div className="h-full w-full flex items-center gap-4">
        <div className="h-full min-w-[700px]">
          <ProjectForm />
        </div>
        <div className="w-full h-full">
          <Card className="w-full h-full flex flex-col">
            <div className="mb-8 p-4">
              <Dropzone />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;