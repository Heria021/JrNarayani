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

// "use client"
// import React, { useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const InvoiceGenerator: React.FC = () => {
//   const [formData, setFormData] = useState({
//     clientName: "",
//     clientEmail: "",
//     invoiceNumber: "",
//     date: "",
//     items: [{ description: "", quantity: 1, price: 0 }],
//   });
//   const invoiceRef = useRef<HTMLDivElement | null>(null);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//     index?: number
//   ) => {
//     const { name, value } = e.target;
//     if (index !== undefined) {
//       const items = [...formData.items];
//       items[index] = { ...items[index], [name]: value };
//       setFormData({ ...formData, items });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addItem = () => {
//     setFormData({
//       ...formData,
//       items: [...formData.items, { description: "", quantity: 1, price: 0 }],
//     });
//   };

//   const calculateTotals = () => {
//     const subtotal = formData.items.reduce(
//       (total, item) => total + item.quantity * item.price,
//       0
//     );
//     const tax = subtotal * 0.18; // 18% tax
//     const total = subtotal + tax;
//     return { subtotal: subtotal.toFixed(2), tax: tax.toFixed(2), total: total.toFixed(2) };
//   };

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current) return;

//     const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
//     const imageData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save("invoice.pdf");
//   };

//   const { subtotal, tax, total } = calculateTotals();

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-center">Invoice Generator</h1>

//       {/* Invoice Form */}
//       <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Client Name</label>
//           <input
//             type="text"
//             name="clientName"
//             value={formData.clientName}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Client Email</label>
//           <input
//             type="email"
//             name="clientEmail"
//             value={formData.clientEmail}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2"
//           />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Invoice Number</label>
//             <input
//               type="text"
//               name="invoiceNumber"
//               value={formData.invoiceNumber}
//               onChange={handleInputChange}
//               className="w-full border rounded p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleInputChange}
//               className="w-full border rounded p-2"
//             />
//           </div>
//         </div>

//         {/* Items */}
//         <div className="mt-4">
//           <h2 className="text-lg font-semibold mb-2">Items</h2>
//           {formData.items.map((item, index) => (
//             <div key={index} className="grid grid-cols-3 gap-4 mb-2">
//               <input
//                 type="text"
//                 name="description"
//                 value={item.description}
//                 onChange={(e) => handleInputChange(e, index)}
//                 placeholder="Description"
//                 className="border rounded p-2"
//               />
//               <input
//                 type="number"
//                 name="quantity"
//                 value={item.quantity}
//                 onChange={(e) => handleInputChange(e, index)}
//                 placeholder="Quantity"
//                 className="border rounded p-2"
//               />
//               <input
//                 type="number"
//                 name="price"
//                 value={item.price}
//                 onChange={(e) => handleInputChange(e, index)}
//                 placeholder="Price"
//                 className="border rounded p-2"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addItem}
//             className="text-blue-500 text-sm mt-2"
//           >
//             + Add Item
//           </button>
//         </div>
//       </div>

