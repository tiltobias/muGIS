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

  return (
    <div className="pageContainer">
      <header className="mainHeader">
        μGIS
        <button onClick={handleSidebarToggle}>BUTTON</button>
      </header>
      <main className="mainContainer">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        </aside>
        <div className="mapFlexContainer">
          <MapContainer mapRef={mapRef} />
        </div>
      </main>
    </div>
  )
}

export default App
