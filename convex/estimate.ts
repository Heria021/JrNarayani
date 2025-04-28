import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

interface Estimate {
  _id: Id<"estimate">;
  _creationTime: number;
  clientId: Id<"client">;
  gstPercentage: number;
  estimateNumber: string;
  date: string;
  items: {
    description: string;
    quantity: number;
    price: number;
    per: "Box" | "NOs";
  }[];
  price: {
    total: number;
    subtotal: number;
    tax: number;
  };
  estimateFinance: {
    credit: number;
    debit: number;
  };
}

interface Client {
  _id: Id<"client">;
  clientName: string;
  clientNumber: string;
  clientAddress: {
    home: string;
    street: string;
    city: string;
  };
  clientFinance: {
    credit: number;
    debit: number;
  };
}

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

export const updateEstimateAmount = mutation({
  args: {
    id: v.id("estimate"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, amount } = args;

    const estimate = await ctx.db.get(id);
    if (!estimate) {
      throw new ConvexError("Estimate not found!");
    }

    const estimateFinance = estimate.estimateFinance;

    if (!estimateFinance) {
      throw new ConvexError("Estimate Finance not found!");
    }

    if (amount > estimateFinance.credit) {
      throw new ConvexError("Amount exceeds available credit!");
    }

    const updatedEstimateFinance = {
      credit: estimateFinance.credit - amount,
      debit: estimateFinance.debit + amount,
    };

    await ctx.db.patch(id, {
      estimateFinance: updatedEstimateFinance,
    });

    return {
      message: "Estimate finance updated successfully!",
      updatedEstimateFinance,
    };
  },
});

export const getRecentEstimates = query({
  handler: async (ctx) => {
    const estimates = (await ctx.db
      .query("estimate")
      .order("desc")
      .take(5)) as Estimate[];
    
    // Fetch client information for each estimate
    const estimatesWithClients = await Promise.all(
      estimates.map(async (estimate: Estimate) => {
        const client = await ctx.db.get(estimate.clientId) as Client | null;
        return {
          ...estimate,
          clientName: client?.clientName || "Unknown Client"
        };
      })
    );
    
    return estimatesWithClients;
  },
});