
import { v } from "convex/values";
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

export const insertEstimate = mutation({
  args: {
    clientName: v.string(),
    clientNumber: v.string(),
    clientAddress: v.object({
      home: v.string(),
      street: v.string(),
      city: v.string(),
    }),
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
  },
  handler: async ({ db }, args) => {
    const result = await db.insert("estimate", args);
    return result;
  },
});


export const searchEstimates = query({
  args: { searchTerm: v.string() }, 
  handler: async (ctx, { searchTerm }) => {
    const prefix = searchTerm;
    const nextChar = String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);

    const clientNameEstimates = await ctx.db
      .query("estimate")
      .withIndex("by_name", (q) =>
        q.gte("clientName", prefix).lt("clientName", nextChar)
      )
      .collect();

    const clientNumberEstimates = await ctx.db
      .query("estimate")
      .withIndex("by_number", (q) =>
        q.gte("clientNumber", prefix).lt("clientNumber", nextChar)
      )
      .collect();

    const estimateNumberEstimates = await ctx.db
      .query("estimate")
      .withIndex("by_estimateNumber", (q) =>
        q.gte("estimateNumber", prefix).lt("estimateNumber", nextChar)
      )
      .collect();

    const allEstimates = [
      ...clientNameEstimates,
      ...clientNumberEstimates,
      ...estimateNumberEstimates,
    ];

    const uniqueEstimates = Array.from(
      new Set(allEstimates.map((e) => e._id)) 
    ).map((id) => allEstimates.find((e) => e._id === id));

    if (uniqueEstimates.length === 0) {
      return null; 
    }

    return uniqueEstimates; 
  },
});