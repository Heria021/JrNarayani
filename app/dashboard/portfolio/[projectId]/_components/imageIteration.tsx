import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

type ImageGalleryProps = {
    images: { url: string; name: string; type: string }[] | null | undefined;
    usePdfImage?: boolean; 
};

const ImageGallery = ({ images, usePdfImage }: ImageGalleryProps) => (
    <div className={`grid ${usePdfImage ? 'grid-cols-6' : 'grid-cols-3'} gap-2`}>
        {images?.map((image, index) => (
            <div key={index} className="flex flex-col items-center h-80 group">
                {image?.type === 'application/pdf' && usePdfImage ? (
                    <Card className="flex items-center justify-center w-full h-full rounded-sm shadow-none">
                        <Link href={image.url} target="_blank" rel="noopener noreferrer">
                            <Image
                                src={'/images/pdf-svgrepo-com.png'}
                                alt={'PDF icon'}
                                width={280}
                                height={230}
                                quality={100}
                                className="object-contain transition-transform duration-300 ease-out transform group-hover:scale-95 cursor-pointer"
                            />
                            <p className='text-center text-xs font-semibold max-w-44 m-auto truncate'>{image.name}</p>
                        </Link>
                    </Card>
                ) : (
                    <Image
                        src={image.url}
                        alt={image.name}
                        width={1280}
                        height={853}
                        quality={100}
                        className="object-cover w-full h-full rounded-sm transition-transform duration-300 ease-out transform group-hover:scale-95 cursor-pointer"
                    />
                )}
            </div>
        ))}
    </div>
);

export default ImageGallery;