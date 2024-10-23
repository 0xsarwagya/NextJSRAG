import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";

export default function ListKnowledgeBase() {
  return (
    <ContentLayout title="Knowledge Base List">
      <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
        <Image
          src="/logo.svg"
          alt="Rebackk Logo"
          width={100}
          height={100}
        />
        <h1 className="text-4xl font-bold text-center">
          Rebackk RAG Demo | Knowledge Base List
        </h1>
        <p className="text-lg text-center">
          View the knowledge base entries in the Rebackk RAG Demo. The entries
          are used to train the model and improve the generation of responses
          tailored to the user's input.
        </p>
      </div>
    </ContentLayout>
  );
}
