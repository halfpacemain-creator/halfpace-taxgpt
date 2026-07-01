import brandMark from "@/assets/brand-mark.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-14 w-14",
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src={brandMark}
        alt="HalfPace TaxGPT"
        className={cn(sizes[size], "shrink-0 rounded-[28%] shadow-sm ring-1 ring-black/5")}
        width={56}
        height={56}
      />
      {showText && (
        <div className="leading-tight">
          <div className="font-display text-[15px] font-semibold tracking-tight text-foreground">
            HalfPace<sup className="reg-mark" aria-hidden>®</sup>{" "}
            <span className="brand-gradient-text">TaxGPT</span>
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            India's AI Tax Expert
          </div>
        </div>
      )}
    </div>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={brandMark}
      alt=""
      aria-hidden
      className={cn("rounded-[28%]", className)}
    />
  );
}
