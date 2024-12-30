"use client"
import { useParams } from 'next/navigation';
import EstimateForm, { EstimateData } from './_components/GenerateEstimate';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';
import PreviewEstimate from './_components/PreviewEstimate';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookUserIcon } from 'lucide-react';

const EstimatePage = () => {
  const [estimateData, setEstimateData] = useState<Id<'estimate'> | null>(null);

  const handleGenerateInvoice = (data: Id<'estimate'>) => {
    setEstimateData(data);
  };

  const { clientId } = useParams<{ clientId: Id<'client'> }>();

  return (
    <div>
      <div className="flex justify-between items-center p-2 pr-4 mb-2">
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
        <Link href={'/dashboard/Client'}>
          <Button className="">
            <div className="flex items-center justify-between gap-1">
              <BookUserIcon className="w-8 h-8" strokeWidth={1.3} />
              <p className="font-medium">Search Estimate</p>
            </div>
          </Button>
        </Link>
      </div>

      {!estimateData ? (
        <EstimateForm clientId={clientId} onGenerateInvoice={handleGenerateInvoice} />
      ) : (
        <PreviewEstimate estimateId={estimateData} />
      )}
    </div>
  );
};

export default EstimatePage;
