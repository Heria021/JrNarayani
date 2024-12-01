"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateField from "./DateField";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InvoiceSchema = z.object({
  clientName: z.string().nonempty("Client name is required"),
  clientNumber: z.string().nonempty("Client number is required"),
  clientAddress: z.object({
    home: z.string().nonempty("Home address is required"),
    street: z.string().nonempty("Street address is required"),
    city: z.string().nonempty("City is required"),
  }),
  gstPercentage: z.number().min(0, "GST must be a positive number"),
  estimateNumber: z.string().nonempty("Invoice number is required"),
  date: z.string().nonempty("Date is required"),
  items: z
    .array(
      z.object({
        description: z.string().nonempty("Description is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price must be a positive number"),
        per: z.enum(["Box", "NOs"]).refine(
          (val) => val !== undefined,
          { message: "Per must be 'Box' or 'NOs'" }
        ),
      })
    )
    .min(1, "At least one item is required"),
});

export type InvoiceData = z.infer<typeof InvoiceSchema>;

const InvoiceForm: React.FC<{ onGenerateInvoice: (data: InvoiceData) => void }> = ({ onGenerateInvoice }) => {
  const [itemCount, setItemCount] = useState(1);
  const [currentEstimate, setCurrentEstimate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const estimate = useQuery(api.estimate.getCurrentEstimate);
  const incrementEstimate = useMutation(api.estimate.incrementEstimateNumber);
  const addEstimate = useMutation(api.estimate.insertEstimate);

  useEffect(() => {
    if (estimate) {
      const estimateNumber = (estimate[0]?.estimate + 1) || 1;
      const year = new Date().getFullYear();
      const formattedNumber = `Est-${year}-${String(estimateNumber).padStart(4, "0")}`;
      setCurrentEstimate(formattedNumber);
    }
  }, [estimate]);

  const form = useForm<InvoiceData>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      clientName: "",
      clientNumber: "",
      clientAddress: { home: "", street: "", city: "" },
      gstPercentage: 0,
      estimateNumber: "",
      date: "",
      items: [{ description: "", quantity: 1, price: 0, per: "Box" }],
    },
  });

  const { handleSubmit, register, getValues, setValue, control } = form;

  const addItem = () => {
    const items = getValues("items");
    setValue("items", [...items, { description: "", quantity: 1, price: 0, per: "Box" }]);
    setItemCount(itemCount + 1);
  };

  const onSubmit = async (data: InvoiceData) => {
    setIsSubmitting(true); // Disable the button on submit
    if (currentEstimate !== null) {
      const newEstimateNumber = await incrementEstimate();
      data.estimateNumber = currentEstimate;
    }
    await addEstimate(data); // Save the estimate
    onGenerateInvoice(data); // Pass data to the parent function
  };

  return (
    <Card className="shadow-md rounded-lg p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" {...register("clientName")} placeholder="Enter client name" />

              <Label htmlFor="clientNumber">Client Number</Label>
              <Input id="clientNumber" {...register("clientNumber")} placeholder="Enter client number" />

              <Label htmlFor="estimateNumber">Estimate Number</Label>
              <Input value={currentEstimate || ""} readOnly {...register("estimateNumber")} placeholder="Generated automatically" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientAddress.home">Home Address</Label>
              <Input id="clientAddress.home" {...register("clientAddress.home")} placeholder="Enter home address" />

              <Label htmlFor="clientAddress.street">Street Address</Label>
              <Input id="clientAddress.street" {...register("clientAddress.street")} placeholder="Enter street address" />

              <Label htmlFor="clientAddress.city">City Location</Label>
              <Input id="clientAddress.city" {...register("clientAddress.city")} placeholder="Enter city" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gstPercentage">GST Percentage</Label>
              <Input id="gstPercentage" type="number" {...register("gstPercentage", { valueAsNumber: true })} placeholder="Enter GST percentage" />
            </div>
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <DateField control={control} name="date" label="Invoice Date" description="Select the invoice date" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Items</h2>
            {Array.from({ length: itemCount }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 mb-2">
                <Input {...register(`items.${index}.description`)} placeholder="Description" />
                <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} placeholder="Quantity" />
                <Input type="number" {...register(`items.${index}.price`, { valueAsNumber: true })} placeholder="Price" />
                <Select {...register(`items.${index}.per`)} onValueChange={(value) => setValue(`items.${index}.per`, value as "Box" | "NOs")}>
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Processing..." : "Generate Invoice"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default InvoiceForm;