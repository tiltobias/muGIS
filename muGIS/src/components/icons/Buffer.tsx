export default function Buffer({size = 120}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6.35 6.35"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.455 5.953h.794c.53 0 .794-.264.794-.794V2.78h2.116c.53 0 .794-.265.794-.795v-.529c0-.529-.264-.794-.794-.794H1.455c-.529 0-.794.265-.794.794V5.16c0 .53.265.794.794.794" fill="#7c96a8" stroke="#517083" strokeWidth=".265"/>
      <path d="M5.292 1.72H1.72v3.572" fill="none" stroke="#565a5d" strokeWidth=".794"/>
      <path d="M5.027 1.72H1.72v3.307" fill="none" stroke="#7ea57e" strokeWidth=".265"/>
    </svg>
  );
}