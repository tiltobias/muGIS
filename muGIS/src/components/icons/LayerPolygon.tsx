export default function LayerPolygon({size = 120}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        style={{
          fill: 'currentColor',
          stroke: 'currentColor',
          strokeWidth: 16,
          strokeLinejoin: 'round',
          strokeOpacity: 1,
          fillOpacity: 0.5,
        }}
        d="M 60,17 100,48 88,95 H 32 L 20,48 60,17"
      />
      <circle cx="60" cy="17" r="12" fill="currentColor" />
      <circle cx="100" cy="48" r="12" fill="currentColor" />
      <circle cx="88" cy="95" r="12" fill="currentColor" />
      <circle cx="32" cy="95" r="12" fill="currentColor" />
      <circle cx="20" cy="48" r="12" fill="currentColor" />
    </svg>
  );
}