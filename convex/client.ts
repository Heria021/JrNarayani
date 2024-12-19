import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

// export const get = query(async (ctx) => {
//   const clients = await ctx.db.query('client').collect();
//   return clients;
// });

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
    for (const transaction of transactions) {
      if (transaction.type === "credit") {
        if (transaction.estimateId) {
          const estimate = await ctx.db.get(transaction.estimateId);
          totalCredit += estimate?.price.total || 0;

          if (estimate?.date) {
            const estimateDate = new Date(estimate.date);
            if (!lastEstimateDate || estimateDate > lastEstimateDate) {
              lastEstimateDate = estimateDate;
            }
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



// export const client = query({
//   args: {
//     id: v.id("client"),
//   },
//   handler: async (ctx, args) => {
//     const client = await ctx.db.get(args.id);

//     if (!client) {
//       throw new ConvexError("Client not found");
//     }
//     const transactions = await ctx.db
//       .query("transaction")
//       .withIndex("by_client", (q) => q.eq("client", args.id))
//       .collect();

//     let totalCredit = 0;
//     let estimatesCount = 0;

//     transactions.forEach(transaction => {
//       if (transaction.type === "credit") {
//         totalCredit += transaction.remark ? parseFloat(transaction.remark) : 0;
//       }
//       if (transaction.estimateId) {
//         estimatesCount += 1;
//       }
//     });

//     return {
//       client,
//       amount: totalCredit,
//       estimates: estimatesCount,
//     };
//   },
// });