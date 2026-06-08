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

      // Escape any literal "</script>" inside user JS so it doesn't break out
      const safeJs = (js || '').replace(/<\/script/gi, '</scr' + 'ipt');
      // Same for CSS </style>
      const safeCss = (css || '').replace(/<\/style/gi, '</sty' + 'le');

      let finalHtml = html.trim();

      // If the HTML doesn't look like a full document, wrap it
      const hasDoctype = /<!doctype\s+html>/i.test(finalHtml);
      const hasHtmlTag = /<html[\s>]/i.test(finalHtml);
      const hasBodyTag = /<body[\s>]/i.test(finalHtml);

      if (!hasDoctype && !hasHtmlTag && !hasBodyTag) {
        finalHtml = `<!DOCTYPE html>
<html>
<head>
  ${consoleOverride}
  <style>${safeCss}</style>
</head>
<body>
  ${finalHtml}
  <script>${safeJs}${closeScriptTag}
</body>
</html>`;
      } else {
        if (finalHtml.match(/<head[^>]*>/i)) {
          finalHtml = finalHtml.replace(/<head[^>]*>/i, '$&' + consoleOverride);
        } else if (finalHtml.match(/<html[^>]*>/i)) {
          finalHtml = finalHtml.replace(/<html[^>]*>/i, '$&<head>' + consoleOverride + '</head>');
        } else {
          finalHtml = consoleOverride + finalHtml;
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

        if (finalHtml.match(/src=["']script\.js["']/i)) {
          finalHtml = finalHtml.replace(/<script[^>]*src=["']script\.js["'][^>]*>[\s\S]*?<\/script>/gi, `<script>${safeJs}</script>`);
        } else if (safeJs.trim()) {
          if (finalHtml.match(/<\/body>/i)) {
            finalHtml = finalHtml.replace(/<\/body>/i, `<script>${safeJs}</script></body>`);
          } else {
            finalHtml = finalHtml + `<script>${safeJs}</script>`;
          }
        }
      }

      iframeRef.current.srcdoc = finalHtml;
    }, 400);

    return () => clearTimeout(timer);
  }, [html, css, js]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Only accept messages from our own iframe
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
      className="w-full h-full border-0 bg-white"
      sandbox="allow-scripts allow-modals"
      title="Preview"
    />
  );
};

export default LivePreview;
