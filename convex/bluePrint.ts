import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const addBlueprint = mutation({
    args: {
        projectId: v.id("projects"),
        uploads: v.array(v.object({
            name: v.string(),
            url: v.string(),
            type: v.string(),
            size: v.number(),
            timestamp: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const existingBlueprint = await ctx.db.query('blueprints').withIndex("by_projectId", (q) => q.eq("projectId", args.projectId)).first();

        if (existingBlueprint) {
            const updatedUploads = [...existingBlueprint.uploads, ...args.uploads];
            return await ctx.db.patch(existingBlueprint._id, {
                uploads: updatedUploads,
            });
        } else {
            const newBlueprint = await ctx.db.insert("blueprints", {
                projectId: args.projectId,
                uploads: args.uploads,
            });
            return newBlueprint;
        }
    },
});

export const fetchProjectById = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        const existingBlueprint = await ctx.db.query('blueprints').withIndex("by_projectId", (q) => q.eq("projectId", args.projectId)).first();

        return existingBlueprint;
    },
});

