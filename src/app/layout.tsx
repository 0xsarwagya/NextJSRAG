import "@/styles/globals.css";
import { Poppins, Roboto, Fira_Code, Lato } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { AppBar } from "./_providers/progress-bar";

export const metadata: Metadata = {
  title: "RAG Demo | Rebackk",
  description:
    "Retrieval Augmented Generation Demo using Next.js, OLLAMA and VercelAI. For The Community, By Rebackk.",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fira-code",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppBar />
        <Toaster />
        <main
          className={`${poppins.variable} ${roboto.variable} ${firaCode.variable} ${lato.variable}`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
