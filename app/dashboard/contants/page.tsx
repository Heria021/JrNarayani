'use client';
import React, { useRef } from 'react';
import { DetailsRow } from './_components/data-table';
import { Trash2Icon } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

const Page = () => {
    const detailsRowRef = useRef<{ submit: () => void } | null>(null);
    const contacts = useQuery(api.contact.getAllContacts);

    const handleTrashClick = () => {
        if (detailsRowRef.current) {
            detailsRowRef.current.submit();
        }
    };

    if (!contacts) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col h-full p-2">
            <div className="flex items-center justify-end p-2">
                <div
                    className="p-1 hover:bg-primary hover:text-primary-foreground rounded-md cursor-pointer"
                    onClick={handleTrashClick}
                >
                    <Trash2Icon />
                </div>
            </div>
            <div className="flex-grow border border-border rounded-md h-0">
                <DetailsRow ref={detailsRowRef} data={contacts} />
            </div>
        </div>
    );
}

export default Page;