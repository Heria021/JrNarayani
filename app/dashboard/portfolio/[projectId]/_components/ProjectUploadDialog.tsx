'use client';
import React, { forwardRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropBoxes } from "@/components/shared/DropBoxes";
import TabContent from "./ProjectTabContent";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    const addRecent = useMutation(api.recents.createProjectEntry);

    const bluePrints = useQuery(api.bluePrint.fetchProjectById, { projectId });
    const gallery = useQuery(api.gallery.fetchProjectById, { projectId });

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);

        try {
            const response = await fetch('/api/cloudinary/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to upload file');
            }

            return await response.json();
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setIsUploading(true);
            setUploadProgress({ fileName: file.name, progress: 0 });

            try {
                // Simulate progress for better UX
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (!prev) return null;
                        const newProgress = Math.min(prev.progress + 10, 90);
                        return { ...prev, progress: newProgress };
                    });
                }, 500);

                const result = await uploadToCloudinary(file);
                
                clearInterval(progressInterval);
                setUploadProgress({ fileName: file.name, progress: 100 });

                const uploadResponse = [{
                    name: file.name,
                    url: result.secure_url,
                    type: file.type,
                    size: file.size,
                    timestamp: new Date().toISOString(),
                }];

                const finalData = {
                    projectId: projectId as Id<'projects'>,
                    uploads: uploadResponse,
                };

                if (selectedTab !== 'gallery') {
                    await addBluePrint(finalData);
                    toast.success("Blueprint uploaded successfully");
                } else {
                    await addGallery(finalData);
                    toast.success("Image uploaded successfully");
                }

                await addRecent({
                    projectId: finalData.projectId,
                    uploads: finalData.uploads,
                    update: `${selectedTab === 'gallery' ? 'Gallery images' : 'Blueprint files'} added to project`,
                });

            } catch (error) {
                console.error("Error adding project:", error);
                toast.error("Failed to upload file. Please try again.");
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

            <DialogContent className="max-w-2xl h-[90vh] flex flex-col bg-background">
                <Tabs 
                    defaultValue="gallery" 
                    onValueChange={(value) => setSelectedTab(value)} 
                    className="flex flex-col h-full"
                >
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                        <TabsTrigger 
                            value="gallery"
                            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            Gallery
                        </TabsTrigger>
                        <TabsTrigger 
                            value="prints"
                            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            Blueprints
                        </TabsTrigger>
                    </TabsList>

                    <div className="my-6">
                        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors duration-200">
                            <DropBoxes
                                onDrop={onDrop}
                                isUploading={isUploading}
                                uploadProgress={uploadProgress}
                                acceptOnlyDocuments={selectedTab === "gallery" ? false : true}
                            />
                        </Card>
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