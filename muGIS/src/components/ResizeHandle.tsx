import { FC, useEffect, useState, useRef, useCallback } from "react";
import useMapStore from "../hooks/useMapStore";
import "./ResizeHandle.css";

interface ResizeHandleProps {
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResizeHandle: FC<ResizeHandleProps> = ({ setWidth, setOpen }) => {

  const { 
    mapRef,
  } = useMapStore();

  const resizeHandle = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const stopResize = useCallback(() => {
    setResizing(false);
    setTimeout(() => {
      mapRef.current?.resize();
    }, 1);
    setTimeout(() => {
      mapRef.current?.resize();
    }, 100); 
  }, [mapRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (resizing) {
      mapRef.current?.resize();
      setWidth(e.clientX);
      if (e.clientX < 100) {
        setOpen(false);
      } else {
        setOpen(true);
      };
    };
  }, [resizing, mapRef, setWidth, setOpen]);
  
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [resizing, handleMouseMove, stopResize]);


  return (
    <div
      className={`resizeHandle ${resizing ? "resizing" : ""}`}
      onMouseDown={startResize}
      ref={resizeHandle}
    ></div>
  );
};
export default ResizeHandle;