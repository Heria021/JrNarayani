"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookUserIcon } from 'lucide-react'
import Clients from './_components/Clients'
import CreateClient from './_components/CreateClient'
import { cn } from '@/lib/utils'

type Props = {}

function Page({ }: Props) {
    const [openCreateClient, setOpenCreateClient] = useState<boolean>(false);

    const handleCreateClient = () => {
        setOpenCreateClient(!openCreateClient);
    };

    return (
        <div className="space-y-2 h-full w-full flex flex-col">
            <div className="flex justify-between items-center p-2 pr-4 mb-2 w-full">
                <div className="flex gap-2">
                    <img
                        src="/images/NT.png"
                        alt="Narayani Traders Logo"
                        className="mx-auto w-18 h-14"
                    />
                    <div className="flex flex-col justify-center">
                        <h2 className="text-2xl font-bold leading-none">Narayani Traders</h2>
                        <p className="text-sm text-gray-700">Granite, Marble, Chemical and Building Materials</p>
                    </div>
                </div>
                <Button onClick={handleCreateClient}>
                    <div className="flex items-center justify-between gap-1">
                        <BookUserIcon className="w-8 h-8" strokeWidth={1.3} />
                        <p className="font-medium">Create Client</p>
                    </div>
                </Button>
            </div>
            <div className={cn({ 'hidden': !openCreateClient })}>
                <CreateClient />
            </div>
            <div className="flex-1 w-full overflow-auto">
                <Clients />
            </div>
        </div>
    )
}

export default Page