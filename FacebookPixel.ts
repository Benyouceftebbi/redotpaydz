"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const FacebookPixel = ({ pixelId }: { pixelId: string }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.fbq) {
      window.fbq = function () {
        (window.fbq as any).callMethod
          ? (window.fbq as any).callMethod.apply(window.fbq, arguments)
          : (window.fbq as any).queue.push(arguments);
      };
      (window.fbq as any).push = window.fbq;
      (window.fbq as any).loaded = true;
      (window.fbq as any).version = "2.0";
      (window.fbq as any).queue = [];

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);

      window.fbq("init", pixelId);
    }

    window.fbq?.("track", "PageView");
  }, [pathname, pixelId]);

  return null; // No need to return JSX
};

export default FacebookPixel;