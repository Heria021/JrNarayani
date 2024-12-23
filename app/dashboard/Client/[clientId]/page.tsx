"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import PreviewEstimate from "../../Estimate/[clientId]/_components/PreviewEstimate";
import { ArrowDownCircleIcon, Wallet } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const { clientId } = useParams<{ clientId: Id<"client"> }>();
  const transactions = useQuery(api.transaction.transactions, { id: clientId });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>

      <TransactionHeader clientId={clientId} />

      {!transactions ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
              <TableHead className="text-center">Settlement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TransactionRow key={transaction._id} transaction={transaction} index={index} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
const TransactionHeader = ({ clientId }: { clientId: Id<"client"> }) => {
  const clients = useQuery(api.client.get);
  const client = clients?.find((c) => c.client._id === clientId);

  return (
    <div className="mb-6">
      {client ? (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{client.client.clientName}</h3>
          <p className="text-sm text-gray-600">
            Client Number: {client.client.clientNumber}
          </p>
          <p className="text-sm text-gray-600">
            Address: {client.client.clientAddress.home}, {client.client.clientAddress.street},{" "}
            {client.client.clientAddress.city}
          </p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estimates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Credit Value</TableHead>
                <TableHead>Debit Value</TableHead>
                <TableHead>Last Estimate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{client.estimatesCount}</TableCell>
                <TableCell>₹{client.amount.toFixed(2)}</TableCell>
                <TableCell>₹{client.creditValue.toFixed(2)}</TableCell>
                <TableCell>₹{client.debitValue.toFixed(2)}</TableCell>
                <TableCell>
                  {client.lastEstimate
                    ? new Date(client.lastEstimate).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className=""></div>
      )}
    </div>
  );
};


const TransactionRow = ({ transaction, index }: { transaction: any; index: number }) => {
  const [showEstimate, setShowEstimate] = useState(false);
  const updateFinanceMutation = useMutation(api.estimate.updateEstimateFinance);

  const settlePayment = async (estimateId: Id<'estimate'>) => {
    if (estimateId) {
      await updateFinanceMutation({ id: estimateId });
      toast.success("Estimate Finance has been settled");
      console.log(`Payment settled for Estimate ID: ${estimateId}`);
    }
  };
  const isCreditZero = transaction.estimate?.estimateFinance.credit === 0;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>
          <div className="font-semibold text-gray-700">
            {transaction.estimate ? transaction.estimate.estimateNumber : "Done By You"}
          </div>
          <div className="text-sm text-gray-500">{transaction.remark}</div>
        </TableCell>
        <TableCell>
          <span
            className={`inline-block px-3 py-1 rounded-lg font-semibold ${
              isCreditZero ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {isCreditZero ? "SETTLED" : "PENDING"}
          </span>
        </TableCell>
        <TableCell>{new Date(transaction._creationTime).toLocaleDateString()}</TableCell>
        <TableCell className="text-right">
          ₹{transaction.estimate ? transaction.estimate.price.total.toFixed(2) : "0.00"}
        </TableCell>
        <TableCell className="text-center">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => settlePayment(transaction.estimate._id)}
            disabled={isCreditZero}
          >
            <Wallet className="w-6 h-6" />
          </Button>
        </TableCell>

        <TableCell className="text-center">
          <Button size={"icon"} variant={"outline"} onClick={() => setShowEstimate(!showEstimate)}>
            <ArrowDownCircleIcon className="w-6 h-6" />
          </Button>
        </TableCell>
      </TableRow>

      {showEstimate && transaction.estimate && (
        <TableRow>
          <TableCell colSpan={7} className="p-4 bg-gray-50">
            <div className="p-4 border rounded-lg flex flex-col space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg mb-2">Estimate Details</h3>
              <div className="w-full flex justify-center">
                <PreviewEstimate estimateId={transaction.estimate._id} />
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default Page;