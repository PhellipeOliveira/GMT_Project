"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/components/agent/ChatWidget").then((mod) => mod.ChatWidget),
  { ssr: false },
);

export function ChatWidgetLoader() {
  return <ChatWidget />;
}
