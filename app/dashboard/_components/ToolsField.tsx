import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface ToolOption {
    id: string;
    label: string;
}

interface ToolsFieldProps {
    control: any; 
    name: string;
    toolsOptions: ToolOption[];
}

const ToolsField: React.FC<ToolsFieldProps> = ({ control, name, toolsOptions }) => {
    return (
        <FormItem className="flex justify-start">
            <div className="flex-1">
                <FormLabel>Tools</FormLabel>
                <FormDescription>Select the tools you want to use.</FormDescription>
            </div>
            <div className="flex-1 space-y-1 pr-16">
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <>
                            {toolsOptions.map((tool) => (
                                <FormItem key={tool.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(tool.id) || false}
                                            onCheckedChange={(checked) => {
                                                const newValue = field.value || [];
                                                return checked
                                                    ? field.onChange([...newValue, tool.id])
                                                    : field.onChange(newValue.filter((value: string) => value !== tool.id));
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">{tool.label}</FormLabel>
                                </FormItem>
                            ))}
                        </>
                    )}
                />
            </div>
        </FormItem>
    );
};

export default ToolsField;