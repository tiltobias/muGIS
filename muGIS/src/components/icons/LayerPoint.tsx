export default function LayerPoint({size = 120}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="25" fill="currentColor" />
    </svg>
  );
}