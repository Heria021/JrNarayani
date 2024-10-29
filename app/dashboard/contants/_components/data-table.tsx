'use client';

import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableHead,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { forwardRef, useImperativeHandle } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type Details = {
    _id: string;
    id: string;
    email: string;
    name: string;
    city: string;
    contact: string;
    address: string;
    message: string;
    meetTime: string;
    timestamp: string;
    file: string;
};

const FormSchema = z.object({
    selectedIds: z.array(z.string()).refine((value) => value.length > 0, {
        message: "Select at least one entry.",
    }),
});

export const DetailsRow = forwardRef(({ data }: { data: Details[] }, ref) => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            selectedIds: [],
        },
    });
    const deleteContact = useMutation(api.contact.deleteContact);

    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        try {
            for (const id of formData.selectedIds) {
                await deleteContact({ id: id as Id<"contacts"> });
            }
            console.log("Selected IDs deleted:", formData.selectedIds);
            form.reset();
        } catch (error) {
            console.error("Error deleting contacts:", error);
        }
    };

    useImperativeHandle(ref, () => ({
        submit: form.handleSubmit(onSubmit),
    }));

    return (
        <div className="h-full flex-col flex w-full">
            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Meet Time</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>File</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
            <div className=" flex-grow w-full overflow-auto ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Table>
                            <TableBody>
                                {data.slice().reverse().map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="selectedIds"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value.includes(detail._id)}
                                                                onCheckedChange={(checked) => {
                                                                    const newValue = field.value || [];
                                                                    if (checked) {
                                                                        field.onChange([...newValue, detail._id]);
                                                                    } else {
                                                                        field.onChange(newValue.filter((value) => value !== detail._id));
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{detail.name}</TableCell>
                                        <TableCell>{detail.city}</TableCell>
                                        <TableCell>{detail.contact}</TableCell>
                                        <TableCell>{detail.address}</TableCell>
                                        <TableCell>{detail.message}</TableCell>
                                        <TableCell>{detail.meetTime}</TableCell>
                                        <TableCell>{detail.timestamp}</TableCell>
                                        <TableCell>{detail.file}</TableCell>
                                        <TableCell>{detail.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </form>
                </Form>
            </div>
        </div>
    );
});