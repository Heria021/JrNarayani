'use client';
import React, { forwardRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { uploadFileToFolder } from "@/firebase/services";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabContent from "./tabContent";
import { DropzoneComponent } from "@/components/shared/DropBoxes";

type UpdatesFilesProps = {
    projectId: Id<"projects">;
    dialogTriggerRef?: React.RefObject<HTMLButtonElement>;
};

export const UpdatesFiles = forwardRef<HTMLButtonElement, UpdatesFilesProps>(({ projectId, dialogTriggerRef }, ref) => {

    const [uploadProgress, setUploadProgress] = useState<{ fileName: string; progress: number } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedTab, setSelectedTab] = useState("gallery");

    const addBluePrint = useMutation(api.bluePrint.addBlueprint);
    const addGallery = useMutation(api.gallery.addGallery);
    const addRecent = useMutation(api.recents.createProjectEntry)

    const bluePrints = useQuery(api.bluePrint.fetchProjectById, { projectId });
    const gallery = useQuery(api.gallery.fetchProjectById, { projectId });

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setIsUploading(true);
            setUploadProgress({ fileName: file.name, progress: 0 });

            try {
                const response = await uploadFileToFolder(file, projectId, (progress) => {
                    setUploadProgress({ fileName: file.name, progress });
                });

                const uploadResponse = [{
                    name: response.name,
                    url: response.url,
                    type: response.type,
                    size: response.size,
                    timestamp: response.timestamp.toString(),
                }];

                const finalData = {
                    projectId: projectId as Id<'projects'>,
                    uploads: uploadResponse,
                };

                if (selectedTab != 'gallery') {
                    await addBluePrint(finalData);
                } else {
                    await addGallery(finalData);
                }

                await addRecent({
                    projectId: finalData.projectId,
                    uploads: finalData.uploads,
                    update: 'Files Added Project',
                });

            } catch (error) {
                console.error("Error adding project:", error);
            } finally {
                setIsUploading(false);
                setUploadProgress(null);
            }
        }
    };

    return (
        <Dialog>
    <DialogTrigger ref={dialogTriggerRef} />
    <DialogTitle className="hidden" />

    <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <Tabs 
            defaultValue="gallery" 
            onValueChange={(value) => setSelectedTab(value)} 
            className="flex flex-col h-full"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="prints">Blueprints</TabsTrigger>
            </TabsList>

            <div className="my-4">
                <DropzoneComponent
                    onDrop={onDrop}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    acceptOnlyDocuments={selectedTab === "gallery" ? false : true}
                />
            </div>

            <TabsContent value="prints" className="h-full overflow-auto">
                <TabContent uploads={bluePrints?.uploads} title="Blueprints" />
            </TabsContent>

            <TabsContent value="gallery" className="h-full overflow-auto">
                <TabContent uploads={gallery?.uploads} title="Gallery" />
            </TabsContent>
        </Tabs>
    </DialogContent>
</Dialog>
    );
});