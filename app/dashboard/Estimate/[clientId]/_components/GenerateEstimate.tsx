"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardFooter } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DateField from "./DateField";

const EstimateSchema = z.object({
    gstPercentage: z.number().min(0, "GST must be a positive number"),
    estimateNumber: z.string().nonempty("Invoice number is required"),
    date: z.string().nonempty("Date is required"),
    items: z
        .array(
            z.object({
                description: z.string().nonempty("Description is required"),
                quantity: z.number().min(1, "Quantity must be at least 1"),
                price: z.number().min(0, "Price must be a positive number"),
                per: z.enum(["Box", "NOs"]).refine((val) => val !== undefined, {
                    message: "Per must be 'Box' or 'NOs'",
                }),
            })
        )
        .min(1, "At least one item is required"),
});

export type EstimateData = z.infer<typeof EstimateSchema>;

type EstimateFormProps = {
    clientId: Id<"client">;
    onGenerateInvoice: (data: Id<"estimate">) => void;
};

const EstimateForm: React.FC<EstimateFormProps> = ({ clientId, onGenerateInvoice }) => {
    const client = useQuery(api.client.client, { id: clientId });
    const [itemCount, setItemCount] = useState(1);
    const [currentEstimate, setCurrentEstimate] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [transactionType, setTransactionType] = useState<"credit" | "debit">("credit");

    const estimate = useQuery(api.estimate.getCurrentEstimate);
    const addEstimate = useMutation(api.estimate.insertEstimate);
    const incrementEstimate = useMutation(api.estimate.incrementEstimateNumber);

    const form = useForm<EstimateData>({
        resolver: zodResolver(EstimateSchema),
        defaultValues: {
            gstPercentage: 18,
            estimateNumber: "",
            date: "",
            items: [{ description: "", quantity: 1, price: 0, per: "Box" }],
        },
    });

    const calculateTotals = (items: EstimateData["items"], gstPercentage: number) => {
        const subtotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
        const tax = subtotal * (gstPercentage / 100);
        const total = subtotal + tax;
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
        };
    };

    useEffect(() => {
        if (estimate) {
            const estimateNumber = (estimate[0]?.estimate + 1) || 1;
            const year = new Date().getFullYear();
            const formattedNumber = `Est-${year}-${String(estimateNumber).padStart(4, "0")}`;
            setCurrentEstimate(formattedNumber);
        }
    }, [estimate]);

    const { handleSubmit, register, getValues, setValue, control } = form;

    const addItem = () => {
        const items = getValues("items");
        setValue("items", [...items, { description: "", quantity: 1, price: 0, per: "Box" }]);
        setItemCount(itemCount + 1);
    };

    const onSubmit = async (data: EstimateData) => {
        setIsSubmitting(true);
        if (currentEstimate !== null) {
            data.estimateNumber = currentEstimate;
        }

        const { subtotal, tax, total } = calculateTotals(data.items, data.gstPercentage);

        const price = { subtotal, tax, total };

        const estimateFinance = {
            credit: transactionType === "credit" ? total : 0,
            debit: transactionType === "debit" ? total : 0,
        };

        if (client?._id) {
            const EstimateInfo = await addEstimate({ ...data, price, estimateFinance, clientId: client._id });
            console.log(EstimateInfo);
            onGenerateInvoice(EstimateInfo as any);
        }
        incrementEstimate();
        setIsSubmitting(false);
    };

    const { subtotal, tax, total } = calculateTotals(getValues("items"), getValues("gstPercentage"));

    return (
        <Card className="shadow-md rounded-lg p-6">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="clientName">Client Name</Label>
                            <Input id="clientName" disabled value={client?.clientName || ""} />

                            <Label htmlFor="clientNumber">Client Number</Label>
                            <Input id="clientNumber" disabled value={client?.clientNumber || ""} />

                            <Label htmlFor="estimateNumber">Estimate Number</Label>
                            <Input
                                value={currentEstimate || ""}
                                readOnly
                                {...register("estimateNumber")}
                                placeholder="Generated automatically"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="clientAddress.home">Home Address</Label>
                            <Input id="clientAddress.home" disabled value={client?.clientAddress.home || ""} />

                            <Label htmlFor="clientAddress.street">Street Address</Label>
                            <Input id="clientAddress.street" disabled value={client?.clientAddress.street || ""} />

                            <Label htmlFor="clientAddress.city">City Location</Label>
                            <Input id="clientAddress.city" disabled value={client?.clientAddress.city || ""} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="gstPercentage">GST Percentage</Label>
                            <Input
                                id="gstPercentage"
                                type="number"
                                {...register("gstPercentage", { valueAsNumber: true })}
                                placeholder="Enter GST percentage"
                            />
                        </div>
                        <div className=" flex gap-2 ">
                            <div className="">
                                <Label htmlFor="date">Invoice Date</Label>
                                <DateField control={control} name="date" label="Invoice Date" description="Select the invoice date" />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="transactionStatus">Transaction Status</Label>
                                <Select  onValueChange={(value) => setTransactionType(value as "credit" | "debit")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="credit">Credit</SelectItem>
                                            <SelectItem value="debit">Debit</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Items</h2>
                        {Array.from({ length: itemCount }).map((_, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 mb-2">
                                <Input {...register(`items.${index}.description`)} placeholder="Description" />
                                <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} placeholder="Quantity" />
                                <Input type="number" {...register(`items.${index}.price`, { valueAsNumber: true })} placeholder="Price" />
                                <Select
                                    {...register(`items.${index}.per`)}
                                    onValueChange={(value) => setValue(`items.${index}.per`, value as "Box" | "NOs")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Per" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Box">Box</SelectItem>
                                            <SelectItem value="NOs">NOs</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                        <Button type="button" onClick={addItem} variant="outline" className="mt-2">
                            + Add Item
                        </Button>
                    </div>

                    <CardFooter className="space-y-2 flex w-full justify-end">
                        <div className="space-y-2 pr-4">
                            <div className="text-sm grid grid-cols-2 text-right gap-2 items-end border-b-[1px] border-black">
                                <div className="font-bold">Subtotal</div>
                                <div className="font-medium">{`${subtotal.toFixed(2)}`}</div>
                            </div>
                            <div className="text-sm grid grid-cols-2 text-right gap-2 items-end border-b-[1px] border-black">
                                <div className="font-bold">Tax</div>
                                <div className="font-medium">{`${tax.toFixed(2)}`}</div>
                            </div>
                            <div className="text-sm grid grid-cols-2 text-right gap-2 items-end border-b-[1px] border-black">
                                <div className="font-bold">Total</div>
                                <div className="font-medium">{`${total.toFixed(2)}`}</div>
                            </div>
                        </div>
                    </CardFooter>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Processing..." : "Generate Invoice"}
                    </Button>
                </form>
            </Form>
        </Card>
    );
};

export default EstimateForm;