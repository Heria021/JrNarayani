import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query(async (ctx) => {
  const clients = await ctx.db.query('client').collect();

  const clientSummary = await Promise.all(clients.map(async (client) => {
    const transactions = await ctx.db
      .query("transaction")
      .withIndex("by_client", (q) => q.eq("client", client._id))
      .collect();

    let totalCredit = 0;
    let estimates = new Set();
    let lastEstimateDate = null;
    let debitValue = 0;
    let creditValue = 0;
    for (const transaction of transactions) {
      if (transaction.estimateId) {
        
        const estimate = await ctx.db.get(transaction.estimateId);
        if(estimate?.estimateFinance.credit){
          creditValue += estimate.estimateFinance.credit;
        }
        if(estimate?.estimateFinance.debit){
          debitValue += estimate.estimateFinance.debit;
        }
        totalCredit += estimate?.price.total || 0;

        if (estimate?.date) {
          const estimateDate = new Date(estimate.date);
          if (!lastEstimateDate || estimateDate > lastEstimateDate) {
            lastEstimateDate = estimateDate;
          }
        }
      }
      if (transaction.estimateId) {
        estimates.add(transaction.estimateId);
      }
    }
    const lastEstimateDateString = lastEstimateDate ? lastEstimateDate.toISOString() : null;
    return {
      client: client,
      amount: totalCredit,
      estimatesCount: estimates.size,
      lastEstimate: lastEstimateDateString,
      creditValue: creditValue,
      debitValue: debitValue,
    };
  }));

  return clientSummary;
});


export const client = query({
  args: {
    id: v.id("client"),
  },
  handler: async (ctx, args) => {
    const client = await ctx.db.get(args.id);
    return client;
  },
});

export const createClient = mutation({
  args: {
    clientName: v.string(),
    clientNumber: v.string(),
    clientAddress: v.object({
      home: v.string(),
      street: v.string(),
      city: v.string(),
    })
  },
  handler: async (ctx, args) => {
    const { clientName, clientNumber, clientAddress } = args;

    const newClient = await ctx.db.insert("client", {
      clientName,
      clientNumber,
      clientAddress,
      clientFinance: {
        debit: 0,
        credit: 0
      },
    });

    return newClient;
  }
});
