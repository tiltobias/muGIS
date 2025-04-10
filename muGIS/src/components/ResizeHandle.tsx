import { FC, useEffect, useState, useRef, useCallback } from "react";
import useMapStore from "../hooks/useMapStore";
import "./ResizeHandle.css";

interface ResizeHandleProps {
  setWidth: React.Dispatch<React.SetStateAction<number>>;
}

const ResizeHandle: FC<ResizeHandleProps> = ({ setWidth }) => {

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
    mapRef.current?.resize();
    if (resizing) {
      setWidth(e.clientX);
    };
  }, [resizing, mapRef, setWidth]);
  
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
      className="resizeHandle"
      onMouseDown={startResize}
      ref={resizeHandle}
    ></div>
  );
};
export default ResizeHandle;