import React from 'react';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, ImageIcon, ExternalLink } from "lucide-react";
import Link from 'next/link';

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
    if (!uploads || uploads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                    {title === "Blueprints" ? (
                        <FileText className="w-8 h-8" />
                    ) : (
                        <ImageIcon className="w-8 h-8" />
                    )}
                </div>
                <p className="text-sm">No {title.toLowerCase()} uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 h-full overflow-auto">
            {uploads?.map((item, index) => (
                <Card 
                    key={index} 
                    className={cn(
                        "p-4 rounded-lg transition-all duration-200",
                        "hover:shadow-md hover:border-primary/20",
                        "border border-border/50"
                    )}
                >
                    <div className="flex gap-4 items-start">
                        <div className={cn(
                            "flex-shrink-0 w-24 h-24 rounded-md overflow-hidden",
                            "border border-border/50",
                            "flex items-center justify-center bg-muted/50",
                            "relative group"
                        )}>
                            {item.type !== "application/pdf" ? (
                                <Image
                                    src={item.url}
                                    alt={item.name}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="p-2 w-full h-full flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">PDF Document</p>
                                </div>
                            )}
                            {item.type === "application/pdf" && (
                                <Link 
                                    href={item.url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "absolute inset-0 bg-black/50 flex items-center justify-center",
                                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                        "text-white"
                                    )}
                                >
                                    <ExternalLink className="w-6 h-6" />
                                </Link>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-sm font-medium text-foreground truncate">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {(item.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Uploaded on:{" "}
                                    <span className="text-foreground">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                </p>
                                {item.type === "application/pdf" && (
                                    <Link 
                                        href={item.url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Open PDF
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default TabContent;