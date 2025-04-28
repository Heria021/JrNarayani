"use client"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useQuery } from 'convex/react';
import { BookUserIcon, ChartNoAxesCombined, MoreVertical, User2, MapPin, Calendar, Receipt } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion';

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

const formatTime = (timeStamp: string) => {
    return format(new Date(timeStamp), "dd MMM, yyyy")
}

const Clients = () => {
    const clients = useQuery(api.client.get);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    // Loading state
    if (!clients) {
        return (
            <div className="flex items-center justify-center h-40 w-full">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground">Loading clients...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {clients?.slice().reverse().map((client) => (
                <motion.div 
                    key={client.client._id} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="p-4 rounded-xl w-full bg-card hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20">
                        <CardHeader className="p-2 flex flex-row justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-border/50 bg-muted/50 hover:border-primary/30 transition-colors duration-300">
                                    <Avatar>
                                        <AvatarImage />
                                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                            {client.client.clientName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-base font-semibold text-foreground leading-none">{client.client.clientName}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{client.client.clientNumber}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-xs text-foreground mb-1">Address</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed break-words truncate">{client.client.clientAddress.home}, {client.client.clientAddress.street}, {client.client.clientAddress.city}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-start justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                                    <div className="flex items-center gap-1.5 w-full">
                                        <Receipt className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                        <p className="font-medium text-xs text-foreground truncate">Estimates</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{client.estimatesCount}</p>
                                </div>
                                <div className="flex flex-col items-start justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                                    <div className="flex items-center gap-1.5 w-full">
                                        <ChartNoAxesCombined className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                        <p className="font-medium text-xs text-foreground truncate">Amount</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">₹{client.amount.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col items-start justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                                    <div className="flex items-center gap-1.5 w-full">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                        <p className="font-medium text-xs text-foreground truncate">Last Estimate</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{client.lastEstimate ? formatTime(client.lastEstimate) : '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className='flex justify-between w-full p-2 gap-3'>
                            <Button className="flex-1 bg-primary hover:bg-primary/90 transition-colors duration-200 h-8">
                                <Link href={`estimate/${client.client._id}`} className="w-full">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <BookUserIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <p className="font-medium text-sm">Create Estimate</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button variant="outline" className="flex-1 hover:bg-muted/50 transition-colors duration-200 h-8">
                                <Link href={`client/${client.client._id}`} className="w-full">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <ChartNoAxesCombined className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <p className="font-medium text-sm">Transactions</p>
                                    </div>
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default Clients