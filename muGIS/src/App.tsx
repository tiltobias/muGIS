import { useState, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import MapContainer from './components/MapContainer'
import Layer from './components/Layer';
import { FeatureCollection } from 'geojson';
import { buffer } from '@turf/buffer';
import { Eye, EyeOff, Upload, Settings } from 'lucide-react';
import useLayerStore from './hooks/useLayerStore';
import useMapStore from './hooks/useMapStore';
import useClickOutside from './hooks/useClickOutside';

function App() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const settingsContainer = useRef<HTMLDivElement>(null);
  useClickOutside(settingsContainer, ()=>{setSettingsOpen(false)});

  const { 
    layers, 
    addLayer,  
    toggleLayerVisibilityAll 
  } = useLayerStore();
  const {
    mapRef
  } = useMapStore();
  

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    setTimeout(() => {
      mapRef.current?.resize();
    }, 1);
    setTimeout(() => { // just in case
      mapRef.current?.resize();
    }, 100);
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

  

  const handleToolBuffer = () => {
    const inLayer = layers[0];
    const bufferLayer = buffer(inLayer.featureCollection, 0.05);
    if (bufferLayer) {
      addLayer({
        featureCollection: bufferLayer,
        name: inLayer.name + "_buffer",
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
        
        <div className="settings" ref={settingsContainer}>
          <button type="button" onClick={()=>{setSettingsOpen(!settingsOpen)}}>
            <Settings />
          </button>
          {settingsOpen && (
            <div className="settingsPopover">
              <ul>
                <li>
                  <button type="button" onClick={()=>{}}>
                    Restart project
                  </button>
                </li>
                <li>
                  <button type="button" onClick={()=>{}}>
                    Change basemap
                  </button>
                </li>
                <li>
                  <button type="button" onClick={()=>{}}>
                    Start tutorial
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
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
          <MapContainer />
        </div>
      </main>
    </div>
  );
};

export default App
