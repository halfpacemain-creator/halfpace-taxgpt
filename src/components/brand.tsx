import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Brand renders the registered wordmark "HalfPace®" with the ® mark
 * baseline-aligned via the `reg-mark` utility. Use everywhere the brand
 * appears in visible UI copy (never inside code, URLs, or file names).
 */
export function Brand({
  className,
  suffix,
  ...rest
}: ComponentPropsWithoutRef<"span"> & { suffix?: string }) {
  return (
    <span className={cn("whitespace-nowrap", className)} {...rest}>
      HalfPace<sup className="reg-mark" aria-hidden>®</sup>
      <span className="sr-only">, registered trademark</span>
      {suffix ? ` ${suffix}` : null}
    </span>
  );
}
