import { useEffect, useRef } from 'react';

export function AdsterraBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Avoid duplicate script insertion
    const scriptId = 'adsterra-native-banner-script';
    const existing = document.getElementById(scriptId);

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/21/1d084646f976115a3db9940d473c43d1';

    if (existing) {
      existing.remove();
    }

    containerRef.current.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full rounded-2xl border border-primary/30 bg-card/60 p-4 sm:p-5 shadow-lg overflow-hidden my-4">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Sponsored Developer Network
        </span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          Adsterra Verified
        </span>
      </div>

      {/* Adsterra Native Container */}
      <div
        id="container-1d084646f976115a3db9940d473c43d1"
        ref={containerRef}
        className="w-full min-h-[160px] flex items-center justify-center overflow-hidden"
      />
    </div>
  );
}
