"use client";

import { Control } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "@/lib/validation";
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDetailsStepProps {
  control: Control<z.infer<typeof FormSchema>>;
}

const ProjectDetailsStep = ({ control }: ProjectDetailsStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Project Details</h2>
      
      <FormField
        control={control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="Home Renovation Project" {...field} />
            </FormControl>
            <FormDescription>Enter the name of the project.</FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="owner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Owner Name</FormLabel>
            <FormControl>
              <Input placeholder="Mr. John Doe" {...field} />
            </FormControl>
            <FormDescription>Enter the owner's name.</FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input placeholder="1234567890" {...field} />
            </FormControl>
            <FormDescription>Enter the contact number.</FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="addressStreet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" {...field} />
            </FormControl>
            <FormDescription>Enter the street address.</FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="addressCity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input placeholder="City" {...field} />
            </FormControl>
            <FormDescription>Enter the city.</FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the project goals, requirements, and any specific details..." {...field} />
            </FormControl>
            <FormDescription>Provide a detailed description of the project.</FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectDetailsStep; 