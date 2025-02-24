import { useState, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import 'mapbox-gl'

import MapContainer from './components/MapContainer'
import Layer from './components/Layer';

interface Layer {
  source: string;
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

  const handleLoadDataLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (!file) {
      console.log("no file selected");
      return;
    }

    mapRef.current?.addSource("source-"+file.name, {
      type: "geojson",
      data: URL.createObjectURL(file),
    });

    setLayers([...layers, {
      source: "source-"+file.name,
      id: "layer-"+file.name,
      name: file.name,
    }]);
  };

  return (
    <div className="pageContainer">
      <header className="mainHeader">
        <h1>
          μGIS
        </h1>
        <button onClick={handleSidebarToggle}>Sidebar</button>
        <input type="file" accept=".geojson,.json" onChange={handleLoadDataLayer} />
      </header>
      <main className="mainContainer">
        <div className={`sidebarContainer ${sidebarOpen ? "open" : ""}`}>
          <aside className="sidebar">
            <h2>Sidebar</h2>
            <ol>
              {layers.map((layer) => (
                <Layer key={layer.id} mapRef={mapRef} source={layer.source} id={layer.id} name={layer.name} />
              ))}
            </ol>
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
