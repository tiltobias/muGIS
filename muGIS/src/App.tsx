import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import MapContainer from './components/MapContainer'
import Layer from './components/layer/Layer';
import { FeatureCollection } from 'geojson';
import { Eye, EyeOff, Upload } from 'lucide-react';
import useLayerStore from './hooks/useLayerStore';
import useMapStore from './hooks/useMapStore';
import SettingsMenu from './components/settings/SettingsMenu';
import Toolbar from './components/Toolbar';
import ResizeHandle from './components/ResizeHandle';

function App() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const { 
    layers, 
    addLayer,  
    toggleLayerVisibilityAll 
  } = useLayerStore();
  const {
    mapRef,
    mapReady,
  } = useMapStore();
  
  // Resize map smoothly when sidebar is opened or closed
  useEffect(() => {
    const interval = setInterval(() => {
      mapRef.current?.resize();
    }, 1);
    setTimeout(() => {
      clearInterval(interval);
    }, 301); // time of sidebarContainer transition
  }, [mapRef, sidebarOpen]);


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
          addLayer({
            featureCollection: geojson,
            name: file.name,
          });
        } catch (error) {
          console.log(error);
        }
      }
      reader.readAsText(file);
    });
  };


  return (
    <div className="pageContainer">
      <header className="mainHeader">
        <h1>
          μGIS
        </h1>
        <button type="button" onClick={()=>setSidebarOpen(!sidebarOpen)}>Sidebar</button>
        <Toolbar />
        
        <SettingsMenu />
      </header>
      <main className="mainContainer">
        <div className={`sidebarContainer ${sidebarOpen ? "open" : ""}`}>
          <ResizeHandle setWidth={setSidebarWidth} setOpen={setSidebarOpen} />
          <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
            <h2>Sidebar</h2>
            <button type="button" onClick={toggleLayerVisibilityAll}>
              {layers.every(layer => layer.visible) ? <Eye /> : <EyeOff />}
            </button>
            <div className="layerListContainer">
              {mapReady && (
                <ol className="layerList">
                  {layers.map((layer, index) => (
                    <Layer 
                      key={layer.id} 
                      layerData={layer} 
                      layerAboveId={index === 0 ? undefined : layers[index-1].id}
                    />
                  ))}
                </ol>
              )}
            </div>
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
          <MapContainer />
        </div>
      </main>
    </div>
  );
};

export default App
