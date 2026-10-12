interface PakeLagiLogoProps {
  className?: string;
  color?: string;
  variant?: "full" | "stacked" | "compact";
  height?: number;
}

export function PakeLagiLogo({
  className = "",
  color = "currentColor",
  variant = "full",
  height = 42,
}: PakeLagiLogoProps) {
  // Custom vectorized rendering of the PakeLagi handwritten cursive script logo
  if (variant === "compact") {
    return (
      <svg
        height={height}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="PakeLagi Logo"
      >
        <g stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Stylized Pake */}
          <path d="M 20,45 C 20,20 40,15 42,35 C 44,55 20,55 20,30 C 20,10 50,10 55,25 C 60,40 45,55 60,45 C 75,35 85,15 75,45" />
          {/* Stylized Lagi */}
          <path d="M 15,95 C 15,70 35,65 38,85 C 40,105 18,105 18,80 C 18,60 48,60 52,75 C 56,90 42,105 58,95 C 72,85 82,65 72,95" />
        </g>
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        height={height}
        viewBox="0 0 240 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="PakeLagi Logo"
      >
        {/* Handwritten Cursive Script Logo representation matching brand specification */}
        <g stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* PAKE - top line cursive script */}
          {/* P */}
          <path d="M 25 65 C 25 15, 60 10, 60 40 C 60 62, 25 62, 25 35 M 25 35 L 25 65" />
          {/* a */}
          <path d="M 75 42 C 60 42, 60 62, 75 62 C 85 62, 85 42, 85 62 M 85 45 L 85 62" />
          {/* k */}
          <path d="M 98 18 L 98 62 M 98 48 C 112 35, 118 42, 106 50 C 115 55, 122 62, 122 62" />
          {/* e */}
          <path d="M 132 52 C 145 52, 145 38, 132 40 C 122 42, 124 62, 142 60" />

          {/* LAGI - bottom line cursive script */}
          {/* L */}
          <path d="M 22 80 L 22 125 C 22 125, 45 125, 55 125" />
          {/* a */}
          <path d="M 72 108 C 60 108, 60 125, 72 125 C 82 125, 82 108, 82 125 M 82 110 L 82 125" />
          {/* g */}
          <path d="M 106 108 C 92 108, 92 125, 106 125 C 116 125, 116 102, 116 135 C 116 148, 95 145, 95 136" />
          {/* i */}
          <path d="M 130 110 L 130 125" />
          <circle cx="130" cy="98" r="4.5" fill={color} stroke="none" />
        </g>
      </svg>
    </div>
  );
}
