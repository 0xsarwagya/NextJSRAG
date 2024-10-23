"use client";

import AboutContent from "@/content/about.mdx";

export default function About() {
  return (
    <article className="prose prose-xs sm:prose-sm lg:prose-base xl:prose-lg 2xl:prose-lg dark:prose-invert mx-auto py-6">
      <AboutContent />
    </article>
  );
}
