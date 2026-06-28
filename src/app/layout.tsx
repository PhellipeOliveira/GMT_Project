import type { Metadata } from "next";
import { DM_Sans, Host_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HomeLanternSection } from "@/components/home/HomeLanternSection";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { FloatingCTA } from "@/components/ui/FloatingCTA";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dmsans",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-hostgrotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GMT — Growth Marketing Technology",
    template: "%s · GMT",
  },
  description:
    "Agência especialista em automações, inteligência artificial e marketing digital para pequenas empresas. Lisboa, Portugal.",
  icons: {
    icon: "/images/GL-02.webp",
    apple: "/images/GL-02.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${dmSans.variable} ${hostGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gmt-bg text-gmt-text">
        <SmoothScroll />
        <Navbar />
        <main className="prose prose-gmt max-w-none flex-1">
          {children}
        </main>
        <Footer />
        <HomeLanternSection />
        <FloatingCTA />
      </body>
    </html>
  );
}
