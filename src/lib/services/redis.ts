// src/lib/redis.ts
import { Redis } from "@upstash/redis";

import { KV_REST_API_URL, KV_REST_API_TOKEN } from "astro:env/server";

export const redis = new Redis({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});
