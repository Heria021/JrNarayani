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
    uploads: v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
      size: v.number(),
      timestamp: v.string(),
    })),
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
      uploads: args.uploads,
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


export const getAllProjects = query(async (ctx) => {
  const projects = await ctx.db.query("projects").collect();
  return projects;
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
      .withIndex("by_projectId", (q) => q.eq("id", topProject._id))
      .first();

    return portfolioEntry ? null : topProject;
  },
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