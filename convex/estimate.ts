
import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

export const getCurrentEstimate = query(async (ctx) => {
  const currentEstimate = await ctx.db.query("estimateNumbers").collect();
  return currentEstimate;
});

export const incrementEstimateNumber = mutation(async (ctx) => {
  const currentEstimate = await ctx.db.query("estimateNumbers").first();
  const newEstimateNumber = currentEstimate?.estimate ? currentEstimate.estimate + 1 : 1;
  if (currentEstimate) {
    await ctx.db
      .patch(currentEstimate._id, { estimate: newEstimateNumber });
  } else {
    await ctx.db.insert("estimateNumbers", { estimate: newEstimateNumber });
  }
  return newEstimateNumber;
});


export const estimateInfo = query({
  args: {
    id: v.id("estimate"),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.id);
    if (!estimate) {
      throw new ConvexError("Estimate not found!");
    }
    const client = await ctx.db.get(estimate.clientId);
    if (!client) {
      throw new ConvexError("Estimate client not found!");
    }
    return { estimate, client };
  },
});


export const insertEstimate = mutation({
  args: {
    clientId: v.id('client'),
    gstPercentage: v.number(),
    estimateNumber: v.string(),
    date: v.string(),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        price: v.number(),
        per: v.union(v.literal("Box"), v.literal("NOs")),
      })
    ),
    price: v.object({
      total: v.number(),
      subtotal: v.number(),
      tax: v.number(),
    }),
    estimateFinance: v.object({
      credit: v.number(),
      debit: v.number(),
    }),
  },
  handler: async ({ db }, args) => {
    const estimateFinance = {
      credit: args.estimateFinance?.credit ?? 0,
      debit: args.estimateFinance?.debit ?? 0,
    };

    const result = await db.insert("estimate", { ...args, estimateFinance });
    if (!result) {
      throw new ConvexError("Can't create estimate!");
    }

    await db.insert("transaction", {
      client: args.clientId,
      estimateId: result,
      remark: "New estimate created",
    });

    return result;
  },
});

export const updateEstimateFinance = mutation({
  args: {
    id: v.id("estimate"),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.id);
    if (!estimate) {
      throw new ConvexError("Estimate not found!");
    }

    const estimateFinance = estimate.estimateFinance;

    if(!estimateFinance){
      throw new ConvexError("Estimate Finance not found!")
    }

    const updatedEstimateFinance = {
      credit: 0,
      debit: estimateFinance.credit,
    };

    await ctx.db.patch(args.id, {
      estimateFinance: updatedEstimateFinance
    });

    return { message: "Estimate finance updated successfully!" };
  },
});