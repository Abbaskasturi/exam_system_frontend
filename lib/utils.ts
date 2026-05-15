export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Clipboard copy failed", err);
      return false;
    }
  } else {
    // Fallback for non-secure contexts (like accessing via IP on HTTP)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Move outside of viewport
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      console.error("Fallback copy failed", err);
      textArea.remove();
      return false;
    }
  }
}
