"use client"
import React, { useState } from "react";
import InvoiceForm from "./_components/EstimateForm";
import InvoicePreview from "./_components/EstimatePreview";
import { InvoiceData } from "@/types";
const InvoiceGenerator: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  return (
    <div>
      {!invoiceData ? (
        <InvoiceForm onGenerateInvoice={handleGenerateInvoice} />
      ) : (
        <InvoicePreview invoiceData={invoiceData} />
      )}
    </div>
  );
};

export default InvoiceGenerator;
