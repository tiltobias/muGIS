/*

Inspired by code found in https://www.npmjs.com/package/react-colorful's code recipe "Popover picker": "useClickOutside.js"

Written from JavaScript to TypeScript by muGIS author.

*/

import { useEffect, RefObject } from "react";

// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = (ref: RefObject<Element | null>, handler: ()=>void) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event:Event) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) return;

      handler();
    };

    const validateEventStart = (event: Event) => {
      startedWhenMounted = !!ref.current; // Convert truthy to boolean with !!
      startedInside = !!ref.current && ref.current.contains(event.target as Node);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
