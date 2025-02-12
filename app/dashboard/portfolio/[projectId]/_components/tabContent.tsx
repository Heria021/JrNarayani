import React from 'react';
import Image from 'next/image';
import { Card } from "@/components/ui/card";

type TabContentProps = {
    uploads: {
        url: string;
        name: string;
        size: number;
        type: string;
        timestamp: string;
    }[] | null | undefined;
    title: string;
};

const TabContent = ({ uploads, title }: TabContentProps) => {
    return (
        <div className="space-y-2  h-full overflow-auto">
            {uploads?.map((item, index) => (
                <Card key={index} className="p-3 rounded-md shadow-none hover:shadow transition-shadow duration-200">
                    <div className="w-full flex gap-4">
                        <div className="border border-border rounded-sm flex items-center bg-gray-100">
                            <div className="h-14 w-24">
                                {item.type !== "application/pdf" ?
                                    <Image
                                        src={item.url}
                                        alt="Main"
                                        width={1280}
                                        height={853}
                                        quality={100}
                                        className="object-cover w-full h-full rounded-sm"
                                    />
                                    :
                                    <Image
                                        src={'/images/pdf-svgrepo-com.png'}
                                        alt={'PDF icon'}
                                        width={48}
                                        height={48}
                                        quality={100}
                                        className="object-contain w-full h-full p-1"
                                    />
                                }
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex-grow">
                                <h2 className="text-base font-semibold text-gray-800 max-w-48 truncate">{item.name}</h2>
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
        </div>
    );
};

export default TabContent;