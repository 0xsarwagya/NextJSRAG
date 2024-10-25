import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { env } from "@/env";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text = body.text;

  if (env.NEXT_PUBLIC_IS_DEMO === "true") {
    return NextResponse.json(
      {
        error: [
          "Ingest is not supported in demo mode.",
          "Please set up your own version of the repo here: https://github.com/RebackkHQ/NextJSRARG",
        ].join("\n"),
      },
      { status: 403 }
    );
  }

  try {
    const client = createClient(env.SUPABASE_URL, env.SUPABASE_PRIVATE_KEY);

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,
      chunkOverlap: 20,
    });

    const splitDocuments = await splitter.createDocuments([text]);

    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OllamaEmbeddings({
        baseUrl: env.OLLAMA_BASE_URL,
        model: env.OLLAMA_EMBEDDING_MODEL_NAME,
      }),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
