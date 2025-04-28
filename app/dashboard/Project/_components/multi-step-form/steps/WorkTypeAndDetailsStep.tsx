"use client";

import { Control } from "react-hook-form";
import { z } from "zod";
import { FormSchema, workTypeOptions } from "@/lib/validation";
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface WorkTypeAndDetailsStepProps {
  control: Control<z.infer<typeof FormSchema>>;
}

const WorkTypeAndDetailsStep = ({ control }: WorkTypeAndDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Work Type & Project Details</h2>
      
      {/* Work Types Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Type of Work</h3>
        <FormField
          control={control}
          name="tools"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-3">
              <FormLabel className="text-base">What type of work is required?</FormLabel>
              <FormDescription>
                Select all the types of work that apply to your project. You can select multiple options.
              </FormDescription>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {workTypeOptions.map((option) => (
                  <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          const newValue = field.value || [];
                          return checked
                            ? field.onChange([...newValue, option.id])
                            : field.onChange(newValue.filter((value: string) => value !== option.id));
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">{option.label}</FormLabel>
                      <FormDescription className="text-xs">
                        {option.id === "Interior" && "Interior design and renovation work"}
                        {option.id === "Exterior" && "Exterior design and renovation work"}
                        {option.id === "Blue Print" && "Architectural blueprint and planning"}
                      </FormDescription>
                    </div>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Project Size Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Project Size Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="bedRooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Number of bedrooms</FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="bathRooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Number of bathrooms</FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Floor number</FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sq ft)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1200" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Total area in square feet</FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Project Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Project Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>When will the project start?</FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>When is the project expected to finish?</FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkTypeAndDetailsStep; 