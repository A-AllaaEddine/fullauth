type Props = { className?: string; inverse?: boolean };

/** The FullAuth F symbol, drawn as three restrained geometric strokes. */
export default function LogoMark({ className, inverse = false }: Props) {
  return (
    <svg
      className={className}
      viewBox="12 8 76 88"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={inverse ? 'logo-ink-inverse' : 'logo-ink'}
        d="M43 12h35v17H63c-7 0-11 4-11 11v2H32v-5c0-15 4-25 11-25Z"
      />
      <path
        className="logo-crossbar"
        d="M32 46h54L73 61c-2 3-5 4-9 4H14l13-15c1-2 3-4 5-4Z"
      />
      <path
        className={inverse ? 'logo-ink-inverse' : 'logo-ink'}
        d="M33 70h20v10c0 9-5 14-14 14h-6V70Z"
      />
    </svg>
  );
}
