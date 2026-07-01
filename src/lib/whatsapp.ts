// Single source of truth for WhatsApp handoff.
// Use only a normal external wa.me URL so the browser handles WhatsApp outside the app.

export const WHATSAPP_NUMBER = "919987600927";
export const WHATSAPP_DISPLAY = "+91 99876 00927";

export function buildWhatsAppMessage(userQuery: string, aiResponse: string): string {
  const q = (userQuery || "").trim() || "(not provided)";
  const a = (aiResponse || "").trim() || "(not provided)";
  return `Hello HalfPace Team,

I was using HalfPace TaxGPT and need further assistance.

My Question:
${q}

AI Response:
${a}

Please help me understand this further.

Thank you.`;
}

function encodedMessage(userQuery = "", aiResponse = ""): string {
  const text = buildWhatsAppMessage(userQuery, aiResponse);
  return encodeURIComponent(text);
}

export function buildWhatsAppUrl(userQuery = "", aiResponse = ""): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage(userQuery, aiResponse)}`;
}

export function openWhatsAppInNewTab(userQuery = "", aiResponse = ""): void {
  if (typeof window === "undefined") return;
  const url = buildWhatsAppUrl(userQuery, aiResponse);

  const openFrom = (sourceWindow: Window): boolean => {
    const newTab = sourceWindow.open("", "_blank");
    if (!newTab) return false;
    newTab.opener = null;
    newTab.location.href = url;
    return true;
  };

  try {
    if (window.top && openFrom(window.top)) return;
  } catch {
    // Fall back to the current frame below if the preview shell blocks top-level access.
  }

  if (openFrom(window)) return;

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
