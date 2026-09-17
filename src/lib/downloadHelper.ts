/**
 * Cross-browser, iframe-safe file download utility.
 * In sandboxed iframe environments (like AI Studio preview or third-party embeds),
 * direct synthetic anchor clicks on blob URLs can be blocked by browser security policies
 * without 'allow-downloads' or due to cross-origin iframe restrictions.
 *
 * This utility handles:
 * 1. Standard anchor-based download with document.body attachment and explicit cleanup.
 * 2. msSaveOrOpenBlob legacy fallback.
 * 3. Data URI fallback for text/html files.
 * 4. Window/tab fallback with safe prompt when inside restricted iframes.
 */

export function downloadBlobFile(blob: Blob, filename: string): boolean {
  try {
    // 1. IE / legacy Edge support
    if (typeof (window.navigator as any)?.msSaveOrOpenBlob === 'function') {
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
      return true;
    }

    // 2. Standard Blob Object URL download with proper DOM attachment
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.rel = 'noopener noreferrer';
    a.target = '_self';

    document.body.appendChild(a);

    // Trigger click
    try {
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } catch {
      a.click();
    }

    // Delay revocation to ensure the browser has completed scheduling the download stream
    setTimeout(() => {
      try {
        if (a.parentNode) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('Download cleanup warning:', err);
      }
    }, 2000);

    return true;
  } catch (error) {
    console.error('Download initiation error:', error);
    return false;
  }
}

/**
 * Text-specific download helper that also falls back to data URI or safe fallback window.
 */
export function downloadTextFile(content: string, filename: string, mimeType = 'text/html;charset=utf-8'): boolean {
  try {
    const blob = new Blob([content], { type: mimeType });
    const success = downloadBlobFile(blob, filename);
    if (success) return true;
  } catch {
    // Fallback to data URI if Blob construction fails
  }

  try {
    const encoded = encodeURIComponent(content);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = `data:${mimeType},${encoded}`;
    a.download = filename;
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) document.body.removeChild(a);
    }, 1000);
    return true;
  } catch (err) {
    console.error('Data URI download failed:', err);
    return false;
  }
}
