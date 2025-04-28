"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUploadContext } from "@/context/UploadContext";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ProjectDetailsStep from "./steps/ProjectDetailsStep";
import WorkTypeAndDetailsStep from "./steps/WorkTypeAndDetailsStep";
import FormStepWrapper from "./FormStepWrapper";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Define form data type without Zod
type FormData = {
  projectName: string;
  owner: string;
  contact: string;
  addressStreet: string;
  addressCity: string;
  description: string;
  tools: string[];
  bedRooms: number;
  bathRooms: number;
  floor: number;
  area: number;
  startDate: string;
  endDate?: string; // Make endDate optional
};

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addProject = useMutation(api.upload.createProject);
  const addRecent = useMutation(api.recents.createProjectEntry);
  const { setProjectId, reset, setReset } = useUploadContext();

  const form = useForm<FormData>({
    defaultValues: {
      projectName: "",
      owner: "",
      contact: "",
      addressStreet: "",
      addressCity: "",
      description: "",
      tools: [],
      bedRooms: 0,
      bathRooms: 0,
      floor: 0,
      area: 0,
      startDate: "",
      endDate: "",
    },
    mode: "onChange",
  });

  const handleNext = (e: React.MouseEvent) => {
    // Prevent form submission
    e.preventDefault();
    // Simply move to the next step without validation
    setCurrentStep(2);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    // Prevent form submission
    e.preventDefault();
    setCurrentStep(1);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Submit to the server with endDate defaulting to empty string if undefined
      const finalData = {
        ...data,
        endDate: data.endDate || "",
      };
      
      // Create the project
      const createProject = await addProject(finalData);
      
      // Add to recent projects
      await addRecent({
        projectId: createProject as Id<'projects'>,
        update: "New Project Created",
        uploads: []
      });
      
      // Set the projectId to trigger image uploads
      setProjectId(createProject);
      
      // Show success toast
      toast.success('Project created successfully! Uploading images...');
      
      // Don't reset the form here - it will be reset after images are uploaded
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when reset flag is set
  useEffect(() => {
    if (reset) {
      form.reset({
        projectName: "",
        owner: "",
        contact: "",
        addressStreet: "",
        addressCity: "",
        description: "",
        tools: [],
        bedRooms: 0,
        bathRooms: 0,
        floor: 0,
        area: 0,
        startDate: "",
        endDate: "",
      });
      setCurrentStep(1);
      setIsSubmitting(false);
      setReset(false);
    }
  }, [reset, form, setReset]);

  // Individual step render functions
  const renderProjectDetailsStep = () => {
    return (
      <FormStepWrapper step={1} currentStep={currentStep}>
        <div className="p-4 border rounded-lg bg-card">
          <ProjectDetailsStep control={form.control} />
        </div>
      </FormStepWrapper>
    );
  };

  const renderWorkTypeAndDetailsStep = () => {
    return (
      <FormStepWrapper step={2} currentStep={currentStep}>
        <div className="p-4 border rounded-lg bg-card">
          <WorkTypeAndDetailsStep control={form.control} />
        </div>
      </FormStepWrapper>
    );
  };

  // Function to render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderProjectDetailsStep();
      case 2:
        return renderWorkTypeAndDetailsStep();
      default:
        return renderProjectDetailsStep();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
        {/* Form steps */}
        <div className="min-h-[400px] h-full relative overflow-hidden">
          {renderCurrentStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between w-full mt-4 gap-4">
          {currentStep > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <Button
                type="button"
                variant="outline"
                className="rounded-xl w-full"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            </motion.div>
          )}

          {currentStep < 2 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn("flex-1", currentStep === 1 && "ml-auto")}
            >
              <Button
                type="button"
                className="rounded-xl w-full"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1"
            >
              <Button type="submit" className="rounded-xl w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </form>
    </Form>
  );
} 