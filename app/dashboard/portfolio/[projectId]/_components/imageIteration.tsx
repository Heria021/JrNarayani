import React from 'react';
import Image from 'next/image';

type ImageGalleryProps = {
    images: { url: string; name: string }[] | null | undefined;
};

const ImageGallery = ({ images}: ImageGalleryProps) => (
    <div className="grid grid-cols-3 gap-2">
        {images?.map((image, index) => (
            <div key={index} className="flex flex-col items-center h-80 group">
                <Image
                    src={image.url}
                    alt={image.name}
                    width={1280}
                    height={853}
                    quality={100}
                    className="object-cover w-full h-full rounded-sm transition-transform duration-300 ease-out transform group-hover:scale-95 cursor-pointer"
                />
            </div>
        ))}
    </div>
);

export default ImageGallery;