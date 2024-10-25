import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import { Database } from "@/types/db";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const client = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PRIVATE_KEY
  );

  try {
    const { data, error } = await client.from("documents").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
