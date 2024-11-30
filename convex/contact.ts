
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createContact = mutation({
    args: {
        address: v.string(),
        city: v.string(),
        contact: v.string(),
        email: v.string(),
        file: v.string(),
        name: v.string(),
        meetTime: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const newContact = await ctx.db.insert("contacts", {
            address: args.address,
            city: args.city,
            contact: args.contact,
            email: args.email,
            file: args.file,
            name: args.name,
            meetTime: args.meetTime,
            message: args.message,
            id: "",
            timestamp: ""
        });

        return newContact;
    },
});


export const getAllContacts = query(async (ctx) => {
    const contacts = await ctx.db.query("contacts").collect();
    return contacts;
});

export const getTopContacts = query(async (ctx) => {
    const contacts = await ctx.db.query("contacts").take(7);
    return contacts;
});

export const deleteContact = mutation({
    args: {
        id: v.id("contacts"),
    },
    handler: async (ctx, args) => {
        const contact = await ctx.db.get(args.id);
        
        if (!contact) {
            throw new ConvexError("Contact not found");
        }
        await ctx.db.delete(args.id);
        
        return { success: true, id: args.id };
    },
});
