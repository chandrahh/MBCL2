import { Redis } from "@upstash/redis";

let client: Redis | null = null;

// Vercel's Upstash/KV marketplace integration may name the env vars either
// KV_REST_API_* or UPSTASH_REDIS_REST_*, tergantung cara integrasi dibuat.
// Kita coba keduanya supaya setup di Vercel dashboard tetap sederhana.
export function getRedis(): Redis {
  if (client) return client;

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Env var Redis belum diset. Isi KV_REST_API_URL & KV_REST_API_TOKEN (atau UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN) di Vercel dashboard."
    );
  }

  client = new Redis({ url, token });
  return client;
}

export const REDIS_HASH_KEY = "papan-status-tim:status";
