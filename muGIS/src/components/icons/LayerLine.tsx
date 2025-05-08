export default function LayerLine({size = 120}: {size?: number}) {
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
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 16,
          strokeLinejoin: 'round',
          strokeOpacity: 1,
        }}
        d="M 15,55 50,80 70,40 105,65"
      />
      <circle cx="15" cy="55" r="12" fill="currentColor" />
      <circle cx="50" cy="80" r="12" fill="currentColor" />
      <circle cx="70" cy="40" r="12" fill="currentColor" />
      <circle cx="105" cy="65" r="12" fill="currentColor" />
    </svg>
  );
}