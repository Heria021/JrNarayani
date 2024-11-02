'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export const Face = ({ projectId }: { projectId: Id<'projects'> }) => {
    const [imageUrl, setImageUrl] = useState('https://cdn.pixabay.com/photo/2016/06/24/11/47/architecture-1477100_1280.jpg');
    const firstUpload = useQuery(api.gallery.fetchFirstUploadByProjectId, { projectId });

    useEffect(() => {
        if (firstUpload?.url) setImageUrl(firstUpload.url);
    }, [firstUpload]);

    return (
        <Image
            src={imageUrl}
            alt="Project image"
            width={1280}
            height={853}
            quality={100}
            className="object-cover w-full h-full rounded-sm"
        />
    );
};

export default Face;