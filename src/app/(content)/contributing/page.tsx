"use client";

import AboutContent from "@/content/contributing.mdx";

export default function ContributingGuide() {
  return (
    <article className="prose prose-xs sm:prose-sm lg:prose-base xl:prose-lg 2xl:prose-lg dark:prose-invert mx-auto py-6">
      <AboutContent />
    </article>
  );
}
