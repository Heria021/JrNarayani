"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookUserIcon, PlusCircle } from 'lucide-react'
import Clients from './_components/Clients'
import CreateClient from './_components/CreateClient'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {}

function Page({ }: Props) {
    const [openCreateClient, setOpenCreateClient] = useState<boolean>(false);

    const handleCreateClient = () => {
        setOpenCreateClient(!openCreateClient);
    };

    return (
        <div className="space-y-4 h-full w-full flex flex-col p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 w-full">
                <div className="flex gap-3 items-center">
                    <img
                        src="/images/NT.png"
                        alt="Narayani Traders Logo"
                        className="w-16 h-12 object-contain"
                    />
                    <div className="flex flex-col justify-center">
                        <h2 className="text-2xl font-bold leading-none text-foreground">Narayani Traders</h2>
                        <p className="text-sm text-muted-foreground">Granite, Marble, Chemical and Building Materials</p>
                    </div>
                </div>
                <Button 
                    onClick={handleCreateClient}
                    className="transition-colors duration-200"
                >
                    <div className="flex items-center justify-between gap-2">
                        <PlusCircle className="w-5 h-5" strokeWidth={1.5} />
                        <p className="font-medium">Create Client</p>
                    </div>
                </Button>
            </div>
            
            <AnimatePresence>
                {openCreateClient && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4"
                    >
                        <CreateClient />
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 w-full overflow-auto"
            >
                <Clients />
            </motion.div>
        </div>
    )
}

export default Page