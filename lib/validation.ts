import * as z from "zod";

// Define the work type options
export const workTypeOptions = [
  { id: "Interior", label: "Interior" },
  { id: "Exterior", label: "Exterior" },
  { id: "Blue Print", label: "Blue Print" },
];

// Define the interior work type options
export const interiorWorkTypeOptions = [
  { id: "Living Room", label: "Living Room" },
  { id: "Bedroom", label: "Bedroom" },
  { id: "Kitchen", label: "Kitchen" },
  { id: "Office", label: "Office" },
  { id: "Other", label: "Other" },
];

// Define the exterior work type options
export const exteriorWorkTypeOptions = [
  { id: "Garden", label: "Garden" },
  { id: "Facade", label: "Facade" },
  { id: "Parking Area", label: "Parking Area" },
  { id: "Balcony", label: "Balcony" },
  { id: "Roof", label: "Roof" },
  { id: "Other", label: "Other" },
];

// Define the blueprint type options
export const blueprintTypeOptions = [
  { id: "new", label: "New Blueprint" },
  { id: "modify", label: "Modify Existing Blueprint" },
];

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Step 1: Project Details
export const ProjectDetailsSchema = z.object({
  projectName: z.string().nonempty({ message: "Project Name is required" }),
  ownerName: z.string().nonempty({ message: "Owner Name is required" }),
  ownerEmail: z.string().email({ message: "Invalid email format" }),
  ownerPhone: z.string().nonempty({ message: "Phone number is required" }).regex(/^\d+$/, {
    message: "Phone must be a number",
  }),
  projectAddress: z.string().nonempty({ message: "Project Address is required" }),
  contactName: z.string().optional(),
  contactEmail: z.string().email({ message: "Invalid email format" }).optional().or(z.literal("")),
  contactPhone: z.string().regex(/^\d+$/, {
    message: "Phone must be a number",
  }).optional().or(z.literal("")),
  projectDescription: z.string().nonempty({ message: "Project Description is required" }),
});

// Step 2: Type of Work
export const WorkTypeSchema = z.object({
  workTypes: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Select at least one work type.",
  }),
});

// Step 3A: Interior Work
export const InteriorWorkSchema = z.object({
  interiorWorkTypes: z.array(z.string()).optional(),
  interiorArea: z.number().min(0, { message: "Area must be a non-negative number." }).optional(),
  preferredStyle: z.string().optional(),
  interiorPhotos: z.array(z.any()).optional(),
});

// Step 3B: Exterior Work
export const ExteriorWorkSchema = z.object({
  exteriorWorkTypes: z.array(z.string()).optional(),
  materialPreferences: z.string().optional(),
  exteriorArea: z.number().min(0, { message: "Area must be a non-negative number." }).optional(),
  exteriorPhotos: z.array(z.any()).optional(),
});

// Step 3C: Blueprint Work
export const BlueprintWorkSchema = z.object({
  blueprintType: z.enum(["new", "modify"]).optional(),
  blueprintArea: z.number().min(0, { message: "Area must be a non-negative number." }).optional(),
  blueprintFiles: z.array(z.any()).optional(),
});

// Combined schema for the entire form
export const FormSchema = z.object({
  projectName: z.string().nonempty({ message: "Project Name is required" }),
  owner: z.string().nonempty({ message: "Owner is required" }),
  contact: z.string().nonempty({ message: "Contact is required" }),
  addressStreet: z.string().nonempty({ message: "Street address is required" }),
  addressCity: z.string().nonempty({ message: "City is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  tools: z.array(z.string()).min(1, { message: "Select at least one tool." }),
  bedRooms: z.number().min(0, { message: "Bedrooms must be a non-negative number." }),
  bathRooms: z.number().min(0, { message: "Bathrooms must be a non-negative number." }),
  floor: z.number().min(0, { message: "Floor must be a non-negative number." }),
  area: z.number().min(0, { message: "Area must be a non-negative number." }),
  startDate: z.string().nonempty({ message: "Start Date is required" }),
  endDate: z.string().optional(),
});