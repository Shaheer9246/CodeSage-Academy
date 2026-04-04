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
        <\/script>
      `;

      let finalHtml = html.trim();

      // If the HTML doesn't look like a full document, wrap it
      const hasDoctype = /<!doctype\s+html>/i.test(finalHtml);
      const hasHtmlTag = /<html[\s>]/i.test(finalHtml);
      const hasBodyTag = /<body[\s>]/i.test(finalHtml);

      if (!hasDoctype && !hasHtmlTag && !hasBodyTag) {
        // User is writing just content — wrap in a full HTML document
        finalHtml = `<!DOCTYPE html>
<html>
<head>
  ${consoleOverride}
  <style>${css}</style>
</head>
<body>
  ${finalHtml}
  <script>${js}<\/script>
</body>
</html>`;
      } else {
        // Full HTML document — inject into it
        // Add console override into <head>
        if (finalHtml.match(/<head[^>]*>/i)) {
          finalHtml = finalHtml.replace(/<head[^>]*>/i, '$&' + consoleOverride);
        } else if (finalHtml.match(/<html[^>]*>/i)) {
          finalHtml = finalHtml.replace(/<html[^>]*>/i, '$&<head>' + consoleOverride + '</head>');
        } else {
          finalHtml = consoleOverride + finalHtml;
        }

        // Inject CSS: replace link to style.css with inline style, or append to head
        if (finalHtml.match(/href=["']style\.css["']/i)) {
          finalHtml = finalHtml.replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, `<style>${css}</style>`);
        } else if (css.trim()) {
          if (finalHtml.match(/<\/head>/i)) {
            finalHtml = finalHtml.replace(/<\/head>/i, `<style>${css}</style></head>`);
          } else {
            finalHtml = `<style>${css}</style>` + finalHtml;
          }
        }

        // Inject JS: replace script src="script.js" with inline script, or append
        if (finalHtml.match(/src=["']script\.js["']/i)) {
          finalHtml = finalHtml.replace(/<script[^>]*src=["']script\.js["'][^>]*>[\s\S]*?<\/script>/gi, `<script>${js}<\/script>`);
        } else if (js.trim()) {
          if (finalHtml.match(/<\/body>/i)) {
            finalHtml = finalHtml.replace(/<\/body>/i, `<script>${js}<\/script></body>`);
          } else {
            finalHtml = finalHtml + `<script>${js}<\/script>`;
          }
        }
      }

      iframeRef.current.srcdoc = finalHtml;
    }, 400);

    return () => clearTimeout(timer);
  }, [html, css, js]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
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
