"use client";

import { useEffect, useEffectEvent } from "react";

/** While `active`, locks page scroll and calls `onClose` when Escape is pressed. */
export function useOverlay(active, onClose) {
  const handleClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!active) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);
}
