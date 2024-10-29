"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useUpload } from "@/context/UploadContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

const FormSchema = z.object({
    projectName: z.string().nonempty({ message: "Project Name is required" }),
    owner: z.string().nonempty({ message: "Owner is required" }),
    contact: z.string().nonempty({ message: "Contact is required" }).regex(/^\d+$/, {
        message: "Contact must be a number",
    }),
    addressStreet: z.string().nonempty({ message: "Street is required" }),
    addressCity: z.string().nonempty({ message: "City is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    tools: z.array(z.string()).refine((value) => value.length > 0, {
        message: "Select at least one tool.",
    }),
    uploads: z.array(z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
        timestamp: z.string(),
    })),
    bedRooms: z.number().min(0, { message: "Bedrooms must be a non-negative number." }),
    bathRooms: z.number().min(0, { message: "Bathrooms must be a non-negative number." }),
    floor: z.number().min(0, { message: "Floor must be a non-negative number." }),
    area: z.number().min(0, { message: "Area must be a non-negative number." }),
    startDate: z.string().nonempty({ message: "Start Date is required" }),
    endDate: z.string().optional(),
});

const toolsOptions = [
    { id: "Interior", label: "Interior" },
    { id: "Exterior", label: "Exterior" },
    { id: "Blue Print", label: "Blue Print" },
];

export function ProjectForm() {
    const addProject = useMutation(api.upload.createProject);
    const addGallery = useMutation(api.gallery.addGallery);
    const addRecent = useMutation(api.recents.createProjectEntry);


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            tools: [],
            uploads: [],
            bedRooms: 0,
            bathRooms: 0,
            floor: 0,
            area: 0,
            startDate: '',
            endDate: ''
        },
    });

    const { uploadResponses, eraseUpload } = useUpload();

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        const finalData = {
            ...data,
            uploads: uploadResponses,
            endDate: data.endDate || "",
            bedRooms: Number(data.bedRooms),
            bathRooms: Number(data.bathRooms),
            floor: Number(data.floor),
            area: Number(data.area),
        };

        try {
            const createProject = await addProject(finalData);
            if (createProject) {
                const finalData = {
                    projectId: createProject as Id<'projects'>,
                    uploads: uploadResponses,
                };
                await addRecent({ projectId: createProject as Id<'projects'> });
                await addGallery(finalData);
            }
        } catch (error) {
            console.error("Error adding project:", error);
        }

        eraseUpload();
        form.reset({
            projectName: '',
            owner: '',
            contact: '',
            addressStreet: '',
            addressCity: '',
            description: '',
            tools: [],
            uploads: [],
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" h-full flex flex-col justify-between">
                <div className="mb-8 border border-border rounded-md p-4">
                    <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Project Name</FormLabel>
                                    <FormDescription>Enter the name of the project.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input {...field} placeholder="Home Renovation Project" />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="owner"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Owner</FormLabel>
                                    <FormDescription>Enter the owner's name.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input {...field} placeholder="John Doe" />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Contact</FormLabel>
                                    <FormDescription>Enter contact number (digits only).</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input {...field} placeholder="70142247460" />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="addressStreet"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Street</FormLabel>
                                    <FormDescription>Enter the street address.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input {...field} placeholder="123 Main St" />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="addressCity"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>City</FormLabel>
                                    <FormDescription>Enter the city name.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input {...field} placeholder="New York" />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormDescription>Enter a brief project description.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormMessage /> */}
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tools"
                        render={({ field }) => (
                            <FormItem className="flex justify-start">
                                <div className="flex-1">
                                    <FormLabel>Tools</FormLabel>
                                    <FormDescription>Select the tools you want to use.</FormDescription>
                                </div>
                                <div className="flex-1 space-y-1 pr-16">
                                    {toolsOptions.map((tool) => (
                                        <FormField
                                            key={tool.id}
                                            control={form.control}
                                            name="tools"
                                            render={({ field: checkboxField }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={checkboxField.value?.includes(tool.id) || false}
                                                            onCheckedChange={(checked) => {
                                                                const newValue = checkboxField.value || [];
                                                                return checked
                                                                    ? checkboxField.onChange([...newValue, tool.id])
                                                                    : checkboxField.onChange(newValue.filter((value) => value !== tool.id));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal">{tool.label}</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                {/* <FormMessage /> */}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bedRooms"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Bedrooms</FormLabel>
                                    <FormDescription>Enter the number of bedrooms.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="2"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? Number(value) : undefined);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bathRooms"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Bathrooms</FormLabel>
                                    <FormDescription>Enter the number of bathrooms.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input type="number" {...field} placeholder="2" onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value ? Number(value) : undefined);
                                        }} />
                                    </FormControl>
                                    <FormMessage />

                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="floor"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Floor</FormLabel>
                                    <FormDescription>Enter the floor number.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input type="number" {...field} placeholder="1" onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value ? Number(value) : undefined);
                                        }} />
                                    </FormControl>
                                    <FormMessage />

                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Area (sq ft)</FormLabel>
                                    <FormDescription>Enter the area in square feet.</FormDescription>
                                </div>
                                <div className="flex-1 p-1 pr-20">
                                    <FormControl>
                                        <Input type="number" {...field} placeholder="1200" onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value ? Number(value) : undefined);
                                        }} />
                                    </FormControl>
                                    <FormMessage />

                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>Start Date</FormLabel>
                                    <FormDescription>Select the project start date.</FormDescription>
                                </div>
                                <div className=" flex-1 p-1 pr-20">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
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
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center">
                                <div className="flex-1">
                                    <FormLabel>End Date</FormLabel>
                                    <FormDescription>Select the project end date.</FormDescription>
                                </div>
                                <div className=" flex-1 p-1 pr-20">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
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
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="">
                    <div className="flex justify-end w-full">
                        <Button type="submit" className=" w-full">Save & Submit</Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}