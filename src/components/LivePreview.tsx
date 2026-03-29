import { useEffect, useRef, useState } from 'react';

interface LivePreviewProps {
  code: string;
  onConsoleLog?: (log: { type: string; message: string }) => void;
}

const LivePreview = ({ code, onConsoleLog }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

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
        </script>
      `;

      const injectedCode = code.replace('<head>', '<head>' + consoleOverride)
        .replace('<HEAD>', '<HEAD>' + consoleOverride);
      
      const finalCode = injectedCode.includes('<head>') || injectedCode.includes('<HEAD>')
        ? injectedCode
        : consoleOverride + code;

      iframeRef.current.srcdoc = finalCode;
    }, 300);

    return () => clearTimeout(timer);
  }, [code]);

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
      key={key}
      className="w-full h-full border-0 bg-white rounded-b-lg"
      sandbox="allow-scripts allow-modals"
      title="Preview"
    />
  );
};

export default LivePreview;
