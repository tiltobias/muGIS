import { FC, RefObject, useState, useEffect } from 'react';
import ColorPicker, { HslaColor } from "./ColorPicker";
import "./Layer.css";
import { FeatureCollection } from "geojson";

interface LayerData {
  featureCollection: FeatureCollection;
  id: string;
  name: string;
}

interface LayerProps {
  mapRef: RefObject<mapboxgl.Map | null>;
  layerData: LayerData;
  handleLayerUp: () => void;
  handleLayerDown: () => void;
  layerAboveId: string | undefined;
}

const Layer:FC<LayerProps> = ({mapRef, layerData, handleLayerUp, handleLayerDown, layerAboveId}) => {
  const [layerName] = useState<string>(layerData.name);
  const [layerColor, setLayerColor] = useState<HslaColor>({
    h: Math.floor(Math.random()*360), 
    s: 90, 
    l: 48, 
    a: 0.7,
  });

  // Add layer to map on mount of layer component
  useEffect(()=>{
    if (!mapRef.current?.getSource(layerData.id)) {
      mapRef.current?.addSource(layerData.id, {
        type: "geojson",
        data: layerData.featureCollection,
      });
    }
    if (!mapRef.current?.getLayer(layerData.id)) {
      mapRef.current?.addLayer({
        id: layerData.id,
        type: "fill",
        source: layerData.id,
        paint: {
          "fill-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
          "fill-opacity": layerColor.a,
        },
      });
    }
    // return ()=>{
    //   mapRef.current?.removeLayer(layerData.id);
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    //   mapRef.current?.removeSource(layerData.id);
    // };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // Always keep layer under layerAboveId
  useEffect(()=>{
    mapRef.current?.moveLayer(layerData.id, layerAboveId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[layerAboveId]);

  return (
    <li className="layerListItem">
      <div className="layerItem">
        <ColorPicker 
          color={layerColor}
          onChange={(color)=>{
            setLayerColor(color);
            mapRef.current?.setPaintProperty(layerData.id, "fill-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
            mapRef.current?.setPaintProperty(layerData.id, "fill-opacity", color.a);
          }}
        />
        <div className="layerName">
          {layerName}
        </div>
        <button type="button" onClick={handleLayerUp}>^</button>
        <button type="button" onClick={handleLayerDown}>v</button>
        <button type="button" onClick={()=>{
          if (mapRef.current?.getLayoutProperty(layerData.id, "visibility") === "none") {
            mapRef.current?.setLayoutProperty(layerData.id, "visibility", "visible");
          } else {
            mapRef.current?.setLayoutProperty(layerData.id, "visibility", "none");
          }
        }}>
          Eye
        </button>
      </div> 
    </li>
  );
}

export default Layer;
export type { LayerData };