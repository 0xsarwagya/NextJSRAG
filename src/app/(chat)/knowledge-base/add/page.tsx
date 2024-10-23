import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";

export default function AddToKnowledgeBase() {
  return (
    <ContentLayout title="Add To Knowledge Base">
      <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
        <Image src="/logo.svg" alt="Rebackk Logo" width={100} height={100} />
        <h1 className="text-4xl font-bold text-center">
          Rebackk RAG Demo | Add To Knowledge Base
        </h1>
        <p className="text-lg text-center">
          Add a new knowledge base entry to the Rebackk RAG Demo. The entry will
          be used to train the model and improve the generation of responses
          tailored to the user's input.
        </p>
      </div>
    </ContentLayout>
  );
}