//       {/* Invoice Preview */}
//       <div ref={invoiceRef} className="bg-white w-[210mm] mx-auto border flex flex-col h-[297mm]" >
//         {/* Header */}
//         <div className="text-center relative">
//           <img
//             src="/images/NT.png"
//             alt="Narayani Traders Logo"
//             className="mx-auto w-18 h-14 "
//           />
//           <h2 className="text-2xl font-bold">Narayani Traders</h2>
//           <p className="text-sm text-gray-700">Granite, Marble, Chemial and Building Materials</p>
//           <div className="relative mt-4">
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-[2px] bg-[#ff6745]"></div>
//             <hr className="mt-2 border-0 h-[2px] bg-black " />
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="flex-1 py-3 px-6">
//           <div className="flex justify-between items-start mb-3">
//             {/* Payable To */}
//             <div className="text-sm">
//               <h3 className="text-base font-semibold mb-2">Payable To</h3>
//               <ul className="space-y-0 text-xs">
//                 <li><strong>Name:</strong> {formData.clientName}</li>
//                 <li><strong>Phone:</strong> +91 7877713244</li>
//                 <li><strong>Address:</strong> 123 Main Street, Your City</li>
//               </ul>
//             </div>

//             {/* Estimate Details */}
//             <div className="text-sm text-right">
//               <h3 className="text-base font-semibold mb-2">Estimate</h3>
//               <ul className="space-y-0 text-xs">
//                 <li><strong>Estimate No.:</strong> {formData.invoiceNumber}</li>
//                 <li><strong>Date:</strong> {formData.date}</li>
//               </ul>
//             </div>
//           </div>
//           <Table>
//             <TableHeader className="border-t-2 border-[#ff6745]">
//               <TableRow>
//                 <TableHead className="w-[200px] font-bold text-black">Serie No.</TableHead>
//                 <TableHead className="w-[200px] font-bold text-black">Description</TableHead>
//                 <TableHead className="w-[100px] font-bold text-black">Quantity</TableHead>
//                 <TableHead className="w-[100px] font-bold text-black">Price</TableHead>
//                 <TableHead className="text-right w-[120px] font-bold text-black">Total</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="border-t-2 border-[#ff6745] text-xs">
//               {formData.items.map((item, index) => (
//                 <TableRow key={index}>
//                   <TableCell className=" p-1 font-medium">{index + 1}</TableCell>
//                   <TableCell className=" p-1 font-medium">{item.description}</TableCell>
//                   <TableCell className=" p-1">{item.quantity}</TableCell>
//                   <TableCell className=" p-1">${item.price}</TableCell>
//                   <TableCell className=" p-1 text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//         <div className="p-6">
//           <Table>
//             <TableFooter className="border-b-2 border-t-2 bg-white border-[#ff6745] text-xs">
//               <TableRow>
//                 <TableCell colSpan={3} className=" p-1 "></TableCell>
//                 <TableCell className=" p-1 font-bold text-right">Subtotal:</TableCell>
//                 <TableCell className=" p-1 text-right w-[100px]">${subtotal}</TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell colSpan={3} className=" p-1 "></TableCell>
//                 <TableCell className=" p-1 font-bold text-right">Tax (18%):</TableCell>
//                 <TableCell className=" p-1 text-right w-[100px]">${tax}</TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell colSpan={3} className=" p-1 "></TableCell>
//                 <TableCell className=" p-1 font-bold text-right">Grand Total:</TableCell>
//                 <TableCell className=" p-1 text-right w-[100px]">${total}</TableCell>
//               </TableRow>
//             </TableFooter>
//           </Table>
//           {/* Footer */}
//           <div>
//             <div className="flex justify-between mt-10 text-sm">
//               {/* Notes */}
//               <div className="max-w-[60%] ">
//                 <h3 className="font-semibold mb-1 text-base">Notes</h3>
//                 <ul className="list-disc pl-3 text-xs text-gray-700 space-y-0">
//                   <li>Please make the payment within 15 days of receiving this invoice.</li>
//                   <li>For any queries, feel free to contact us via phone or email.</li>
//                   <li>We appreciate your trust in Narayani Traders. Looking forward to serving you again.</li>
//                 </ul>
//               </div>

//               {/* Signature */}
//               <div className="text-right">
//                 <h3 className="text-base font-semibold">Authorized Signature</h3>
//                 <div className="border-b border-black w-48 my-2"></div>
//                 <p className="text-xs text-gray-700">Narayani Traders</p>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Footer Line */}
//         <div className="mb-6">
//           <hr className="mt-4 h-4 border-[#ff6745]" />
//           <div className="h-6 bg-[#ff6745]"></div>
//         </div>
//       </div>
//       {/* Download PDF Button */}
//       <button onClick={handleDownloadPDF} className="bg-blue-500 text-white px-6 py-3 rounded-full mt-6">Download PDF</button>
//     </div>
//   );
// };

// export default InvoiceGenerator;