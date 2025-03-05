import { useState, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import MapContainer from './components/MapContainer'
import Layer, { LayerRenderingType } from './components/Layer';
import { FeatureCollection } from 'geojson';
import { buffer } from '@turf/buffer';
import { Eye, EyeOff, Upload } from 'lucide-react';
import useLayerStore from './hooks/useLayerStore';

function App() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { 
    layers, 
    addLayer,  
    toggleLayerVisibilityAll 
  } = useLayerStore();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    setTimeout(() => {
      mapRef.current?.resize();
    }, 1);
    setTimeout(() => { // just in case
      mapRef.current?.resize();
    }, 100);
  };

  const makeUniqueFileId = (id: string): string => {
    if (layers.some(layer => layer.id === id)) {
      return makeUniqueFileId(id + "1");
    } else {
      return id;
    };
  };

  const handleLoadDataLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      console.log("no file selected");
      return;
    }
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const geojson = JSON.parse(e.target?.result as string) as FeatureCollection;
          if (geojson.type !== "FeatureCollection") {
            throw new Error("Not a valid GeoJSON file, must be a FeatureCollection");
          }

          const t = geojson.features[0].geometry.type;
          const renderingType: LayerRenderingType | null = 
            t === "Polygon" || t === "MultiPolygon" ? "fill" :
            t === "LineString" || t === "MultiLineString" ? "line" :
            t === "Point" || t === "MultiPoint" ? "circle" :
            null;
          if (!renderingType) {
            throw new Error("Unsupported geometry type: " + t);
          }

          addLayer({ // "functional update" ensures that newest state is used in setLayers (because of async)
            featureCollection: geojson,
            id: makeUniqueFileId(file.name),
            name: file.name,
            renderingType: renderingType,
            visible: true,
          });

        } catch (error) {
          console.log(error);
        }
      }
      reader.readAsText(file);
    });
  };

  

  const handleToolBuffer = () => {
    const inLayer = layers[0];
    const bufferLayer = buffer(inLayer.featureCollection, 0.05);
    if (bufferLayer) {
      addLayer({
        featureCollection: bufferLayer,
        id: makeUniqueFileId(inLayer.id + "_buffer"),
        name: inLayer.name + "_buffer",
        renderingType: "fill",
        visible: true,
      });
    } else {
      console.error("Buffer operation failed");
    }
  }

  return (
    <div className="pageContainer">
      <header className="mainHeader">
        <h1>
          μGIS
        </h1>
        <button type="button" onClick={handleSidebarToggle}>Sidebar</button>
        <button type="button" onClick={handleToolBuffer}>Buffer</button>
      </header>
      <main className="mainContainer">
        <div className={`sidebarContainer ${sidebarOpen ? "open" : ""}`}>
          <aside className="sidebar">
            <h2>Sidebar</h2>
            <button type="button" onClick={toggleLayerVisibilityAll}>
              {layers.every(layer => layer.visible) ? <Eye /> : <EyeOff />}
            </button>
            <ol className="layerList">
              {layers.map((layer, index) => (
                <Layer 
                  key={layer.id} 
                  mapRef={mapRef} 
                  layerData={layer} 
                  layerAboveId={index === 0 ? undefined : layers[index-1].id}
                />
              ))}
            </ol>
            <div className="sidebarFooter">
              <label htmlFor="layerFileInput">
                <Upload />
                Upload GeoJSON file
              </label>
              <input id="layerFileInput" type="file" multiple accept=".geojson" onChange={handleLoadDataLayer} />
            </div>
          </aside>
        </div>
        <div className="mapFlexContainer">
          <MapContainer mapRef={mapRef} />
        </div>
      </main>
    </div>
  );
};

export default App
