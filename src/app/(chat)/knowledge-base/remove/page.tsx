import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";

export default function RemoveFromKnowledgeBase() {
  return (
    <ContentLayout title="Remove From Knowledge Base">
      <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
        <Image
          src="/logo.svg"
          alt="Rebackk Logo"
          width={100}
          height={100}
        />
        <h1 className="text-4xl font-bold text-center">
          Rebackk RAG Demo | Remove From Knowledge Base
        </h1>
        <p className="text-lg text-center">
          Remove a knowledge base entry from the Rebackk RAG Demo. The entry will
          be removed from the training data and will no longer be used to generate
          responses tailored to the user's input.
        </p>
      </div>
    </ContentLayout>
  );
}
