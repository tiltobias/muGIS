import { useState, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import 'mapbox-gl'

import MapContainer from './components/MapContainer'
import Layer from './components/Layer';

interface Layer {
  file: File;
  id: string;
  name: string;
}

function App() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);

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
      setLayers(layers => [...layers, { // "functional update" ensures that newest state is used in setLayers (because of async)
        file: file,
        id: makeUniqueFileId(file.name),
        name: file.name,
      }]);
    });
  };

  return (
    <div className="pageContainer">
      <header className="mainHeader">
        <h1>
          μGIS
        </h1>
        <button onClick={handleSidebarToggle}>Sidebar</button>
      </header>
      <main className="mainContainer">
        <div className={`sidebarContainer ${sidebarOpen ? "open" : ""}`}>
          <aside className="sidebar">
            <h2>Sidebar</h2>
            <ol className="layerList">
              {layers.map((layer) => (
                <Layer key={layer.id} mapRef={mapRef} file={layer.file} id={layer.id} name={layer.name} />
              ))}
            </ol>
            <div className="sidebarFooter">
              <label htmlFor="layerFileInput">
                Upload Layer Data
              </label>
              <input id="layerFileInput" type="file" multiple accept=".geojson,.json" onChange={handleLoadDataLayer} />
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
