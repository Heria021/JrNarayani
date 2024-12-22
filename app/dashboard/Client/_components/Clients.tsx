"use client"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useQuery } from 'convex/react';
import { BookUserIcon, ChartNoAxesCombined, MoreVertical, User2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { format } from 'date-fns'

type Client = {
    _id: string;
    clientName: string;
    clientNumber: string;
    clientAddress: {
        home: string;
        street: string;
        city: string;
    };
    clientFinance: {
        credit: number;
        debit: number;
    };
};
const formateTime = (timeStamp: string) => {
    return format(timeStamp, "dd MMM, yyyy")
}

const Clients = () => {
    const clients = useQuery(api.client.get);

    return (
        <Card className="shadow-md rounded-lg p-4 h-full w-full overflow-auto">
            <CardContent className="p-2 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {clients?.slice().reverse().map((client) => (
                    <Card key={client.client._id} className="p-4 rounded-lg w-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="p-1 flex flex-row justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center border border-border ">
                                    <Avatar>
                                        <AvatarImage />
                                        <AvatarFallback>
                                            <User2 />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 leading-tight">{client.client.clientName}</h3>
                                    <p className="text-sm text-gray-600">{client.client.clientNumber}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-2">
                            <div className="mb-2">
                                <p className="font-bold text-sm text-gray-700">Address</p>
                                <p className="text-sm text-gray-500 truncate pr-8">{client.client.clientAddress.home}, {client.client.clientAddress.street}, {client.client.clientAddress.city}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="flex flex-col items-start justify-center">
                                    <p className="font-semibold text-sm text-gray-700">Estimates</p>
                                    <p className="text-sm text-gray-500 pl-1">{client.estimatesCount}</p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="font-semibold text-sm text-gray-700">Amount</p>
                                    <p className="text-sm text-gray-500 pl-1">{client.amount.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="font-semibold text-sm text-gray-700">Last Estimate</p>
                                    <p className="text-sm text-gray-500 pl-1">{client.lastEstimate ? formateTime(client.lastEstimate) : '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className='flex justify-between w-full p-0'>
                            <Button className="">
                                <Link href={`Estimate/${client.client._id}`} className="w-full">
                                    <div className="flex items-center justify-between gap-1">
                                        <BookUserIcon className="w-8 h-8" strokeWidth={1.3} />
                                        <p className="font-medium">Create Estimate</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button className="">
                                <Link href={`Client/${client.client._id}`}>
                                    <div className="flex items-center justify-between gap-1">
                                        <ChartNoAxesCombined className="w-8 h-8" strokeWidth={1.3} />
                                        <p className="font-medium">Check Transations</p>
                                    </div>
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}

export default Clients