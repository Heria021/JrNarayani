import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const addGallery = mutation({
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
        const existingGallery = await ctx.db.query('gallery').withIndex("by_projectId", (q) => q.eq("projectId", args.projectId)).first();

        if (existingGallery) {
            const updatedUploads = [...existingGallery.uploads, ...args.uploads];
            return await ctx.db.patch(existingGallery._id, {
                uploads: updatedUploads,
            });
        } else {
            const newBlueprint = await ctx.db.insert("gallery", {
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
        const existingGallery = await ctx.db.query('gallery').withIndex("by_projectId", (q) => q.eq("projectId", args.projectId)).first();

        return existingGallery;
    },
});

