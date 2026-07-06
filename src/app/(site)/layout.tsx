import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { GMTLightFooter } from "@/components/ui/GMTLightFooter";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ChatWidgetLoader } from "@/components/agent/ChatWidgetLoader";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <SmoothScroll />
      <Navbar />
      <main className="prose prose-gmt max-w-none flex-1">{children}</main>
      <GMTLightFooter />
      <Footer />
      <ChatWidgetLoader />
    </div>
  );
}
