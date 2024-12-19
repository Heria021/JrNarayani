import React from "react";
import { FormControl, FormItem, FormLabel, FormDescription, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

interface FormFieldProps {
    control: any;
    name: string;
    label: string;
    description?: string;
    placeholder?: string;
    type?: "text" | "number" | "textarea" | "checkbox";
    isChecked?: boolean;
}

const InputField = ({ control, name, label, description, placeholder, type, isChecked }: FormFieldProps) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center">
                    <div className="flex-1">
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>{description}</FormDescription>
                    </div>
                    <div className="flex-1 pr-20">
                        {type === "textarea" ? (
                            <Textarea {...register(name)} placeholder={placeholder} className="resize-none" />
                        ) : type === "checkbox" ? (
                            <Checkbox {...register(name)} checked={isChecked} />
                        ) : type === "text" ? (
                            <Input type={type} {...register(name)} placeholder={placeholder} />
                        ) : (
                            <Input
                                type="number"
                                {...field}
                                placeholder="2"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? Number(value) : undefined);
                                }}
                            />
                        )}
                        {/* <FormMessage /> */}
                    </div>
                </FormItem>
            )}
        />
    );
};

export default InputField;