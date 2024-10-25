import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

/**
 * Deletes a document by ID from the documents table.
 * Expects a query parameter `id` in the request URL.
 */
export async function DELETE(req: NextRequest) {
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_PRIVATE_KEY!);

  // Extract the document ID from query parameters
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("id");

  if (!documentId) {
    return NextResponse.json(
      { error: "Document ID is required" },
      { status: 400 }
    );
  }

  try {
    const { error } = await client
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
