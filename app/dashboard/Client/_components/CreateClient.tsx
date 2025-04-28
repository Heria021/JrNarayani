"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

const ClientSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientNumber: z.string().min(10, "Client number must be at least 10 characters"),
  clientAddress: z.object({
    home: z.string().min(3, "Home address must be at least 3 characters"),
    street: z.string().min(3, "Street address must be at least 3 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
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

  const onSubmit = async (data: ClientData) => {
    try {
      setIsSubmitting(true);
      await addClient(data); 
      toast.success("Client created successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to create client. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Create New Client
        </CardTitle>
        <CardDescription>
          Add a new client to your database with their contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientAddress.home"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter home address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientAddress.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientAddress.city"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>City Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Client...
                  </>
                ) : (
                  "Create Client"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateClient;