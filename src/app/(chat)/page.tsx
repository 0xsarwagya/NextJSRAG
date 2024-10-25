import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Chat } from "@/components/chat/chat-container";

export default function Home() {
  return (
    <ContentLayout title="Home">
      <div className="flex flex-col space-y-4 h-50vh">
        <Chat />
      </div>
    </ContentLayout>
  );
}
