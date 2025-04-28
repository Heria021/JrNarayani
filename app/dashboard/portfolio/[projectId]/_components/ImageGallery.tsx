import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
    images?: Array<{
        url: string;
        name: string;
        type?: string;
    }>;
    usePdfImage?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, usePdfImage = false }) => {
    if (!images?.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No images available
            </div>
        );
    }

    return (
        <div className={`grid ${usePdfImage ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
            {images.map((image, index) => (
                <Card 
                    key={index} 
                    className={cn(
                        "group overflow-hidden transition-all duration-300",
                        "hover:shadow-xl hover:border-primary/20",
                        "border border-border/50"
                    )}
                >
                    {image?.type === 'application/pdf' && usePdfImage ? (
                        <Link 
                            href={image.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block"
                        >
                            <div className="relative aspect-[4/3] bg-muted/50 flex flex-col items-center justify-center p-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                                    <FileText className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground text-center">PDF Document</p>
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <ExternalLink className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="p-3 bg-card">
                                <p className="text-sm font-medium text-foreground truncate">{image.name}</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={image.url}
                                alt={image.name}
                                fill
                                quality={100}
                                className="object-cover transition-transform duration-300 ease-out transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-sm font-medium text-white truncate">{image.name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default ImageGallery;
