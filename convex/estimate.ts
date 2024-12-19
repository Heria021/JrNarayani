
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
      tax: v.number()
    })
  },
  handler: async ({ db }, args) => {
    const result = await db.insert("estimate", args);
    if(!result){
      throw new ConvexError("Cann't create estimate!")
    }
    await db.insert("transaction", {
      client: args.clientId,
      estimateId: result,
      remark: "New estimate created",
      type: "credit",
    });

    return result;
  },
});

