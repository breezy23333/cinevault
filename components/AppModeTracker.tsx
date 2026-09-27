"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

export default function AppModeTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const iosNavigator = navigator as Navigator & {
      standalone?: boolean;
    };

    const isApp =
      iosNavigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches;

    track(isApp ? "Installed App Open" : "Browser Open");
  }, []);

  return null;
}