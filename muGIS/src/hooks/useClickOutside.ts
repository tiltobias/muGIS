import { useEffect, RefObject } from "react";

const useClickOutside = (ref: RefObject<Element | null>, handler: ()=>void) => {
  useEffect(() => {

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, handler]);
};

export default useClickOutside;
