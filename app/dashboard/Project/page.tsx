"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Dropzone from './_components/Dropzone';
import { useUploadContext } from '@/context/UploadContext';
import { MultiStepForm } from './_components/multi-step-form/MultiStepForm';

function Page() {
  const [activeStepType, setActiveStepType] = useState<string>("");
  const { projectId } = useUploadContext();

  // Listen for changes in the active step type
  useEffect(() => {
    const handleStepChange = (event: CustomEvent) => {
      setActiveStepType(event.detail.stepType);
    };

    window.addEventListener('stepChange', handleStepChange as EventListener);
    return () => {
      window.removeEventListener('stepChange', handleStepChange as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full w-full overflow-hidden">
      {/* Form Section */}
      <div className="w-full lg:w-[700px] lg:min-w-[700px] h-full overflow-auto">
        <MultiStepForm />
      </div>

      {/* Dropzone Section */}
      <Card className="flex-1 h-full rounded-2xl bg-muted/20 overflow-hidden shadow-none">
        <div className="flex-1 p-4 overflow-auto">
          <Dropzone/>
        </div>
      </Card>
    </div>
  );
}

export default Page;