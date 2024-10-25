import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";
import Link from "next/link";

export default function RemoveFromKnowledgeBase() {
  return (
    <ContentLayout title="Remove From Knowledge Base">
      <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
        <p className="text-sm text-gray-500">
          Check the discussion for implementation details:{" "}
          <Link
            href="https://github.com/RebackkHQ/NextJSRAG/issues/6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Issue #6
          </Link>
        </p>
      </div>
    </ContentLayout>
  );
}
