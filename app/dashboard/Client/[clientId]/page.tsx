"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
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
import PreviewEstimate from "./_components/PreviewEstimate";

// Main Page Component
const Page = () => {
  const { clientId } = useParams<{ clientId: Id<"client"> }>();
  const transactions = useQuery(api.transaction.transactions, { id: clientId });

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Transactions Overview</h1>
      </div>

      <TransactionHeader clientId={clientId} />

      <div className="bg-card rounded-lg shadow-sm border">
        {!transactions ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No transactions found.</p>
          </div>
        ) : (
          <Table>
            <TableCaption className="text-muted-foreground">A list of your recent transactions.</TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px] font-semibold">Sr. No.</TableHead>
                <TableHead className="font-semibold">Transaction</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Amount</TableHead>
                <TableHead className="text-right font-semibold">Due</TableHead>
                <TableHead className="text-center font-semibold">Actions</TableHead>
                <TableHead className="text-center font-semibold">Settlement</TableHead>
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
    </div>
  );
};

// Transaction Header Component
const TransactionHeader = ({ clientId }: { clientId: Id<"client"> }) => {
  const clients = useQuery(api.client.get);
  const client = clients?.find((c) => c.client._id === clientId);

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      {client ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{client.client.clientName}</h3>
            <div className="space-y-1 text-muted-foreground">
              <p className="text-sm">Client Number: {client.client.clientNumber}</p>
              <p className="text-sm">
                Address: {client.client.clientAddress.home}, {client.client.clientAddress.street},{" "}
                {client.client.clientAddress.city}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Estimates</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Credit Value</TableHead>
                  <TableHead className="font-semibold">Debit Value</TableHead>
                  <TableHead className="font-semibold">Last Estimate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{client.estimatesCount}</TableCell>
                  <TableCell className="font-medium">₹{client.amount.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">₹{client.creditValue.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">₹{client.debitValue.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    {client.lastEstimate
                      ? new Date(client.lastEstimate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Loading client information...</div>
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
      <TableRow className="hover:bg-muted/50 transition-colors">
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="font-semibold text-foreground">
              {transaction?.estimate?.estimateNumber || "Done By You"}
            </div>
            <div className="text-sm text-muted-foreground">
              {transaction?.remark || "No remarks available."}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isCreditZero 
                ? "bg-green-500/10 text-green-500 dark:bg-green-500/20" 
                : "bg-red-500/10 text-red-500 dark:bg-red-500/20"
            }`}
          >
            {isCreditZero ? "SETTLED" : "PENDING"}
          </span>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {transaction?._creationTime
            ? new Date(transaction._creationTime).toLocaleDateString()
            : "N/A"}
        </TableCell>
        <TableCell className="text-right font-medium">
          ₹{transaction?.estimate?.price?.total.toFixed(2) || "0.00"}
        </TableCell>
        <TableCell className="text-right font-medium">
          ₹{transaction?.estimate?.estimateFinance?.credit.toFixed(2) || "0.00"}
        </TableCell>
        <TableCell className="text-center">
          <Dialog>
            <DialogTrigger asChild disabled={isCreditZero}>
              <Button 
                size="icon" 
                variant="outline" 
                disabled={isCreditZero}
                className="hover:bg-muted"
              >
                <Wallet className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Settle Payment</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Enter the amount to add for settlement. Ensure it does not exceed ₹
                  {transaction?.estimate?.estimateFinance?.credit || 0}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="settlement" className="text-foreground">
                    Settlement Amount
                  </Label>
                  <Input
                    id="settlement"
                    placeholder={`₹${transaction?.estimate?.estimateFinance?.credit || 0}`}
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleSettlePayment}
                >
                  Settle Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TableCell>

        <TableCell className="text-center">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => setShowEstimate(!showEstimate)}
            className="hover:bg-muted"
          >
            <ArrowDownCircleIcon className="w-5 h-5" />
          </Button>
        </TableCell>
      </TableRow>

      {showEstimate && transaction?.estimate && (
        <TableRow>
          <TableCell colSpan={8} className="p-4 bg-muted/50">
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <h3 className="font-semibold text-foreground text-lg mb-4">Estimate Details</h3>
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