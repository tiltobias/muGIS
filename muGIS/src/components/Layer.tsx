import { FC, RefObject, useState, useEffect } from 'react';
import ColorPicker, { RgbaColor } from "./ColorPicker";

interface LayerProps {
  mapRef: RefObject<mapboxgl.Map | null>;
  source: string;
  id: string;
  name: string;
}

const Layer:FC<LayerProps> = ({mapRef, source, id, name}) => {
  const [layerName] = useState<string>(name);
  const [layerColor, setLayerColor] = useState<RgbaColor>({
    r: Math.floor(Math.random()*255), 
    g: Math.floor(Math.random()*255), 
    b: Math.floor(Math.random()*255), 
    a: 0.7,
  });

  // Add layer to map on mount of layer component
  useEffect(()=>{
    mapRef.current?.addLayer({
      id: id,
      type: "fill",
      source: source,
      paint: {
        "fill-color": `rgb(${layerColor.r},${layerColor.g},${layerColor.b})`,
        "fill-opacity": layerColor.a,
      },
    });
    console.log("Load Data Layer: " + name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <li>
      <div>{layerName}</div>
      <button onClick={()=>{
        if (mapRef.current?.getLayoutProperty(id, "visibility") === "none") {
          mapRef.current?.setLayoutProperty(id, "visibility", "visible");
          console.log(mapRef.current?.getPaintProperty(id, "fill-color"));
        } else {
          mapRef.current?.setLayoutProperty(id, "visibility", "none");
        }
      }}>Eye</button>
      <ColorPicker 
        color={layerColor}
        onChange={(color)=>{
          setLayerColor(color);
          mapRef.current?.setPaintProperty(id, "fill-color", `rgb(${color.r},${color.g},${color.b})`);
          mapRef.current?.setPaintProperty(id, "fill-opacity", color.a);
        }}
      />
    </li>
  );
}

export default Layer;