"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
  pageId: string;
}

export function AnalyticsTracker({ pageId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Registrar page view
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageId,
            type: "pageView",
          }),
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };

    trackPageView();
  }, [pageId]);

  return null; // Componente invisível
}
