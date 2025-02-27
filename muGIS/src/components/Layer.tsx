import { FC, RefObject, useState, useEffect } from 'react';
import ColorPicker, { HslaColor } from "./ColorPicker";
import "./Layer.css";
import { FeatureCollection } from "geojson";
import { Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";

type LayerRenderingType = "fill"|"line"|"circle";

interface LayerData {
  featureCollection: FeatureCollection;
  id: string;
  name: string;
  type: string;
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
  const [layerVisible, setLayerVisible] = useState<boolean>(true);
  const [layerRenderingType, setLayerRenderingType] = useState<LayerRenderingType>("circle");

  // Add layer to map on mount of layer component
  useEffect(()=>{
    if (!mapRef.current?.getSource(layerData.id)) {
      mapRef.current?.addSource(layerData.id, {
        type: "geojson",
        data: layerData.featureCollection,
      });
    }
    if (!mapRef.current?.getLayer(layerData.id)) {
      const renderingType = 
        layerData.type === "Polygon" || layerData.type === "MultiPolygon" ? "fill" : 
        layerData.type === "LineString" || layerData.type === "MultiLineString" ? "line" : 
        layerData.type === "Point" || layerData.type === "MultiPoint" ? "circle" : 
        "circle";
      mapRef.current?.addLayer({
        id: layerData.id,
        type: renderingType,
        source: layerData.id,
        paint: 
          renderingType === "fill" ? {
            "fill-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
            "fill-opacity": layerColor.a,
          } :
          renderingType === "line" ? {
            "line-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
            "line-opacity": layerColor.a,
            "line-width": 2,
          } :
          renderingType === "circle" ? {
            "circle-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
            "circle-opacity": layerColor.a,
            "circle-radius": 5,
          } :
          {},
      });
      setLayerRenderingType(renderingType); // async so cant use it in addLayer
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

  const handleToggleVisibility = () => {
    setLayerVisible(!layerVisible);
    mapRef.current?.setLayoutProperty(layerData.id, "visibility", layerVisible ? "none" : "visible");
  };
  
  const handleChangeColor = (color: HslaColor) => {
    setLayerColor(color);
    if (layerRenderingType === "fill") {
      mapRef.current?.setPaintProperty(layerData.id, "fill-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
      mapRef.current?.setPaintProperty(layerData.id, "fill-opacity", color.a);
    } else if (layerRenderingType === "line") {
      mapRef.current?.setPaintProperty(layerData.id, "line-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
      mapRef.current?.setPaintProperty(layerData.id, "line-opacity", color.a);
    } else if (layerRenderingType === "circle") {
      mapRef.current?.setPaintProperty(layerData.id, "circle-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
      mapRef.current?.setPaintProperty(layerData.id, "circle-opacity", color.a);
    };
  }

  return (
    <li className="layerListItem">
      <div className="layerItem">
        <ColorPicker 
          color={layerColor}
          onChange={handleChangeColor}
        />
        <div className="layerName">
          {layerName}
        </div>
        <button type="button" onClick={handleLayerUp}>
          <ChevronUp />
        </button>
        <button type="button" onClick={handleLayerDown}>
          <ChevronDown />
        </button>
        <button type="button" onClick={()=>handleToggleVisibility()}>
          {layerVisible ? <Eye /> : <EyeOff />}
        </button>
      </div> 
    </li>
  );
}

export default Layer;
export type { LayerData };