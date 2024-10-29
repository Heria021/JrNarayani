import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  projects: defineTable({
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
    endDate: v.optional(v.string())
  })
    .index("by_owner", ["owner"])
    .index("by_projectName", ["projectName"])
    .index("by_contact", ["contact"])
    .index("by_addressCity", ["addressCity"]),

  gallery: defineTable({
    projectId: v.id("projects"),
    uploads: v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
      size: v.number(),
      timestamp: v.string(),
    })),
  })
    .index("by_projectId", ["projectId"]),

  blueprints: defineTable({
    projectId: v.id("projects"),
    uploads: v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
      size: v.number(),
      timestamp: v.string(),
    })),
  })
    .index("by_projectId", ["projectId"]),

  contacts: defineTable({
    id: v.string(),
    email: v.string(),
    name: v.string(),
    city: v.string(),
    contact: v.string(),
    address: v.string(),
    message: v.string(),
    meetTime: v.string(),
    timestamp: v.string(),
    file: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_contact", ["contact"]),


  portfolio: defineTable({
    projectName: v.string(),
    description: v.string(),
    uploads: v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
      size: v.number(),
      timestamp: v.string(),
    })),
    id: v.id("projects"),
  }).index("by_projectId", ["id"]),

  recents: defineTable({
    projectId: v.id("projects"),
    update: v.string(),
    uploads: v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
      size: v.number(),
      timestamp: v.string(),
    })),
  })
    .index("by_projectId", ["projectId"])

});