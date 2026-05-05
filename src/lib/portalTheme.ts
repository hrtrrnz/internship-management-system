/** Dream Academy Portal chrome — matches landing footer (`bg-[#0f121a]`). */
export const portalButtonClass =
  "bg-[#0f121a] text-white border border-white/10 shadow-sm hover:bg-[#1a1f2e] hover:text-white focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f121a]";

export const portal = {
  bg: "bg-[#0f121a]",
  surface: "bg-[#141821]",
  border: "border-white/10",
  text: "text-white",
  muted: "text-white/70",
  accentCyan: "text-[#20d2ff]",
  accentOrange: "text-[#ff6f3b]",
} as const;

/** Inputs on portal dark surfaces */
export const portalFieldClass =
  "w-full rounded-lg border border-white/15 bg-[#0f121a] py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/25";

export const portalLabelClass = "mb-1.5 block text-sm font-medium text-white";

export const portalLinkClass = "font-medium text-[#20d2ff] hover:underline";

export const portalPrimaryCtaClass =
  "w-full rounded-lg bg-white py-3 text-sm font-semibold text-[#0f121a] transition-colors hover:bg-white/90";

/** Raised surface on portal footer tone (demo cards, etc.) */
export const portalSurfaceCardClass = "rounded-xl border border-white/10 bg-[#141821]";
