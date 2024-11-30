import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProject = mutation({
  args: {
    projectName: v.string(),
    owner: v.string(),
    contact: v.string(),
    addressStreet: v.string(),
    addressCity: v.string(),
    description: v.string(),
    tools: v.array(v.string()),
    bedRooms: v.number(),
    bathRooms: v.number(),
    floor: v.number(),
    area: v.number(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const newProject = await ctx.db.insert("projects", {
      projectName: args.projectName,
      owner: args.owner,
      contact: args.contact,
      addressStreet: args.addressStreet,
      addressCity: args.addressCity,
      description: args.description,
      tools: args.tools,
      bedRooms: args.bedRooms,
      bathRooms: args.bathRooms,
      floor: args.floor,
      area: args.area,
      startDate: args.startDate,
      endDate: args.endDate,
    });

    return newProject;
  },
});


export const updateProject = mutation({
  args: {
    id: v.id("projects"), 
    projectName: v.optional(v.string()),
    owner: v.optional(v.string()),
    contact: v.optional(v.string()),
    addressStreet: v.optional(v.string()),
    addressCity: v.optional(v.string()),
    description: v.optional(v.string()),
    tools: v.optional(v.array(v.string())),
    bedRooms: v.optional(v.number()),
    bathRooms: v.optional(v.number()),
    floor: v.optional(v.number()),
    area: v.optional(v.number()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args; 
    const existingProject = await ctx.db.get(id); 
    
    if (!existingProject) {
      throw new ConvexError("Project not found");
    }

    const updatedFields = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    );

    const updatedProject = await ctx.db.patch(id, updatedFields);
    return updatedProject;
  },
});


export const getAllProjects = query(async (ctx) => {
  const projects = await ctx.db.query("projects").collect();
  return projects;
});

export const fetchProjectEntry = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error(`Project with id ${args.projectId} not found`);
    }

    return project;
  },
});


export const deleteProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new ConvexError("Project not found");
    }
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

export const getProjectByName = query({
  args: {
    projectName: v.string(),
  },
  handler: async (ctx, args) => {
    const prefix = args.projectName;
    const nextChar = String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_projectName", (q) =>
        q.gte("projectName", prefix)
          .lt("projectName", nextChar)
      )
      .collect();

    if (projects.length === 0) {
      return null;
    }

    const topProject = projects[0];

    const portfolioEntry = await ctx.db
      .query("portfolio")
      .withIndex("by_projectId", (q) => q.eq("projectId", topProject._id))
      .first();

    return portfolioEntry ? null : topProject;
  },
});

