import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  estimateNumbers: defineTable({
    estimate: v.number(),
  })
    .index("by_number", ["estimate"]),

  estimate: defineTable({
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
  })
    .index("by_name", ["clientName"])
    .index("by_estimateNumber", ["estimateNumber"])
    .index("by_number", ["clientNumber"]),

  projects: defineTable({
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
    projectId: v.id("projects"),
    projectName: v.string(),
    description: v.string(),
    uploads: v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
      size: v.number(),
      timestamp: v.string(),
    })),
  }).index("by_projectId", ["projectId"]),

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