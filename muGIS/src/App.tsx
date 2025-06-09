import './App.css'
import MapContainer from './components/MapContainer'
import { FeatureCollection } from 'geojson';
import useLayerStore from './hooks/useLayerStore';
import SettingsMenu from './components/settings/SettingsMenu';
import Toolbar from './components/Toolbar';
import Sidebar from './components/sidebar/Sidebar';

function App() {

  const { 
    addLayer, 
  } = useLayerStore();


  const loadFiles = (files: FileList | null) => {
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
          alert("Error loading file: " + file.name + "\n" + (error instanceof Error ? error.message : String(error)));
        }
      }
      reader.readAsText(file);
    });
  };

  const handleLoadFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadFiles(e.target.files);
    e.target.value = ""; // reset input value to allow re-uploading the same file
  };

  const handleLoadFileDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
  };


  return (
    <div 
      className="pageContainer"
      onDragOver={(e)=>e.preventDefault()} // allow dropping files
      onDrop={handleLoadFileDrag}
    >
      <header className="mainHeader">

        <div className="logo">
          <a href="https://github.com/tiltobias/muGIS/" target="_blank" rel="noopener noreferrer">
            <img src="muGIS_banner.svg" alt="muGIS logo" />
          </a>
        </div>

        <Toolbar />
        
        <SettingsMenu />
      </header>
      <main className="mainContainer">
        <Sidebar 
          handleLoadFileInput={handleLoadFileInput}
        />
        <div className="mapFlexContainer">
          <MapContainer />
        </div>
      </main>
    </div>
  );
};

export default App
