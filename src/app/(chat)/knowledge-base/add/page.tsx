import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AddToKBEditor } from "@/components/knowledgebase/add";
import Image from "next/image";

export default function AddToKnowledgeBase() {
  return (
    <ContentLayout title="Add To Knowledge Base">
      <AddToKBEditor />
    </ContentLayout>
  );
}
