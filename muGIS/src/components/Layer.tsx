import { FC, RefObject, useState, useEffect, useRef } from 'react';
import ColorPicker, { HslaColor } from "./ColorPicker";
import "./Layer.css";
import { FeatureCollection } from "geojson";
import { Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Ellipsis, FileDown, ZoomIn } from "lucide-react";
import useClickOutside from '../hooks/useClickOutside';
import { bbox } from '@turf/bbox';
import useLayerStore from '../hooks/useLayerStore';

type LayerRenderingType = "fill"|"line"|"circle";

interface LayerData {
  featureCollection: FeatureCollection;
  id: string;
  name: string;
  renderingType: LayerRenderingType;
  visible: boolean;
}

interface LayerProps {
  mapRef: RefObject<mapboxgl.Map | null>;
  layerData: LayerData;
  layerAboveId: string | undefined;
}

const Layer:FC<LayerProps> = ({mapRef, layerData, layerAboveId}) => {
  const [layerName] = useState<string>(layerData.name);
  const [layerColor, setLayerColor] = useState<HslaColor>({
    h: Math.floor(Math.random()*360), 
    s: 90, 
    l: 48, 
    a: layerData.renderingType === "fill" ? 0.7 : 1,
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const layerMenu = useRef<HTMLDivElement>(null);
  useClickOutside(layerMenu, ()=>{setMenuOpen(false)});
  const { 
    moveLayerUp, 
    moveLayerDown, 
    deleteLayer, 
    toggleLayerVisibility, 
  } = useLayerStore();

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
        type: layerData.renderingType,
        source: layerData.id,
        paint: 
          layerData.renderingType === "fill" ? {
            "fill-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
            "fill-opacity": layerColor.a,
          } :
          layerData.renderingType === "line" ? {
            "line-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
            "line-opacity": layerColor.a,
            "line-width": 2,
          } :
          layerData.renderingType === "circle" ? {
            "circle-color": `hsl(${layerColor.h},${layerColor.s}%,${layerColor.l}%)`,
            "circle-opacity": layerColor.a,
            "circle-radius": 5,
          } :
          {},
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

  useEffect(()=>{
    mapRef.current?.setLayoutProperty(layerData.id, "visibility", layerData.visible ? "visible" : "none");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[layerData.visible]);
  
  const handleChangeColor = (color: HslaColor) => {
    setLayerColor(color);
    if (layerData.renderingType === "fill") {
      mapRef.current?.setPaintProperty(layerData.id, "fill-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
      mapRef.current?.setPaintProperty(layerData.id, "fill-opacity", color.a);
    } else if (layerData.renderingType === "line") {
      mapRef.current?.setPaintProperty(layerData.id, "line-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
      mapRef.current?.setPaintProperty(layerData.id, "line-opacity", color.a);
    } else if (layerData.renderingType === "circle") {
      mapRef.current?.setPaintProperty(layerData.id, "circle-color", `hsl(${color.h},${color.s}%,${color.l}%)`);
      mapRef.current?.setPaintProperty(layerData.id, "circle-opacity", color.a);
    };
  }

  const handleDeleteLayer = (id: string) => {
    mapRef.current?.removeLayer(id);
    mapRef.current?.removeSource(id);
    deleteLayer(id)
  }

  const handleDownloadLayer = () => {
    const blob = new Blob([JSON.stringify(layerData.featureCollection)], {type: "application/geo+json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = layerData.id + ".geojson";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleZoomToLayer = () => {
    const bounds = bbox(layerData.featureCollection).slice(0, 4) as [number, number, number, number];
    mapRef.current?.fitBounds(bounds, {padding: 20});
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
        <div className="layerMenu" ref={layerMenu}>
          <button type="button" onClick={()=>{setMenuOpen(!menuOpen)}}>
            <Ellipsis />
          </button>
          {menuOpen && (
            <div className="layerMenuPopover">
              <ul>
                <li>
                  <button type="button" onClick={()=>handleDeleteLayer(layerData.id)}>
                    <Trash2 />
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleDownloadLayer}>
                    <FileDown />
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleZoomToLayer}>
                    <ZoomIn />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="layerMoveControls">
          <button type="button" onClick={()=>moveLayerUp(layerData.id)}>
            <ChevronUp />
          </button>
          <button type="button" onClick={()=>moveLayerDown(layerData.id)}>
            <ChevronDown />
          </button>
        </div>
        <button type="button" onClick={()=>toggleLayerVisibility(layerData.id)}>
          {layerData.visible ? <Eye /> : <EyeOff />}
        </button>
      </div> 
    </li>
  );
}

export default Layer;
export type { LayerData, LayerRenderingType };