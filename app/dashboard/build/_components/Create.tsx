"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import InputField from "./InputField";
import DateField from "./DateField";
import ToolsField from "./ToolsField";
import { FormSchema } from "@/lib/validation";
import { useUploadContext } from "@/context/UploadContext";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const toolsOptions = [
    { id: "Interior", label: "Interior" },
    { id: "Exterior", label: "Exterior" },
    { id: "Blue Print", label: "Blue Print" },
];

export function ProjectForm() {
    const addProject = useMutation(api.upload.createProject);
    const addRecent = useMutation(api.recents.createProjectEntry);
    const { setProjectId, reset, setReset } = useUploadContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            tools: [],
            bedRooms: 0,
            bathRooms: 0,
            floor: 0,
            area: 0,
            startDate: '',
            endDate: ''
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true);

        const finalData = {
            ...data,
            endDate: data.endDate || "",
            bedRooms: Number(data.bedRooms),
            bathRooms: Number(data.bathRooms),
            floor: Number(data.floor),
            area: Number(data.area),
        };

        try {
            const createProject = await addProject(finalData);
            await addRecent({ projectId: createProject as Id<'projects'> });
            setProjectId(createProject)

        } catch (error) {
            console.error("Error adding project:", error);
        }


    }

    useEffect(() => {
        if (reset) {
            form.reset({
                projectName: '',
                owner: '',
                contact: '',
                addressStreet: '',
                addressCity: '',
                description: '',
                tools: [],
            });
            setIsSubmitting(false);
            setReset(false);
        }
    }, [reset, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" h-full flex flex-col justify-between">
                <div className=" border border-border rounded-xl p-4">
                    <InputField
                        control={form.control}
                        name="projectName"
                        label="Project Name"
                        description="Enter the name of the project."
                        placeholder="Home Renovation Project"
                        type="text"
                    />
                    <InputField
                        control={form.control}
                        name="owner"
                        label="Owner"
                        description="Enter the owner's name."
                        placeholder="Mr Hariom Suthar"
                        type="text"
                    />
                    <InputField
                        control={form.control}
                        name="contact"
                        label="Contact"
                        description="Enter contact number (digits only)."
                        placeholder="70142247460"
                        type="text"
                    />
                    <InputField
                        control={form.control}
                        name="addressStreet"
                        label="Street"
                        description="Enter the street address."
                        placeholder="PWD Road, Dariba"
                        type="text"
                    />
                    <InputField
                        control={form.control}
                        name="addressCity"
                        label="City"
                        description="Enter the city name."
                        placeholder="Bidasar"
                        type="text"
                    />
                    <InputField
                        control={form.control}
                        name="description"
                        label="Description"
                        description="Enter a brief project description."
                        placeholder="Tell us a little bit about the project."
                        type="textarea"
                    />
                    <ToolsField
                        control={form.control}
                        name="tools"
                        toolsOptions={toolsOptions}
                    />
                    <InputField
                        control={form.control}
                        name="bedRooms"
                        label="Bedrooms"
                        description="Enter the number of bedrooms."
                        placeholder="2"
                        type="number"
                    />
                    <InputField
                        control={form.control}
                        name="bathRooms"
                        label="Bathrooms"
                        description="Enter the number of bathrooms."
                        placeholder="2"
                        type="number"
                    />
                    <InputField
                        control={form.control}
                        name="floor"
                        label="Floor"
                        description="Enter the floor number."
                        placeholder="1"
                        type="number"
                    />
                    <InputField
                        control={form.control}
                        name="area"
                        label="Area (sq ft)"
                        description="Enter the area in square feet."
                        placeholder="1200"
                        type="number"
                    />
                    <hr className="my-4" />
                    <DateField
                        control={form.control}
                        name="startDate"
                        label="Start Date"
                        description="Select the project start date."
                    />
                    <DateField
                        control={form.control}
                        name="endDate"
                        label="End Date"
                        description="Select the project end date."
                    />
                </div>
                <div className="">
                    <div className="flex justify-end w-full">
                        <Button type="submit" className=" rounded-xl w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader className=" animate-spin duration-75 " /> :
                                <p>Upload & Submit</p>
                            }
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}