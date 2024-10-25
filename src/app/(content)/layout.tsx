import React from "react";
import "@/styles/globals.css";
import { ContentNavbar } from "@/components/content/navbar";
import { Footer } from "@/components/admin-panel/footer";
import { revalidatePath } from "next/cache";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <div className="py-2 lg:py-6" />
      <ContentNavbar />
      <main className="flex justify-center">
        <main className="lg:w-2/3 w-full px-2 lg:px-6">
          {children}
          <Footer />
        </main>
      </main>
    </React.Fragment>
  );
}
