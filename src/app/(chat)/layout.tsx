import { AdminPanelLayout } from "@/components/admin-panel/admin-panel-layout"; // Import the AdminPanelLayout component for structuring the admin panel layout.
import "@/styles/globals.css"; // Import global CSS styles for the application.
import type { Metadata } from "next"; // Import the Metadata type from Next.js for defining page metadata.

export const metadata: Metadata = {
  title: "RAG Demo | Rebackk", // Title of the page, displayed in the browser tab.
  description:
    "Retrieval Augmented Generation Demo using Next.js, OLLAMA and VercelAI. For The Community, By Rebackk.", // Brief description of the page's content for SEO and sharing purposes.
};

/**
 * RootLayout component serves as the main layout for the application.
 * It wraps all pages and components with a consistent structure and styling.
 *
 * @param {Readonly<{ children: React.ReactNode }>} props - The component props containing children elements.
 * @returns {JSX.Element} The rendered layout containing the admin panel structure and the main content.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // The content to be rendered within the layout, passed as children props.
}>) {
  return (
    <html lang="en">
      {/* Sets the language of the document to English for accessibility and SEO. */}
      <body>
        <AdminPanelLayout>
          {/* Wraps the main content with the AdminPanelLayout for consistent styling and structure. */}
          <main>
            {/* Main content area with horizontal padding. */}
            {children}
          </main>
        </AdminPanelLayout>
      </body>
    </html>
  );
}
