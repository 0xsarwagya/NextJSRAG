import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";

export default function Home() {
  return (
    <ContentLayout title="Home">
      <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
        <Image
          src="/logo.svg"
          alt="Rebackk Logo"
          width={100}
          height={100}
        />
        <h1 className="text-4xl font-bold text-center">Welcome to Rebackk</h1>
        <p className="text-lg text-center">
          Retrieval Augmented Generation Demo using Next.js, OLLAMA and
          VercelAI. For The Community, By Rebackk.
        </p>
      </div>
    </ContentLayout>
  );
}
