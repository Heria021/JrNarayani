import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const FormSchema = z.object({
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
  bedRooms: z.number().min(0, { message: "Bedrooms must be a non-negative number." }),
  bathRooms: z.number().min(0, { message: "Bathrooms must be a non-negative number." }),
  floor: z.number().min(0, { message: "Floor must be a non-negative number." }),
  area: z.number().min(0, { message: "Area must be a non-negative number." }),
  startDate: z.string().nonempty({ message: "Start Date is required" }),
  endDate: z.string().optional(),
});