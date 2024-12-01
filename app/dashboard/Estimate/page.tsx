"use client"
import React, { useState } from "react";
import InvoiceForm from "./_components/EstimateForm";
import InvoicePreview from "./_components/EstimatePreview";
import { InvoiceData } from "@/types";
import { BookUserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const InvoiceGenerator: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

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
        <Link href={'/dashboard/EstimateHistory'}>
          <Button className="">
            <div className="flex items-center justify-between gap-1">
              <BookUserIcon className="w-8 h-8" strokeWidth={1.3} />
              <p className="font-medium">Search Estimate</p>
            </div>
          </Button>
        </Link>
      </div>

      {!invoiceData ? (
        <InvoiceForm onGenerateInvoice={handleGenerateInvoice} />
      ) : (
        <InvoicePreview invoiceData={invoiceData} />
      )}
    </div>
  );
};

export default InvoiceGenerator;
