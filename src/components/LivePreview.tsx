import { useEffect, useRef } from 'react';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
  onConsoleLog?: (log: { type: string; message: string }) => void;
}

const LivePreview = ({ html, css, js, onConsoleLog }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeRef.current) return;

      const closeScriptTag = '</scr' + 'ipt>';
      
      const baseStyle = `
        <style>
          html, body {
            background-color: #0f0a2e;
            color: #ffffff;
            margin: 0;
            padding: 0;
            min-height: 100vh;
          }
        </style>
      `;

      // Included: Console Interceptor, CDN Libraries, Babel Compiler, and Import Maps
      const headLibraries = `
        ${baseStyle}
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

        <!-- 1. Global Vanilla 3D & Animation Libraries -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js">${closeScriptTag}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js">${closeScriptTag}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js">${closeScriptTag}
        <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.19/bundled/lenis.min.js">${closeScriptTag}

        <!-- 2. Babel Transpiler for React/JSX support -->
        <script src="https://unpkg.com/@babel/standalone/babel.min.js">${closeScriptTag}

        <!-- 3. ES Import Maps for React Three Fiber & Drei -->
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

      // Escape literal tags in JS/CSS
      const safeJs = (js || '').replace(/<\/script/gi, '</scr' + 'ipt');
      const safeCss = (css || '').replace(/<\/style/gi, '</sty' + 'le');

      // Detect if user code requires Babel (JSX or ES module imports) or standard script tag
      const containsJsxOrImports = /import\s+.*from|export\s+|<[A-Z][A-Za-z0-9]*/.test(safeJs);

      const scriptBlock = containsJsxOrImports
        ? `<script type="text/babel" data-type="module">\n${safeJs}\n${closeScriptTag}`
        : `<script>\n${safeJs}\n${closeScriptTag}`;

      let finalHtml = html.trim();

      const hasDoctype = /<!doctype\s+html>/i.test(finalHtml);
      const hasHtmlTag = /<html[\s>]/i.test(finalHtml);
      const hasBodyTag = /<body[\s>]/i.test(finalHtml);

      if (!hasDoctype && !hasHtmlTag && !hasBodyTag) {
        finalHtml = `<!DOCTYPE html>
<html>
<head>
  ${headLibraries}
  <style>${safeCss}</style>
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
          finalHtml = finalHtml.replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, `<style>${safeCss}</style>`);
        } else if (safeCss.trim()) {
          if (finalHtml.match(/<\/head>/i)) {
            finalHtml = finalHtml.replace(/<\/head>/i, `<style>${safeCss}</style></head>`);
          } else {
            finalHtml = `<style>${safeCss}</style>` + finalHtml;
          }
        }

        // Add #root div for React rendering if it doesn't exist
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
    }, 0);

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
      sandbox="allow-scripts allow-modals"
      title="Preview"
    />
  );
};

export default LivePreview;
