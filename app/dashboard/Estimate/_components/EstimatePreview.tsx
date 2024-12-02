"use client";
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { InvoiceData } from "@/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlobeIcon, MailIcon, PhoneCallIcon } from "lucide-react";

const InvoicePreview: React.FC<{ invoiceData: InvoiceData }> = ({ invoiceData }) => {
  const invoiceRef = useRef<HTMLDivElement | null>(null);

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    const tax = subtotal * (invoiceData.gstPercentage / 100);
    const total = subtotal + tax;
    return { subtotal: subtotal.toFixed(2), tax: tax.toFixed(2), total: total.toFixed(2) };
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div ref={invoiceRef} className="bg-white w-[210mm] mx-auto border flex flex-col h-[297mm]">
        {/* Header */}
        <div className="text-center relative">
          <img
            src="/images/NT.png"
            alt="Narayani Traders Logo"
            className="mx-auto w-18 h-14"
          />
          <h2 className="text-2xl font-bold">Narayani Traders</h2>
          <p className="text-sm text-gray-700">Granite, Marble, Chemical and Building Materials</p>
          <div className="relative mt-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-[2px] bg-[#ff6745]"></div>
            <hr className="mt-2 border-0 h-[2px] bg-black" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 py-3 px-6">
          <div className="flex justify-between items-start mb-3">
            <div className="text-sm">
              <h3 className="text-base font-semibold mb-2">Estimate To</h3>
              <ul className="space-y-0 text-xs">
                <li className="font-bold">{invoiceData.clientName}</li>
                <li>+91 {invoiceData.clientNumber}</li>
                {/* <li></li> */}
                <ul className="space-y-0">
                  <li>{invoiceData.clientAddress.home}</li>
                  <li>{invoiceData.clientAddress.street}</li>
                  <li>{invoiceData.clientAddress.city}</li>
                </ul>
              </ul>
            </div>

            {/* Estimate Details */}
            <div className="text-sm text-right">
              <h3 className="text-base font-semibold mb-2">Estimate</h3>
              <ul className="space-y-0 text-xs">
                <li><strong>Estimate No.:</strong> {invoiceData.estimateNumber}</li>
                <li><strong>Date:</strong> {invoiceData.date}</li>
              </ul>
            </div>
          </div>

          {/* Table for Items */}
          <Table>
            <TableHeader className="border-t-2 border-[#ff6745]">
              <TableRow>
                <TableHead className="w-[80px] font-bold text-black">Sr No.</TableHead>
                <TableHead className="w-[200px] font-bold text-black">Description of Good</TableHead>
                <TableHead className="w-[100px] font-bold text-black">Quantity</TableHead>
                <TableHead className="w-[100px] font-bold text-black">Rate</TableHead>
                <TableHead className="w-[100px] font-bold text-black">Per</TableHead>
                <TableHead className="text-right w-[120px] font-bold text-black">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-t-2 border-[#ff6745] text-xs">
              {invoiceData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="p-1 font-medium">{index + 1}</TableCell>
                  <TableCell className="p-1 font-medium">{item.description}</TableCell>
                  <TableCell className="p-1">{item.quantity}</TableCell>
                  <TableCell className="p-1">{item.price}</TableCell>
                  <TableCell className="p-1">{item.per}</TableCell>
                  <TableCell className="p-1 text-right">{(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals Section */}
        <div className="p-6">
          <Table>
            <TableFooter className="border-b-2 border-t-2 bg-white border-[#ff6745] text-xs">
              <TableRow>
                <TableCell colSpan={3} className="p-1"></TableCell>
                <TableCell className="p-1 font-bold text-right">Subtotal:</TableCell>
                <TableCell className="p-1 text-right w-[100px]">{subtotal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="p-1"></TableCell>
                <TableCell className="p-1 font-bold text-right">Tax ({invoiceData.gstPercentage}%):</TableCell>
                <TableCell className="p-1 text-right w-[100px]">{tax}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="p-1"></TableCell>
                <TableCell className="p-1 font-bold text-right">Grand Total:</TableCell>
                <TableCell className="p-1 text-right w-[100px]">{total}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Footer */}
          <div>
            <div className="flex justify-between mt-10 text-sm">
              {/* Notes */}
              <div className="max-w-[60%]">
                <h3 className="font-semibold mb-1 text-base">Notes</h3>
                <ul className="list-disc pl-3 text-xs text-gray-700 space-y-0">
                  <li>Please make the payment within 15 days of receiving this invoice.</li>
                  <li>For any queries, feel free to contact us via phone or email.</li>
                  <li>We appreciate your trust in Narayani Traders. Looking forward to serving you again.</li>
                </ul>
              </div>

              {/* Signature */}
              <div className="text-right">
                <h3 className="text-base font-semibold">Authorized Signature</h3>
                <div className="border-b border-black w-48 my-2"></div>
                <p className="text-xs text-gray-700">Narayani Traders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Line */}
        <div className="mb-1">
          <div className="px-6">
            <div className="border-b-2 border-t-2 border-[#ff6745] ">
              <div className="text-center text-xs py-1">
                Narayani Traders, PWD Road, Dariba, Bidasar
              </div>
              <div className="border-t-2 border-[#ff6745] w-full"></div>
              <div className="grid grid-cols-3 text-center text-xs gap-x-4 py-1">
                <div className="flex items-center justify-center gap-1">
                  <PhoneCallIcon className=" h-4 w-4" /> +91 9782353866
                </div>
                <div className="flex items-center justify-center gap-1">
                  <MailIcon className=" h-4 w-4" /> Rameshsuthar61@gmail.com
                </div>
                <div className="flex items-center justify-center gap-1">
                  <GlobeIcon className=" h-4 w-4" /> www.jr-narayani.com
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-4 h-1 border-[#ff6745]" />
          <div className="h-6 bg-[#ff6745]"></div>
        </div>
      </div>
      {/* Button */}
      <div className="mt-4 text-right">
        <button
          className="bg-[#ff6745] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#e65a33]"
          onClick={handleDownloadPDF}
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;

