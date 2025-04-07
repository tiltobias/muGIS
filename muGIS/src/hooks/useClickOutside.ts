import { useEffect, RefObject } from "react";

const useClickOutside = (
  ref: RefObject<Element | null>, 
  handler: ()=>void, 
  ignoreRefs: RefObject<Element | null>[] = [], // empty array if none given
) => {

  useEffect(() => {
    
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        ref.current && 
        !ref.current.contains(target) && 
        !ignoreRefs.some((ignoreRef) => ignoreRef.current?.contains(target))
      ) {
        handler();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, handler, ignoreRefs]);
};

export default useClickOutside;
