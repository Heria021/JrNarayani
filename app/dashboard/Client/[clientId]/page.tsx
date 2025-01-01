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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Main Page Component
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
              <TableHead className="text-right">Due</TableHead>
              <TableHead className="text-center">Actions</TableHead>
              <TableHead className="text-center">Settlement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions
              .slice()
              .reverse()
              .map((transaction, index) => (
                <TransactionRow key={transaction._id} transaction={transaction} index={index} />
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

// Transaction Header Component
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
        <div></div>
      )}
    </div>
  );
};

// Transaction Row Component
const TransactionRow = ({ transaction, index }: { transaction: any; index: number }) => {
  console.log(transaction);
  const [showEstimate, setShowEstimate] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState<string>("");
  const updateFinanceMutation = useMutation(api.estimate.updateEstimateAmount);

  const settlePayment = async (estimateId: Id<"estimate">, amount: number) => {
    if (!estimateId) {
      toast.error("Estimate ID is missing.");
      return;
    }

    try {
      await updateFinanceMutation({ id: estimateId, amount });
      toast.success("Estimate finance has been settled.");
    } catch (error) {
      toast.error("Failed to settle payment. Please try again.");
      console.error(error);
    }
  };

  const handleSettlePayment = () => {
    const credit = transaction?.estimate?.estimateFinance?.credit || 0;
    const amount = parseFloat(settlementAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid settlement amount.");
      return;
    }

    if (amount > credit) {
      toast.error("Settlement amount exceeds available credit.");
      return;
    }

    settlePayment(transaction.estimate._id, amount);
  };

  const isCreditZero = transaction?.estimate?.estimateFinance?.credit === 0;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>
          <div className="font-semibold text-gray-700">
            {transaction?.estimate?.estimateNumber || "Done By You"}
          </div>
          <div className="text-sm text-gray-500">
            {transaction?.remark || "No remarks available."}
          </div>
        </TableCell>
        <TableCell>
          <span
            className={`inline-block px-3 py-1 rounded-lg font-semibold ${isCreditZero ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
          >
            {isCreditZero ? "SETTLED" : "PENDING"}
          </span>
        </TableCell>
        <TableCell>
          {transaction?._creationTime
            ? new Date(transaction._creationTime).toLocaleDateString()
            : "N/A"}
        </TableCell>
        <TableCell className="text-right">
          ₹{transaction?.estimate?.price?.total.toFixed(2) || "0.00"}
        </TableCell>
        <TableCell className="text-right">
          ₹{transaction?.estimate?.estimateFinance?.credit.toFixed(2) || "0.00"}
        </TableCell>
        <TableCell className="text-center">
          <Dialog>
            <DialogTrigger asChild disabled={isCreditZero}>
              <Button size="icon" variant="outline" disabled={isCreditZero}>
                <Wallet className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Settle Payment</DialogTitle>
                <DialogDescription>
                  Enter the amount to add for settlement. Ensure it does not exceed ₹
                  {transaction?.estimate?.estimateFinance?.credit || 0}.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="settlement" className="sr-only">
                    Settlement Amount
                  </Label>
                  <Input
                    id="settlement"
                    placeholder={`₹${transaction?.estimate?.estimateFinance?.credit || 0}`}
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSettlePayment}
                >
                  Settle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TableCell>

        <TableCell className="text-center">
          <Button size="icon" variant="outline" onClick={() => setShowEstimate(!showEstimate)}>
            <ArrowDownCircleIcon className="w-6 h-6" />
          </Button>
        </TableCell>
      </TableRow>

      {showEstimate && transaction?.estimate && (
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