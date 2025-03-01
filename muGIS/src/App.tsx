import { useState, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import 'mapbox-gl'

import MapContainer from './components/MapContainer'
import Layer, { LayerData, LayerRenderingType } from './components/Layer';
import { FeatureCollection } from 'geojson';
import { buffer } from '@turf/buffer';

function App() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [layers, setLayers] = useState<LayerData[]>([]);

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

          setLayers(layers => [...layers, { // "functional update" ensures that newest state is used in setLayers (because of async)
            featureCollection: geojson,
            id: makeUniqueFileId(file.name),
            name: file.name,
            renderingType: renderingType,
          }]);

        } catch (error) {
          console.log(error);
        }
      }
      reader.readAsText(file);
    });
  };

  const moveLayerUp = (id: string) => {
    setLayers(layers => {
      const index = layers.findIndex(layer => layer.id === id);
      if (index === 0) {return layers;} // already at top
      const newLayers = [...layers];
      newLayers.splice(index-1, 0, newLayers.splice(index, 1)[0]); // move layer up
      return newLayers;
    })
  }

  const moveLayerDown = (id: string) => {
    setLayers(layers => {
      const index = layers.findIndex(layer => layer.id === id);
      if (index === layers.length - 1) {return layers;} // already at bottom
      const newLayers = [...layers];
      newLayers.splice(index+1, 0, newLayers.splice(index, 1)[0]); // move layer down
      return newLayers;
    })
  }

  const deleteLayer = (id: string) => {
    setLayers(layers => layers.filter(layer => layer.id !== id));
  }

  const handleToolBuffer = () => {
    const inLayer = layers[0];
    const bufferLayer = buffer(inLayer.featureCollection, 0.05);
    if (bufferLayer) {
      setLayers(layers => [...layers, {
        featureCollection: bufferLayer,
        id: makeUniqueFileId(inLayer.id + "_buffer"),
        name: inLayer.name + "_buffer",
        renderingType: "fill",
      }]);
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
            <ol className="layerList">
              {layers.map((layer, index) => (
                <Layer 
                  key={layer.id} 
                  mapRef={mapRef} 
                  layerData={layer} 
                  handleLayerUp={()=>moveLayerUp(layer.id)} 
                  handleLayerDown={()=>moveLayerDown(layer.id)} 
                  layerAboveId={index === 0 ? undefined : layers[index-1].id}
                  handleDeleteLayer={()=>deleteLayer(layer.id)}
                />
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
