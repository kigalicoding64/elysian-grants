import { useEffect, useRef } from "react";

export const ADSENSE_CLIENT = "ca-pub-9599256736674454";

type AdBannerProps = {
  /** AdSense Slot ID OR Adcash Zone ID */
  slot?: string;
  zoneId?: string;
  /** Provider selection: 'adcash' (default) | 'adsense' */
  provider?: "adcash" | "adsense";
  format?: string;
  className?: string;
  label?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    aclib?: {
      runBanner: (config: { zoneId: string }) => void;
    };
  }
}

/**
 * Universal Ad Banner component supporting Adcash Banner Snippets & Google AdSense.
 */
export function AdBanner({
  slot,
  zoneId = "12098942",
  provider = "adcash",
  format = "auto",
  className,
  label = "Advertisement",
}: AdBannerProps) {
  const adcashContainerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    if (provider === "adcash" && adcashContainerRef.current) {
      const activeZone = zoneId || slot || "12098942";
      
      // Clears previous nodes and appends the script inside the inner <div>
      adcashContainerRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `
        if (typeof aclib !== 'undefined' && aclib.runBanner) {
          aclib.runBanner({
            zoneId: '${activeZone}'
          });
        }
      `;
      adcashContainerRef.current.appendChild(script);
    } else if (provider === "adsense") {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        // AdSense blocked or offline — fail silently
      }
    }
  }, [provider, slot, zoneId]);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-dashed border-slate-200 bg-white p-2 text-center dark:border-slate-800 dark:bg-slate-900 ${
        className ?? ""
      }`}
    >
      {label ? (
        <p className="mb-2 text-center text-[10px] uppercase tracking-widest text-slate-400">
          {label}
        </p>
      ) : null}

      {provider === "adcash" ? (
        /* Exact wrapper container structure for Adcash runBanner */
        <div ref={adcashContainerRef} className="flex min-h-[90px] items-center justify-center" />
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
