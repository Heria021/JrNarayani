"use client"
import React, { useMemo } from "react";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";

const FileCardItem = React.memo(({ file, uploadProgress, onDelete }: { file: File, uploadProgress: { [key: string]: number }, onDelete: (name: string) => void }) => {
    const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

    return (
        <div key={file.name} className="relative overflow-hidden group rounded-md">
            {file.type.startsWith("video") ? (
                <video className="object-contain w-full max-h-52" controls>
                    <source src={objectUrl} type={file.type} />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <Image
                    src={objectUrl}
                    alt={file.name}
                    width={1280}
                    height={853}
                    quality={100}
                    className="object-contain w-full max-h-52"
                />
            )}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 to-transparent p-2 opacity-100 group-hover:opacity-100">
                <div className="cursor-pointer p-1 rounded-sm flex justify-end">
                    <Trash2Icon className="p-1 cursor-pointer" onClick={() => onDelete(file.name)} />
                </div>
                <div>
                    <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-xs truncate">{file.name}</p>
                        <p className="text-xs w-1/2 text-right">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <div className="w-full bg-gray-200 my-1 h-[2px] rounded">
                        <div
                            className="bg-green-500 h-[2px] rounded"
                            style={{ width: `${uploadProgress[file.name] ?? 0}%` }}
                        />
                    </div>
                    <p className="text-xs font-medium">{file.type}</p>
                </div>
            </div>
        </div>
    );
});

const FileCard = ({ files, uploadProgress, onDelete }: { 
    files: File[], 
    uploadProgress: { [key: string]: number }, 
    onDelete: (name: string) => void
}) => {
    return (
        <div className="space-y-6">
            <div className="rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-primary overflow-scroll">
                    {files.map((file) => (
                        <FileCardItem
                            key={file.name}
                            file={file}
                            uploadProgress={uploadProgress}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileCard;