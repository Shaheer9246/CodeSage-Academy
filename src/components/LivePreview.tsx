import { useEffect, useRef } from 'react';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
  onConsoleLog?: (log: { type: string; message: string }) => void;
}

const LivePreview = ({ html, css, js, onConsoleLog }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevHtmlRef = useRef<string>('');
  const prevJsRef = useRef<string>('');

  useEffect(() => {
    const safeCss = (css || '').replace(/<\/style/gi, '</sty' + 'le');
    const safeJs = (js || '').replace(/<\/script/gi, '</scr' + 'ipt');
    const trimmedHtml = html.trim();

    const htmlChanged = prevHtmlRef.current !== trimmedHtml;
    const jsChanged = prevJsRef.current !== safeJs;
    const doc = iframeRef.current?.contentDocument;
    const booted = !!doc?.getElementById('codesage-live-css');

    // ⚡ INSTANT HOT CSS RELOAD: If only CSS changed, update style tag directly without reloading iframe
    if (!htmlChanged && !jsChanged && booted) {
      {
        const styleEl = doc!.getElementById('codesage-live-css');
        if (styleEl && styleEl.textContent !== safeCss) styleEl.textContent = safeCss;
      }
      return;
    }

    // ⚡ HOT HTML SWAP: markup-only projects never need a full reload, so typing
    // in the HTML pane no longer blanks the preview for a frame.
    if (booted && htmlChanged && !jsChanged && !safeJs.trim() && !/<html[\s>]|<!doctype/i.test(trimmedHtml)) {
      const timer = setTimeout(() => {
        const liveDoc = iframeRef.current?.contentDocument;
        if (!liveDoc?.body) return;
        prevHtmlRef.current = trimmedHtml;
        const root = liveDoc.getElementById('root');
        liveDoc.body.innerHTML = trimmedHtml + '<div id="root"></div>';
        void root;
        const styleEl = liveDoc.getElementById('codesage-live-css');
        if (styleEl) styleEl.textContent = safeCss;
      }, 250);
      return () => clearTimeout(timer);
    }

    // Debounce full updates for HTML/JS so typing doesn't reload on every single keystroke
    const timer = setTimeout(() => {

      if (!iframeRef.current) return;

      // Update refs
      prevHtmlRef.current = trimmedHtml;
      prevJsRef.current = safeJs;

      const closeScriptTag = '</scr' + 'ipt>';

      // Base dark theme + hot-reload CSS container
      const baseStyle = `
        <style>
          html, body {
            background-color: #0f0a2e !important;
            color: #ffffff;
            margin: 0;
            padding: 0;
            min-height: 100vh;
          }
        </style>
        <style id="codesage-live-css">${safeCss}</style>
      `;

      // Console capture wrapper
      const consoleOverride = `
        <script>
          (function() {
            const origLog = console.log;
            const origError = console.error;
            const origWarn = console.warn;
            console.log = function(...args) {
              origLog.apply(console, args);
              window.parent.postMessage({ type: 'console-log', logType: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            };
            console.error = function(...args) {
              origError.apply(console, args);
              window.parent.postMessage({ type: 'console-log', logType: 'error', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            };
            console.warn = function(...args) {
              origWarn.apply(console, args);
              window.parent.postMessage({ type: 'console-log', logType: 'warn', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            };
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'console-log', logType: 'error', message: 'Error: ' + msg + ' (line ' + line + ')' }, '*');
            };
          })();
        ${closeScriptTag}
      `;

      // Three.js, GSAP, React, Babel & ESM Import Maps
      const headLibraries = `
        ${baseStyle}
        ${consoleOverride}

        <!-- Global Libraries -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js">${closeScriptTag}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js">${closeScriptTag}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js">${closeScriptTag}
        <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.19/bundled/lenis.min.js">${closeScriptTag}

        <!-- Babel Compiler for React/JSX -->
        <script src="https://unpkg.com/@babel/standalone/babel.min.js">${closeScriptTag}

        <!-- ES Module Import Maps -->
        <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "three": "https://esm.sh/three@0.160.0",
            "@react-three/fiber": "https://esm.sh/@react-three/fiber@8.15.16?external=react,react-dom,three",
            "@react-three/drei": "https://esm.sh/@react-three/drei@9.96.1?external=react,react-dom,three,@react-three/fiber"
          }
        }
        ${closeScriptTag}
      `;

      // Detect if user JS contains JSX or ES Imports
      const containsJsxOrImports = /import\s+.*from|export\s+|<[A-Z][A-Za-z0-9]*/.test(safeJs);

      const scriptBlock = containsJsxOrImports
        ? `<script type="text/babel" data-type="module">\n${safeJs}\n${closeScriptTag}`
        : `<script>\n${safeJs}\n${closeScriptTag}`;

      let finalHtml = trimmedHtml;

      const hasDoctype = /<!doctype\s+html>/i.test(finalHtml);
      const hasHtmlTag = /<html[\s>]/i.test(finalHtml);
      const hasBodyTag = /<body[\s>]/i.test(finalHtml);

      if (!hasDoctype && !hasHtmlTag && !hasBodyTag) {
        finalHtml = `<!DOCTYPE html>
<html>
<head>
  ${headLibraries}
</head>
<body>
  ${finalHtml}
  <div id="root"></div>
  ${scriptBlock}
</body>
</html>`;
      } else {
        if (finalHtml.match(/<head[^>]*>/i)) {
          finalHtml = finalHtml.replace(/<head[^>]*>/i, '$&' + headLibraries);
        } else if (finalHtml.match(/<html[^>]*>/i)) {
          finalHtml = finalHtml.replace(/<html[^>]*>/i, '$&<head>' + headLibraries + '</head>');
        } else {
          finalHtml = headLibraries + finalHtml;
        }

        if (finalHtml.match(/href=["']style\.css["']/i)) {
          finalHtml = finalHtml.replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, '');
        }

        if (!finalHtml.includes('id="root"')) {
          if (finalHtml.match(/<body[^>]*>/i)) {
            finalHtml = finalHtml.replace(/<body[^>]*>/i, '$&<div id="root"></div>');
          }
        }

        if (finalHtml.match(/src=["']script\.js["']/i)) {
          finalHtml = finalHtml.replace(/<script[^>]*src=["']script\.js["'][^>]*>[\s\S]*?<\/script>/gi, scriptBlock);
        } else if (safeJs.trim()) {
          if (finalHtml.match(/<\/body>/i)) {
            finalHtml = finalHtml.replace(/<\/body>/i, `${scriptBlock}</body>`);
          } else {
            finalHtml = finalHtml + scriptBlock;
          }
        }
      }

      iframeRef.current.srcdoc = finalHtml;
    }, 600);

    return () => clearTimeout(timer);
  }, [html, css, js]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === 'console-log' && onConsoleLog) {
        onConsoleLog({ type: e.data.logType, message: e.data.message });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onConsoleLog]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0 bg-[#0f0a2e]"
      style={{ backgroundColor: '#0f0a2e' }}
      sandbox="allow-scripts allow-modals allow-downloads"
      title="Preview"
    />
  );
};

export default LivePreview;
