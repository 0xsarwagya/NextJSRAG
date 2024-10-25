import { ContentLayout } from "@/components/admin-panel/content-layout";
import KnowledgebaseList from "@/components/knowledgebase/list";
import { env } from "@/env";

type KnowledgeBaseEntry = {
  id: number;
  content: string;
  metadata: {
    loc: {
      lines: {
        from: number;
        to: number;
      };
    };
  };
  embedding: number[];
};

export default async function ListKnowledgeBase() {
  try {
    const baseUrl =
      env.NODE_ENV === "development"
        ? env.NEXT_PUBLIC_URL_DEV
        : env.NEXT_PUBLIC_URL_PROD;

    const res = await fetch(
      new URL("/api/knowledge-base/get", baseUrl).toString()
    );

    if (!res.ok) {
      throw new Error("Failed to fetch knowledge base entries.");
    }

    const data = (await res.json()) satisfies Array<KnowledgeBaseEntry>;

    const formattedData = data.map((entry: KnowledgeBaseEntry) => {
      return {
        id: entry.id,
        from_line: entry.metadata.loc.lines.from,
        to_line: entry.metadata.loc.lines.to,
        content: entry.content,
      };
    });

    return (
      <ContentLayout title="Knowledge Base List">
        <KnowledgebaseList data={formattedData} />
      </ContentLayout>
    );
  } catch (error) {
    return (
      <ContentLayout title="Knowledge Base List">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          <p className="text-lg text-center">
            An error occurred while fetching the knowledge base entries. Please
            try again.
          </p>
        </div>
      </ContentLayout>
    );
  }
}
