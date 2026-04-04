"use client";

interface VoxLoaderProps {
  /** Optional description shown below the animation */
  label?: string;
  /** Bar height: sm=20px md=32px lg=48px */
  size?: "sm" | "md" | "lg";
  /** Extra class names on the wrapper */
  className?: string;
  /**
   * When true the loader is centred in a full-viewport div with the
   * page background colour – useful for top-level loading screens.
   */
  fullScreen?: boolean;
}

const BAR_DELAYS = ["0ms", "140ms", "280ms", "140ms", "0ms"];

const SIZE: Record<
  NonNullable<VoxLoaderProps["size"]>,
  { h: number; w: number; gap: number; label: string }
> = {
  sm: { h: 18, w: 3,  gap: 2, label: "text-xs" },
  md: { h: 32, w: 4,  gap: 3, label: "text-sm" },
  lg: { h: 48, w: 5,  gap: 4, label: "text-base" },
};

export default function VoxLoader({
  label,
  size = "md",
  className = "",
  fullScreen = false,
}: VoxLoaderProps) {
  const { h, w, gap, label: labelSize } = SIZE[size];

  const animation = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Waveform bars */}
      <div
        className="flex items-center"
        style={{ gap, height: h }}
        aria-hidden="true"
      >
        {BAR_DELAYS.map((delay, i) => (
          <span
            key={i}
            className="vox-wave-bar rounded-full"
            style={{
              width: w,
              height: h,
              backgroundColor: "var(--accent)",
              animationDelay: delay,
            }}
          />
        ))}
      </div>

      {label && (
        <p
          className={`${labelSize} font-medium tracking-wide`}
          style={{ color: "var(--fg-muted)" }}
        >
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        {animation}
      </div>
    );
  }

  return animation;
}
