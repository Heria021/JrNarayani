"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { clientId } = useParams<{ clientId: Id<"client"> }>();

  // Fetch transactions
  const transactions = useQuery(api.transaction.transactions, { id: clientId });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>

      {/* Transactions Grid */}
      {!transactions ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction._id.toString()} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
};

// Single Transaction Card Component
const TransactionCard = ({ transaction }: { transaction: any }) => {
  const { estimate, type, remark, _creationTime } = transaction;

  return (
    <div className="grid grid-cols-4 items-start p-4 border rounded-lg shadow-sm bg-white space-y-2">
      {/* Column 1: Estimate Number or 'Done By You' */}
      <div>
        <div className="font-semibold">
          {estimate ? estimate.estimateNumber : "Done By You"}
        </div>
        <div className="text-gray-500 text-sm">{remark}</div>
      </div>

      {/* Column 2: Transaction Type */}
      <div className="text-sm font-medium">
        <span
          className={`px-2 py-1 rounded ${
            type === "credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {type.toUpperCase()}
        </span>
      </div>

      {/* Column 3: Transaction Date */}
      <div className="text-gray-600 text-sm">
        {new Date(_creationTime).toLocaleDateString()}
      </div>

      {/* Column 4: Amount Total */}
      <div className="font-semibold text-lg">
        ₹{estimate ? estimate.price.total.toFixed(2) : "0.00"}
      </div>
    </div>
  );
};

export default Page;