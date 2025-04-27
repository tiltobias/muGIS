import { FC, useState, useEffect, useRef } from 'react';
import ColorPicker, { HslaColor } from './ColorPicker';
import './Layer.css';
import { Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Ellipsis, FileDown, ZoomIn, PencilLine, PencilOff } from 'lucide-react';
import useClickOutside from '../../hooks/useClickOutside';
import { bbox } from '@turf/bbox';
import useLayerStore, { LayerData } from '../../hooks/useLayerStore';
import useMapStore from '../../hooks/useMapStore';
import LayerName from './LayerName';

interface LayerProps {
  layerData: LayerData;
  layerAboveId: string | undefined;
}

const Layer:FC<LayerProps> = ({layerData, layerAboveId}) => {
  
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const layerMenu = useRef<HTMLDivElement>(null);
  useClickOutside(layerMenu, ()=>{setMenuOpen(false)});
  const { 
    moveLayerUp, 
    moveLayerDown, 
    deleteLayer, 
    toggleLayerVisibility, 
    changeLayerColor,
  } = useLayerStore();
  const { 
    mapRef 
  } = useMapStore();
  

  // Add layer to map on mount of layer component (Runs only on mount/component creation)
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
            "fill-color": `hsl(${layerData.color.h},${layerData.color.s}%,${layerData.color.l}%)`,
            "fill-opacity": layerData.color.a,
          } :
          layerData.renderingType === "line" ? {
            "line-color": `hsl(${layerData.color.h},${layerData.color.s}%,${layerData.color.l}%)`,
            "line-opacity": layerData.color.a,
            "line-width": 2,
          } :
          layerData.renderingType === "circle" ? {
            "circle-color": `hsl(${layerData.color.h},${layerData.color.s}%,${layerData.color.l}%)`,
            "circle-opacity": layerData.color.a,
            "circle-radius": 5,
          } :
          {},
      });
    }
  },[mapRef, layerData]);

  // Always keep layer under layerAboveId (Runs on layerAboveId change)
  useEffect(()=>{
    mapRef.current?.moveLayer(layerData.id, layerAboveId);
  },[layerAboveId, layerData.id, mapRef, layerData.updater]);

  // Update layer visibility (Runs on layerData.visible change)
  useEffect(()=>{
    mapRef.current?.setLayoutProperty(layerData.id, "visibility", layerData.visible ? "visible" : "none");
  },[layerData.visible, mapRef, layerData.id, layerData.updater]);
  
  const handleChangeColor = (color: HslaColor) => {
    changeLayerColor(layerData.id, color);
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

  const handleDeleteLayer = () => {
    mapRef.current?.removeLayer(layerData.id);
    mapRef.current?.removeSource(layerData.id);
    deleteLayer(layerData.id)
  }

  const handleDownloadLayer = () => {
    const blob = new Blob([JSON.stringify(layerData.featureCollection)], {type: "application/geo+json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = layerData.name + ".geojson";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleZoomToLayer = () => {
    const bounds = bbox(layerData.featureCollection).slice(0, 4) as [number, number, number, number];
    mapRef.current?.fitBounds(bounds, {padding: 20});
  }

  const [layerNameEditing, setLayerNameEditing] = useState<boolean>(false);

  return (
    <li className="layerListItem">
      <div className="layerItem">
        <ColorPicker 
          color={layerData.color}
          onChange={handleChangeColor}
        />
        <LayerName 
          layerId={layerData.id}
          initialLayerName={layerData.name}
          isEditing={layerNameEditing}
          setIsEditing={setLayerNameEditing}
        />
        <div className="layerMenu" ref={layerMenu}>
          <button type="button" onClick={()=>{setMenuOpen(!menuOpen)}}>
            <Ellipsis />
          </button>
          {menuOpen && (
            <div className="layerMenuPopover">
              <ul>
                <li>
                  <button type="button" onClick={handleDeleteLayer}>
                    <Trash2 /> Delete layer
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleDownloadLayer}>
                    <FileDown /> Download layer
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleZoomToLayer}>
                    <ZoomIn /> Zoom to layer
                  </button>
                </li>
                <li>
                  <button type="button" onClick={(e)=>{
                    e.stopPropagation(); // Prevent useClickOutside from setting isEditing to false.
                    setLayerNameEditing(!layerNameEditing);
                  }}>
                    {!layerNameEditing ? <PencilLine /> : <PencilOff />} Edit layer name
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