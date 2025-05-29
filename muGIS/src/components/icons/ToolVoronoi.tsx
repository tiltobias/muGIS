export default function Voronoi() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      {/* <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> */}
      {/* <rect width="18" height="18" x="3" y="3" rx="2"/> */}
      <rect width="20" height="20" x="2" y="2" rx="2"/>
      <circle cx="7" cy="9" r="1"/>
      <circle cx="9" cy="17" r="1"/>
      <circle cx="17" cy="10" r="1"/>
      {/* <line x1="11.7436" y1="12.0641" x2="20.4375" y2="22"/>
      <line x1="11.7436" y1="12.0641" x2="12.75" y2="2"/>
      <line x1="11.7436" y1="12.0641" x2="2" y2="14.5"/> */}
      <line x1="11.7436" y1="12.0641" x2="19.5625" y2="21"/>
      <line x1="11.7436" y1="12.0641" x2="12.65" y2="3"/>
      <line x1="11.7436" y1="12.0641" x2="3" y2="14.25"/>
    </svg>
  );
}