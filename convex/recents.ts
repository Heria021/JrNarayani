import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createProjectEntry = mutation({
    args: {
        projectId: v.id("projects"),
        update: v.string(),
        uploads: v.any(),
    },
    handler: async (ctx, args) => {
        const existingEntry = await ctx.db.query('recents').order("desc").first();

        if (existingEntry && existingEntry.projectId === args.projectId) {
            const existingUploads = existingEntry ? existingEntry.uploads || [] : [];
            const updatedData = {
                update: args.update,
                uploads: [...existingUploads, ...args.uploads],
            };

            return await ctx.db.patch(existingEntry._id, updatedData);
        }
        return await ctx.db.insert("recents", {
            projectId: args.projectId,
            update: args.update,
            uploads: args.uploads,
        });
    }
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
        return await ctx.db.query('recents').order("desc").collect();
    },
});