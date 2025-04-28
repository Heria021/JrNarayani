"use client";
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlobeIcon, MailIcon, PhoneCallIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const PreviewEstimate: React.FC<{ estimateId: Id<'estimate'> }> = ({ estimateId }) => {
    const estimateInfo = useQuery(api.estimate.estimateInfo, { id: estimateId });

    const invoiceRef = useRef<HTMLDivElement | null>(null);
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

    const { subtotal, tax, total } = estimateInfo?.estimate.price || { subtotal: 0, tax: 0, total: 0 };

    return (
        <div className="p-8 bg-muted/50 min-h-screen">
            <div ref={invoiceRef} className="bg-background w-[210mm] mx-auto border border-border flex flex-col h-[297mm]">
                {/* Header */}
                <div className="text-center relative">
                    <img
                        src="/images/NT.png"
                        alt="Narayani Traders Logo"
                        className="mx-auto w-18 h-14"
                    />
                    <h2 className="text-2xl font-bold text-foreground">Narayani Traders</h2>
                    <p className="text-sm text-muted-foreground">Granite, Marble, Chemical and Building Materials</p>
                    <div className="relative mt-4">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-[2px] bg-primary"></div>
                        <hr className="mt-2 border-0 h-[2px] bg-foreground" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 py-3 px-6">
                    <div className="flex justify-between items-start mb-3">
                        {/* Client Info */}
                        <div className="text-sm">
                            <h3 className="text-base font-semibold mb-2 text-foreground">Estimate To</h3>
                            <ul className="space-y-0 text-xs">
                                <li className="font-bold text-foreground">{estimateInfo?.client.clientName}</li>
                                <li className="text-muted-foreground">+91 {estimateInfo?.client.clientNumber}</li>
                                <ul className="space-y-0">
                                    <li className="text-muted-foreground">{estimateInfo?.client.clientAddress.home}</li>
                                    <li className="text-muted-foreground">{estimateInfo?.client.clientAddress.street}</li>
                                    <li className="text-muted-foreground">{estimateInfo?.client.clientAddress.city}</li>
                                </ul>
                            </ul>
                        </div>

                        {/* Estimate Details */}
                        <div className="text-sm text-right">
                            <h3 className="text-base font-semibold mb-2 text-foreground">Estimate</h3>
                            <ul className="space-y-0 text-xs">
                                <li className="text-muted-foreground"><strong className="text-foreground">Estimate No.:</strong> {estimateInfo?.estimate.estimateNumber}</li>
                                <li className="text-muted-foreground"><strong className="text-foreground">Date:</strong> {estimateInfo?.estimate.date}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Table for Items */}
                    <Table>
                        <TableHeader className="border-t-2 border-primary">
                            <TableRow>
                                <TableHead className="w-[80px] font-bold text-foreground">Sr No.</TableHead>
                                <TableHead className="w-[200px] font-bold text-foreground">Description of Good</TableHead>
                                <TableHead className="w-[100px] font-bold text-foreground">Quantity</TableHead>
                                <TableHead className="w-[100px] font-bold text-foreground">Rate</TableHead>
                                <TableHead className="w-[100px] font-bold text-foreground">Per</TableHead>
                                <TableHead className="text-right w-[120px] font-bold text-foreground">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border-t-2 border-primary text-xs">
                            {estimateInfo?.estimate.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-1 font-medium text-foreground">{index + 1}</TableCell>
                                    <TableCell className="p-1 font-medium text-foreground">{item.description}</TableCell>
                                    <TableCell className="p-1 text-muted-foreground">{item.quantity}</TableCell>
                                    <TableCell className="p-1 text-muted-foreground">{item.price}</TableCell>
                                    <TableCell className="p-1 text-muted-foreground">{item.per}</TableCell>
                                    <TableCell className="p-1 text-right text-foreground">{(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Totals Section */}
                <div className="p-6">
                    <Table>
                        <TableFooter className="border-b-2 border-t-2 bg-background border-primary text-xs">
                            <TableRow>
                                <TableCell colSpan={3} className="p-1"></TableCell>
                                <TableCell className="p-1 font-bold text-right text-foreground">Subtotal:</TableCell>
                                <TableCell className="p-1 text-right w-[100px] text-foreground">{subtotal}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} className="p-1"></TableCell>
                                <TableCell className="p-1 font-bold text-right text-foreground">Tax ({estimateInfo?.estimate.gstPercentage}%):</TableCell>
                                <TableCell className="p-1 text-right w-[100px] text-foreground">{tax}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} className="p-1"></TableCell>
                                <TableCell className="p-1 font-bold text-right text-foreground">Grand Total:</TableCell>
                                <TableCell className="p-1 text-right w-[100px] text-foreground">{total}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                    {/* Footer */}
                    <div>
                        <div className="flex justify-between mt-10 text-sm">
                            {/* Notes */}
                            <div className="max-w-[60%]">
                                <h3 className="font-semibold mb-1 text-base text-foreground">Notes</h3>
                                <ul className="list-disc pl-3 text-xs text-muted-foreground space-y-0">
                                    <li>Please make the payment within 15 days of receiving this invoice.</li>
                                    <li>For any queries, feel free to contact us via phone or email.</li>
                                    <li>We appreciate your trust in Narayani Traders. Looking forward to serving you again.</li>
                                </ul>
                            </div>

                            {/* Signature */}
                            <div className="text-right">
                                <h3 className="text-base font-semibold text-foreground">Authorized Signature</h3>
                                <div className="border-b border-foreground w-48 my-2"></div>
                                <p className="text-xs text-muted-foreground">Narayani Traders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Line */}
                <div className="mb-1">
                    <div className="px-6">
                        <div className="border-b-2 border-t-2 border-primary">
                            <div className="text-center flex justify-center text-xs py-1">
                                <p className="text-muted-foreground">Narayani Traders, PWD Road, Dariba, Bidasar</p>
                            </div>
                            <div className="border-t-2 border-primary w-full"></div>
                            <div className="grid grid-cols-3 text-center text-xs gap-x-4 py-1">
                                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                    <PhoneCallIcon className="h-4 w-4" /> <p>+91 9782353866</p>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                    <MailIcon className="h-4 w-4" /> <p>Rameshsuthar61@gmail.com</p>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                    <GlobeIcon className="h-4 w-4" /> <p>https://narayani-zej2.onrender.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="mt-4 h-1 border-primary" />
                    <div className="h-6 bg-primary"></div>
                </div>
            </div>

            {/* Button */}
            <div className="mt-4 text-right">
                <button
                    className="bg-primary text-background px-4 py-2 rounded-md shadow-md hover:bg-primary/90"
                    onClick={handleDownloadPDF}
                >
                    Download Invoice
                </button>
            </div>
        </div>
    );
};

export default PreviewEstimate;