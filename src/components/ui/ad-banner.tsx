import { useEffect, useRef } from "react";

export const ADSENSE_CLIENT = "ca-pub-9599256736674454";

type AdBannerProps = {
  slot: string;
  format?: string;
  className?: string;
  label?: string;
};

/**
 * Reusable Google AdSense unit. The loader script lives in the root route head.
 */
export function AdBanner({ slot, format = "auto", className, label = "Advertisement" }: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // AdSense not available (blocked or offline) — fail silently.
    }
  }, []);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-dashed border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 ${className ?? ""}`}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
