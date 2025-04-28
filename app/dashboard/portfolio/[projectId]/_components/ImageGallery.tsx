import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

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
        <div className={`grid ${usePdfImage ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
            {images.map((image, index) => (
                <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    {image?.type === 'application/pdf' && usePdfImage ? (
                        <Link href={image.url} target="_blank" rel="noopener noreferrer" className="block">
                            <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                                <Image
                                    src="/images/pdf-svgrepo-com.png"
                                    alt="PDF icon"
                                    width={280}
                                    height={230}
                                    quality={100}
                                    className="object-contain transition-transform duration-300 ease-out transform group-hover:scale-95"
                                />
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
