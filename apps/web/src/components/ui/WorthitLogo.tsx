interface LogoProps {
  className?: string;
  size?: number;
  colored?: boolean;
}

export function WorthitLogo({ className = 'w-6 h-6', size, colored = true }: LogoProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="WorthIt Logo"
    >
      <g fill={colored ? '#1949EF' : 'currentColor'}>
        <path
          d="M 233 460 L 169 460 L 53 189 L 129 187 L 202 368 L 227 325 L 140 187 L 174 186 L 273 400 Z"
          fillRule="evenodd"
        />
        <path
          d="M 470 146 L 396 148 L 324 330 L 297 274 L 372 147 L 333 146 L 235 363 L 260 405 L 358 460 L 423 458 Z"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}
