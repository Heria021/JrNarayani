import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  estimateNumbers: defineTable({
    estimate: v.number(),
  })
    .index("by_number", ["estimate"]),

  client: defineTable({
    clientName: v.string(),
    clientNumber: v.string(),
    clientAddress: v.object({
      home: v.string(),
      street: v.string(),
      city: v.string(),
    }),
    clientFinance: v.object({
      credit: v.number(),
      debit: v.number()
    })
  }),

  estimate: defineTable({
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
      tax: v.number()
    }),
    estimateFinance: v.object({
      credit: v.number(),
      debit: v.number()
    })
  })
    .index("by_estimateNumber", ["estimateNumber"]),

  transaction: defineTable({
    client: v.id('client'),
    estimateId: v.optional(v.id('estimate')),
    remark: v.optional(v.string()),
  })
  .index("by_client", ['client']),

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