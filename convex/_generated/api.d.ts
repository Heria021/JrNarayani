/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as bluePrint from "../bluePrint.js";
import type * as contact from "../contact.js";
import type * as gallery from "../gallery.js";
import type * as portfolio from "../portfolio.js";
import type * as recents from "../recents.js";
import type * as upload from "../upload.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bluePrint: typeof bluePrint;
  contact: typeof contact;
  gallery: typeof gallery;
  portfolio: typeof portfolio;
  recents: typeof recents;
  upload: typeof upload;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
