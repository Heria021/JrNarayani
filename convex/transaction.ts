import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const insertTransaction = mutation({
  args: {
    client: v.id('client'),
    estimateId: v.optional(v.id('estimate')),
    remark: v.optional(v.string()),
    type: v.union(v.literal("debit"), v.literal("credit")),
  },
  handler: async ({ db }, args) => {
    const result = await db.insert("transaction", args);
    return result;
  },
});


export const transactions = query({
  args: {
    id: v.id("client"),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transaction")
      .withIndex("by_client", (q) => q.eq("client", args.id)).collect();

    if (!transactions || transactions.length === 0) {
      throw new ConvexError("No transactions found for the given client.");
    }

    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        if (transaction.estimateId) {
          const estimate = await ctx.db.get(transaction.estimateId);
          return { ...transaction, estimate };
        }
        return transaction;
      })
    );

    console.log(enrichedTransactions);
    return enrichedTransactions;
  },
});