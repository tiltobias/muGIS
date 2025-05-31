import { FC, useState, useEffect, useRef } from 'react';
import ResizeHandle from './ResizeHandle';
import LayerList from './layer/LayerList';
import useLayerStore from '../../hooks/useLayerStore';
import { Eye, EyeOff, Upload } from 'lucide-react';
import useMapStore from '../../hooks/useMapStore';
import './Sidebar.css';
import AttributeTable from '../tool/table/AttributeTable';

interface SidebarProps {
  handleLoadFileInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: FC<SidebarProps> = ({ handleLoadFileInput }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const { 
    layers, 
    toggleLayerVisibilityAll,
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
    }, 1); // time of sidebarContainer transition
  }, [mapRef, sidebarOpen]);


  const fileInput = useRef<HTMLInputElement>(null);
  const handleUploadFile = () => {
    if (fileInput.current) fileInput.current.click();
  }

  return (
    <div className={`sidebarContainer ${sidebarOpen ? "open" : ""}`}>
      <ResizeHandle setWidth={setSidebarWidth} setOpen={setSidebarOpen} />
      <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
        <div className="sidebarHeader">
          <h2>Layers</h2>
          <div className="sidebarHeaderActions">
            <AttributeTable />
            <button type="button" onClick={toggleLayerVisibilityAll}>
              {layers.every(layer => layer.visible) ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>
        <div className="layerListContainer">
          {mapReady && (
            <LayerList />
          )}
        </div>
        <div className="sidebarFooter">
          <button type="button" onClick={handleUploadFile}>
            <Upload /> Upload GeoJSON file
          </button>
          <input ref={fileInput} type="file" multiple accept=".geojson" onChange={handleLoadFileInput} />
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;