import React from "react";
import { FormControl, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Controller } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateFieldProps {
    control: any; 
    name: string;
    label: string;
    description?: string;
}

const DateField = ({ control, name, label, description }: DateFieldProps) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="items-center">
                    <div className="flex-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[400px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    onSelect={(date) => {
                                        if (date) {
                                            const dateString = format(date, 'yyyy-MM-dd');
                                            field.onChange(dateString);
                                        }
                                    }}
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default DateField;