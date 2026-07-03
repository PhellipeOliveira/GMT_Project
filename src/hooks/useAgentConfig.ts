"use client";

import { useEffect, useState } from "react";
import { getAgentConfig } from "@/services/chatApi";

export function useAgentConfig() {
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAgentConfig().then((config) => {
      if (!cancelled) {
        setEnabled(config.widgetEnabled);
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { enabled, loaded };
}
