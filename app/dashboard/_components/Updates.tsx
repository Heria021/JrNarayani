'use client';

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { uploadFileToFolder } from "@/firebase/services";
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { DropzoneComponent } from "@/components/shared/DropzoneComponenet";

type UpdatesFilesProps = {
    projectId: Id<"projects">;
};

export const UpdatesFiles = ({ projectId }: UpdatesFilesProps) => {
    const [uploadProgress, setUploadProgress] = useState<{ fileName: string; progress: number } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const addBluePrint = useMutation(api.bluePrint.addBlueprint);
    const addGallery = useMutation(api.gallery.addGallery);
    const [selectedTab, setSelectedTab] = useState("gallery");
    console.log(selectedTab);

    const bluePrints = useQuery(api.bluePrint.fetchProjectById, { projectId });
    const gallery = useQuery(api.gallery.fetchProjectById, { projectId });
    const addRecent = useMutation(api.recents.updateProjectEntry)

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
                    update: 'Files added',
                });
                console.log("Project successfully added:", finalData);

            } catch (error) {
                console.error("Error adding project:", error);
            } finally {
                setIsUploading(false);
                setUploadProgress(null);
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor-pointer" onClick={(event) => event.stopPropagation()}>
                    <DropdownMenuItem disabled>
                        <Upload />
                        <span>Uploads</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-2xl h-[90vh]">

                <Tabs defaultValue="gallery" onValueChange={(value) => setSelectedTab(value)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        <TabsTrigger value="prints">BluePrints</TabsTrigger>
                    </TabsList>

                    <div className=" my-4 ">
                        <DropzoneComponent
                            onDrop={onDrop}
                            isUploading={isUploading}
                            uploadProgress={uploadProgress}
                        />
                    </div>

                    <TabsContent value="prints" className=" space-y-2 overflow-scroll">
                        {bluePrints?.uploads?.map((item, index) => (
                            <Card key={index} className="p-3 rounded-md shadow-none hover:shadow transition-shadow duration-200">
                                <div className="w-full flex gap-4">
                                    <div className="border border-border rounded-sm flex items-center bg-gray-100">

                                        <div className="h-14 w-24">
                                            <Image
                                                src={item.url}
                                                alt="Main"
                                                width={1280}
                                                height={853}
                                                quality={100}
                                                className="object-cover w-full h-full rounded-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <div className="flex-grow ">
                                            <h2 className="text-base font-semibold text-gray-800">{item.name}</h2>
                                            <p className="text-sm font-light text-gray-600">
                                                {(item.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <div className="flex items-end text-sm font-medium text-gray-700">
                                            <p className="pr-4">
                                                Uploaded on:
                                                <span className="text-gray-900 font-semibold ml-1">
                                                    {new Date(parseInt(item.timestamp)).toLocaleDateString()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="gallery">
                        {gallery?.uploads?.map((item, index) => (
                            <Card key={index} className="p-3 rounded-md shadow-none hover:shadow transition-shadow duration-200">
                                <div className="w-full flex gap-4">
                                    <div className="border border-border rounded-sm flex items-center bg-gray-100">
                                        <div className="h-14 w-24">
                                            <Image
                                                src={item.url}
                                                alt="Main"
                                                width={1280}
                                                height={853}
                                                quality={100}
                                                className="object-cover w-full h-full rounded-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <div className="flex-grow ">
                                            <h2 className="text-base font-semibold text-gray-800">{item.name}</h2>
                                            <p className="text-sm font-light text-gray-600">
                                                {(item.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <div className="flex items-end text-sm font-medium text-gray-700">
                                            <p className="pr-4">
                                                Uploaded on:
                                                <span className="text-gray-900 font-semibold ml-1">
                                                    {new Date(parseInt(item.timestamp)).toLocaleDateString()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};