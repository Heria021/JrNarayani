import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { forwardRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import InputField from '@/app/dashboard/Build/_components/InputField';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import DateField from '@/app/dashboard/Build/_components/DateField';
import ToolsField from '@/app/dashboard/Build/_components/ToolsField';
import { useMutation } from 'convex/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

export const FormSchema = z.object({
  projectName: z.string().nonempty({ message: "Project Name is required" }),
  owner: z.string().nonempty({ message: "Owner is required" }),
  contact: z.string().nonempty({ message: "Contact is required" }).regex(/^\d+$/, {
    message: "Contact must be a number",
  }),
  addressStreet: z.string().nonempty({ message: "Street is required" }),
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

type FormData = z.infer<typeof FormSchema>;
type UpdatesFilesProps = {
  projectId: Id<"projects">;
  project: Partial<FormData>;
  editTriggerRef?: React.RefObject<HTMLButtonElement>;
};

const EditProjectDialog = forwardRef<HTMLButtonElement, UpdatesFilesProps>(({ project, projectId, editTriggerRef }, ref) => {
  const updateProject = useMutation(api.upload.updateProject);
  const addRecent = useMutation(api.recents.createProjectEntry);
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName: project.projectName || "",
      owner: project.owner || "",
      contact: project.contact || "",
      addressStreet: project.addressStreet || "",
      addressCity: project.addressCity || "",
      description: project.description || "",
      tools: project.tools || [],
      bedRooms: project.bedRooms ?? 0,
      bathRooms: project.bathRooms ?? 0,
      floor: project.floor ?? 0,
      area: project.area ?? 0,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateProject({
        id: projectId,
        projectName: data.projectName,
        owner: data.owner,
        contact: data.contact,
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        description: data.description,
        tools: data.tools,
        bedRooms: Number(data.bedRooms),
        bathRooms: Number(data.bathRooms),
        floor: Number(data.floor),
        area: Number(data.area),
        startDate: data.startDate,
        endDate: data.endDate || '',
      });
      
      await addRecent({
        projectId: projectId,
        update: "Project Details Updated",
        uploads: []
      });

    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger ref={editTriggerRef} />
      <DialogTitle className="hidden" />
      <DialogContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <InputField
              control={form.control}
              name="projectName"
              label="Project Name"
              placeholder="Project Name"
              type="text"
            />
            <InputField
              control={form.control}
              name="owner"
              label="Owner"
              placeholder="Owner Name"
              type="text"
            />
            <InputField
              control={form.control}
              name="contact"
              label="Contact"
              placeholder="1234567890"
              type="text"
            />
            <InputField
              control={form.control}
              name="addressStreet"
              label="Street"
              placeholder="123 Main St"
              type="text"
            />
            <InputField
              control={form.control}
              name="addressCity"
              label="City"
              placeholder="City"
              type="text"
            />
            <InputField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Project description"
              type="textarea"
            />
            <ToolsField
              control={form.control}
              name="tools"
              toolsOptions={[]}
            />
            <InputField
              control={form.control}
              name="bedRooms"
              label="Bedrooms"
              placeholder="2"
              type="number"
            />
            <InputField
              control={form.control}
              name="bathRooms"
              label="Bathrooms"
              placeholder="2"
              type="number"
            />
            <InputField
              control={form.control}
              name="floor"
              label="Floor"
              placeholder="1"
              type="number"
            />
            <InputField
              control={form.control}
              name="area"
              label="Area (sq ft)"
              placeholder="1200"
              type="number"
            />
            <DateField
              control={form.control}
              name="startDate"
              label="Start Date"
            />
            <DateField
              control={form.control}
              name="endDate"
              label="End Date"
            />
            <DialogFooter>
              <Button type="submit">Save edits</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
});

export default EditProjectDialog;
