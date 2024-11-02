import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// export const createPortfolioEntry = mutation({
//   args: {
//     projectId: v.id("projects"),
//     projectName: v.string(),
//     description: v.string(),
//     uploads: v.array(v.object({
//       name: v.string(),
//       url: v.string(),
//       type: v.string(),
//       size: v.number(),
//       timestamp: v.string(),
//     })),
//   },
//   handler: async (ctx, args) => {
//     const portfolioEntry = await ctx.db.insert("portfolio", {
//       projectName: args.projectName,
//       description: args.description,
//       uploads: args.uploads,
//       id: args.projectId,
//     });

//     return portfolioEntry;
//   },
// });

export const createPortfolioEntry = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error(`Project with ID ${args.projectId} does not exist.`);
    }
    const existingGallery = await ctx.db.query('gallery').withIndex("by_projectId", (q) => q.eq("projectId", args.projectId)).first();
    const uploads = existingGallery ? existingGallery.uploads : [];

    const portfolioEntry = await ctx.db.insert("portfolio", {
      projectName: project.projectName, 
      description: project.description, 
      uploads: uploads,
      projectId: args.projectId,
    });

    return portfolioEntry;
  },
});

export const getAllPortfolioEntries = query(async (ctx) => {
  const portfolioEntries = await ctx.db.query("portfolio").collect();
  return portfolioEntries;
});

export const deletePortfolioEntry = mutation({
  args: {
    portfolioId: v.id("portfolio"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.portfolioId); 

    return { success: true };
  },
});

//*// never used
// export const getProjectByName = query({
//   args: {
//     projectName: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const project = await ctx.db
//       .query("projects")
//       .withIndex("by_projectName", (q) => q.eq("projectName", args.projectName))
//       .first();

//     return project || null;
//   },
// });

