'use client';
import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { File, SearchCodeIcon } from 'lucide-react';
import { useQuery } from 'convex/react';
import { Input } from '@/components/ui/input';
import { InvoiceData } from '@/types';
import InvoicePreview from '../Estimate/_components/EstimatePreview';

const Portfolio = () => {
    const [estimate, setEstimate] = useState<InvoiceData[] | null>(null);
    const [clientName, setClientName] = useState<string>('');
    const [debouncedClientName, setDebouncedClientName] = useState<string>('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedClientName(clientName);
        }, 300);

        return () => clearTimeout(handler);
    }, [clientName]);

    const data = useQuery(api.estimate.fetchEstimateByName, { clientName: debouncedClientName });

    useEffect(() => {
        if (data) {
            console.log(data);
            setEstimate(data);
        }
    }, [data]);

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="my-2">
                <div className="relative">
                    <SearchCodeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" strokeWidth={1.4} />
                    <Input
                        placeholder="Type here..."
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="border px-4 py-5 rounded-xl w-full pl-10"
                    />
                </div>
            </div>

            <div className="w-full flex-grow overflow-auto border border-border rounded-xl  flex-row items-center justify-center">
                {estimate && estimate.length > 0 ? (
                    [...estimate].reverse().map((singleEstimate, index) => (
                        <div key={index} className="">
                            <InvoicePreview invoiceData={singleEstimate} />
                            <div className="border border-b-2"></div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm h-full">
                        <File className="text-gray-700 w-8 h-8" />
                        <p className="text-gray-600 text-base font-semibold">No Estimates Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;