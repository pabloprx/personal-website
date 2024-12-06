// src/actions/analytics.ts
import { defineAction } from "astro:actions";
import { redis } from "../lib/services/redis";
import { createHash } from "crypto";

export const analyticsActions = {
  incrementView: defineAction({
    async handler({ email }, context) {
      try {
        // Get IP from Vercel headers
        const ip =
          context.request.headers.get("x-forwarded-for") ||
          context.request.headers.get("x-real-ip");

        const userAgent = context.request.headers.get("user-agent") || "";

        console.log("IP:", ip);
        console.log("User Agent:", userAgent);
        // Create a unique visitor hash (IP + UserAgent + Date)
        const visitorHash = createHash("sha256")
          .update(`${ip}-${userAgent}-${new Date().toDateString()}`)
          .digest("hex");

        const pageKey = `views:${email}`;
        const visitorKey = `visitors:${email}:${visitorHash}`;

        // Check if this visitor has already been counted today
        const hasVisited = await redis.get(visitorKey);

        if (!hasVisited) {
          // Increment total views
          await redis.incr(pageKey);
          // Mark this visitor as counted for 24 hours
          await redis.set(visitorKey, "1", { ex: 86400 }); // Expires in 24 hours
        }

        // Get current view count
        const views = await redis.get(pageKey);
        return { views };
      } catch (error) {
        console.error("Redis increment error:", error);
        return { views: 0 };
      }
    },
  }),

  getViews: defineAction({
    async handler({ email }) {
      try {
        const key = `views:${email}`;
        const views = await redis.get(key);
        return { views: views || 0 };
      } catch (error) {
        console.error("Redis get error:", error);
        return { views: 0 };
      }
    },
  }),
};
