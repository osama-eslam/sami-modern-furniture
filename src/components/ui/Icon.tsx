import type { SVGProps } from "react";

/**
 * Thin-stroke icon set (1.25px) drawn for this site — no icon library needed.
 */
const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.8-4.8" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.2-4 4.4-6 8-6s6.8 2 8 6" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />,
  bag: <><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  menu: <><path d="M3 8h18" /><path d="M3 16h12" /></>,
  close: <><path d="M5 5l14 14" /><path d="M19 5L5 19" /></>,
  arrow: <><path d="M4 12h16" /><path d="M14 6l6 6-6 6" /></>,
  arrowUpRight: <><path d="M7 17L17 7" /><path d="M8 7h9v9" /></>,
  chevron: <path d="M9 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  mail: <><rect x="3" y="5.5" width="18" height="13" /><path d="M3 6l9 7 9-7" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" /></>,
  compare: <><path d="M7 4v16" /><path d="M17 4v16" /><path d="M3 8h8" /><path d="M13 16h8" /></>,
  expand: <><path d="M4 9V4h5" /><path d="M20 9V4h-5" /><path d="M4 15v5h5" /><path d="M20 15v5h-5" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="M6 7l1 13h10l1-13" /></>,
  share: <><circle cx="18" cy="5.5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="18.5" r="2.5" /><path d="M8.2 10.8l7.6-4.1" /><path d="M8.2 13.2l7.6 4.1" /></>,
  filter: <><path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" /><path d="M4 17h2" /><path d="M10 17h10" /><circle cx="8" cy="17" r="2" /></>,
  play: <path d="M8 5.5v13l10-6.5-10-6.5z" />,
  home: <><path d="M4 10.5L12 4l8 6.5" /><path d="M6 9v11h12V9" /></>,
  grid: <><rect x="4" y="4" width="6.5" height="6.5" /><rect x="13.5" y="4" width="6.5" height="6.5" /><rect x="4" y="13.5" width="6.5" height="6.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  box: <><path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z" /><path d="M3.5 7.5L12 11.5l8.5-4" /><path d="M12 11.5v9" /></>,
  upload: <><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
  logout: <><path d="M14 4h6v16h-6" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h10" /></>,
  zoomIn: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.8-4.8" /><path d="M10.5 8v5" /><path d="M8 10.5h5" /></>,
  sparkle: <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" />,
  ruler: <><path d="M3 17L17 3l4 4L7 21z" /><path d="M7 13l2 2M10 10l2 2M13 7l2 2" /></>,
  truck: <><path d="M2.5 6.5h11v10h-11z" /><path d="M13.5 10h4l3 3v3.5h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
} as const;

export type IconName = keyof typeof paths | "whatsapp" | "instagram" | "facebook" | "tiktok" | "youtube";

const brand: Record<string, React.ReactNode> = {
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.6 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5zm0 17.2a7.8 7.8 0 0 1-4-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.8 7.8 0 1 1 12 19.7zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.7 4.2 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-.4-.2z"
    />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5l.5-3.5h-3V9a.5.5 0 0 1 .5-.5z" />,
  tiktok: <path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3M14 3.5c.4 2.5 2.1 4.2 4.5 4.5" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
    </>
  ),
};

export function Icon({ name, size = 20, className, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {name in brand ? brand[name] : paths[name as keyof typeof paths]}
    </svg>
  );
}
