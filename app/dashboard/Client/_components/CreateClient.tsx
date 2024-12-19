"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const ClientSchema = z.object({
  clientName: z.string().nonempty("Client name is required"),
  clientNumber: z.string().nonempty("Client number is required"),
  clientAddress: z.object({
    home: z.string().nonempty("Home address is required"),
    street: z.string().nonempty("Street address is required"),
    city: z.string().nonempty("City is required"),
  })
});

export type ClientData = z.infer<typeof ClientSchema>;

const CreateClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addClient = useMutation(api.client.createClient);

  const form = useForm<ClientData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      clientName: "",
      clientNumber: "",
      clientAddress: { home: "", street: "", city: "" },
    },
  });

  const { handleSubmit, register } = form;

  const onSubmit = async (data: ClientData) => {
    setIsSubmitting(true);
    await addClient(data); 
    toast.success("Client has been created successfully!");
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-none rounded-lg p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" {...register("clientName")} placeholder="Enter client name" />

              <Label htmlFor="clientNumber">Client Number</Label>
              <Input id="clientNumber" {...register("clientNumber")} placeholder="Enter client number" />
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Processing..." : "Client Created"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default CreateClient;