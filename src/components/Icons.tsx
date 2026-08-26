import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Svg = ({ children, ...props }: P) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" {...base} {...props}>
    {children}
  </svg>
);

export const BeanIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3c4.6 0 7.5 4 7.5 9s-2.9 9-7.5 9-7.5-4-7.5-9S7.4 3 12 3Z" />
    <path d="M12 3c-1.9 2.9-1.9 6 0 9s1.9 6.1 0 9" />
  </Svg>
);

export const FlameIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3c1.3 3 5 4.8 5 9.2A5.2 5.2 0 0 1 12 17.5 5.2 5.2 0 0 1 7 12.2c0-1.9.9-3.4 1.9-4.9.5 1.4 1.3 2.1 2.3 2.2C10.9 7.2 11.4 5 12 3Z" />
    <path d="M9.5 21h5" />
  </Svg>
);

export const CartIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 8.5h15L18 19.2a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-1.8L4.5 8.5Z" />
    <path d="M8.2 8.5V7a3.8 3.8 0 0 1 7.6 0v1.5" />
    <path d="M10 13.5c.4-1.6 3.6-1.6 4 0" />
  </Svg>
);

export const SearchIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="m15.6 15.6 4.9 4.9" />
  </Svg>
);

export const PlusIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
);

export const MinusIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5.5 12h13" />
  </Svg>
);

export const CloseIcon = (p: P) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const ArrowIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" />
  </Svg>
);

export const ChevronIcon = (p: P) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
);

export const MountainIcon = (p: P) => (
  <Svg {...p}>
    <path d="m3 19 6.5-12 3.6 6.4L15 10l6 9H3Z" />
  </Svg>
);

export const LeafIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5.5 18.5C5.5 9.5 13 5 19.5 4.5c.3 7.5-4 14-12 14h-2Z" />
    <path d="M5.5 18.5C8.5 13 12.5 9.8 16.5 8" />
  </Svg>
);

export const ThermoIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 4a2 2 0 0 1 4 0v9.3a4.2 4.2 0 1 1-4 0V4Z" />
    <path d="M12 10v7" />
  </Svg>
);

export const DropIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 4s6 6.7 6 10.8A6 6 0 0 1 6 14.8C6 10.7 12 4 12 4Z" />
  </Svg>
);

export const SunIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </Svg>
);

export const BodyIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="7.5" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const TruckIcon = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 7.5H14V16H2.5V7.5Z" />
    <path d="M14 10.5h3.6l3.4 3V16H14v-5.5Z" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </Svg>
);

export const CheckIcon = (p: P) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const PinIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.8-5.7-6.8-10.8a6.8 6.8 0 0 1 13.6 0C18.8 15.3 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Svg>
);

export const ClockIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

export const MailIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 6h17v12h-17V6Z" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </Svg>
);

export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="currentColor" {...p}>
    <path d="M12 3.2 14.7 9l6.1.6-4.6 4.1 1.3 6-5.5-3.2L6.5 19.7l1.3-6L3.2 9.6 9.3 9 12 3.2Z" />
  </svg>
);

export const LogoMark = (p: P) => (
  <svg viewBox="0 0 32 32" width="1em" height="1em" aria-hidden="true" {...p}>
    <path
      d="M16 2.5c2.2 5 8.5 7.8 8.5 15A8.5 8.5 0 0 1 16 26a8.5 8.5 0 0 1-8.5-8.5c0-3.1 1.5-5.6 3.1-8 .8 2.3 2.1 3.4 3.7 3.6C13.6 9.5 15 5.9 16 2.5Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M16 10.5c-1.3 2-1.3 4.2 0 6.2s1.3 4.2 0 6.2"
      fill="none"
      stroke="var(--color-espresso-950)"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path d="M10.5 29.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
