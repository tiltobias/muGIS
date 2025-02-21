import { useState, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import 'mapbox-gl'

import MapContainer from './components/MapContainer'


function App() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    setTimeout(() => {
      mapRef.current?.resize();
    }, 1);
    setTimeout(() => { // just in case
      mapRef.current?.resize();
    }, 100);
  }

  const handleLoadDataLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (!file) {
      console.log("no file selected");
      return;
    }

    console.log("Load Data Layer")
    mapRef.current?.addSource("source-vann", {
      type: "geojson",
      // data: "./geodata/vann.geojson",
      data: URL.createObjectURL(file),
    });
    mapRef.current?.addLayer({
      id: "layer-vann",
      type: "fill",
      source: "source-vann",
      paint: {
        "fill-color": "#00ff00",
        "fill-opacity": 0.5,
      },
    });
  }

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
            
          </aside>
        </div>
        <div className="mapFlexContainer">
          <MapContainer mapRef={mapRef} />
        </div>
      </main>
    </div>
  )
}

export default App
