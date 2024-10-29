import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createProjectEntry = mutation({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("recents", {
            projectId: args.projectId,
            update: "Project Created",
            uploads: [],
        });
    },
});

export const updateProjectEntry = mutation({
    args: {
        projectId: v.id("projects"),
        uploads: v.array(v.object({
            name: v.string(),
            url: v.string(),
            type: v.string(),
            size: v.number(),
            timestamp: v.string(),
        })),
        update: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("recents", {
            projectId: args.projectId,
            update: args.update,
            uploads: args.uploads,
        });
    },
});

export const fetchProjectById = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        const existingEntry = await ctx.db.query('recents').withIndex("by_projectId", (q) => q.eq("projectId", args.projectId)).first();
        return existingEntry;
    },
});

export const fetchRecentEntries = query({
    handler: async (ctx) => {
        return await ctx.db.query('recents').collect();
    },
});