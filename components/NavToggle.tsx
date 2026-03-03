"use client";

import * as React from "react";

export default function NavToggle({ navId }: { navId: string }) {
  const [open, setOpen] = React.useState(false);

  // Lock background scroll while menu is open on mobile.
  React.useEffect(() => {
    const body = document.body;
    if (open) body.classList.add("navOpen");
    else body.classList.remove("navOpen");
    return () => body.classList.remove("navOpen");
  }, [open]);

  // Toggle menu class on the existing <nav> element.
  React.useEffect(() => {
    const nav = document.getElementById(navId);
    if (!nav) return;
    if (open) nav.classList.add("isOpen");
    else nav.classList.remove("isOpen");

    // Close when clicking a link inside the menu.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("a")) setOpen(false);
    };
    nav.addEventListener("click", onClick);
    return () => nav.removeEventListener("click", onClick);
  }, [open, navId]);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <button
      type="button"
      className="navToggle"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-controls={navId}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
    >
      <span className="navToggleIcon" aria-hidden="true" />
    </button>
  );
}
