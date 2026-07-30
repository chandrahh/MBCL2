import { NextRequest, NextResponse } from "next/server";
import { TEAM_MEMBERS } from "@/config/team";
import { getRedis, REDIS_HASH_KEY } from "@/lib/redis";
import { isStatus, MemberStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type StoredEntry = {
  status: string;
  task: string;
  updatedAt: number;
};

export async function GET() {
  const redis = getRedis();
  const stored = (await redis.hgetall<Record<string, StoredEntry>>(REDIS_HASH_KEY)) ?? {};

  const members: MemberStatus[] = TEAM_MEMBERS.map((name) => {
    const entry = stored[name];
    if (entry && isStatus(entry.status)) {
      return {
        name,
        status: entry.status,
        task: entry.task ?? "",
        updatedAt: entry.updatedAt ?? null,
      };
    }
    return { name, status: "belum_mulai", task: "", updatedAt: null };
  });

  return NextResponse.json({ members });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name : "";
  const status = body?.status;
  const rawTask = typeof body?.task === "string" ? body.task : "";
  const task = rawTask.slice(0, 60);

  if (!TEAM_MEMBERS.includes(name)) {
    return NextResponse.json({ error: "Nama tidak dikenali." }, { status: 400 });
  }
  if (!isStatus(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const entry: StoredEntry = { status, task, updatedAt: Date.now() };
  await getRedis().hset(REDIS_HASH_KEY, { [name]: entry });

  const result: MemberStatus = { name, status, task, updatedAt: entry.updatedAt };
  return NextResponse.json({ member: result });
}
