import type { Metadata } from "next";
import { DM_Sans, Host_Grotesk } from "next/font/google";
import "@/styles/globals.css";

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
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
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
      <body className="min-h-full bg-gmt-bg text-gmt-text">{children}</body>
    </html>
  );
}
