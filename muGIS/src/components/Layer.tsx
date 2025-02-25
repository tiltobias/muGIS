import { FC, RefObject, useState, useEffect } from 'react';
import ColorPicker, { HslaColor } from "./ColorPicker";

interface LayerProps {
  mapRef: RefObject<mapboxgl.Map | null>;
  file: File;
  id: string;
  name: string;
}

const Layer:FC<LayerProps> = ({mapRef, file, id, name}) => {
  const [layerName] = useState<string>(name);
  const [layerColor, setLayerColor] = useState<HslaColor>({
    h: Math.floor(Math.random()*360), 
    s: 90, 
    l: 48, 
    a: 0.7,
  });

  // Add layer to map on mount of layer component
  useEffect(()=>{
    mapRef.current?.addSource(id, {
      type: "geojson",
      data: URL.createObjectURL(file),
    });
    mapRef.current?.addLayer({
      id: id,
      type: "fill",
      source: id,
      paint: {
        "fill-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
        "fill-opacity": layerColor.a,
      },
    });
    return ()=>{
      mapRef.current?.removeLayer(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mapRef.current?.removeSource(id);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <li>
      <div>{layerName}</div>
      <button onClick={()=>{
        if (mapRef.current?.getLayoutProperty(id, "visibility") === "none") {
          mapRef.current?.setLayoutProperty(id, "visibility", "visible");
        } else {
          mapRef.current?.setLayoutProperty(id, "visibility", "none");
        }
      }}>Eye</button>
      <ColorPicker 
        color={layerColor}
        onChange={(color)=>{
          setLayerColor(color);
          mapRef.current?.setPaintProperty(id, "fill-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
          mapRef.current?.setPaintProperty(id, "fill-opacity", color.a);
        }}
      />
    </li>
  );
}

export default Layer;