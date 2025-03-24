import { FC, useState, useRef } from 'react';
import "./SettingsMenu.css";
import useClickOutside from '../hooks/useClickOutside';
import { Settings, File, Save, FolderOpen, Map, GraduationCap } from 'lucide-react';
import useLayerStore from '../hooks/useLayerStore';
import useMapStore from '../hooks/useMapStore';

interface SettingsMenuProps {
  test?: string;
}

const SettingsMenu:FC<SettingsMenuProps> = () => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const settingsContainer = useRef<HTMLDivElement>(null);
  useClickOutside(settingsContainer, ()=>{setSettingsOpen(false)});

  const { 
    resetLayerStore,
  } = useLayerStore();
  const {
    setMapReady,
  } = useMapStore();

  const handleResetProject = () => {
    resetLayerStore();
    setMapReady(false);
    // window.location.reload(); // 
  }

  return (
    <div className="settings" ref={settingsContainer}>
      <button type="button" onClick={()=>{setSettingsOpen(!settingsOpen)}}>
        <Settings />
      </button>
      {settingsOpen && (
        <div className="settingsPopover">
          <ul>
            <li>
              <button type="button" onClick={handleResetProject}>
                <File /> New project
              </button>
            </li>
            <li>
              <button type="button" onClick={()=>{}}>
                <Save /> Save project
              </button>
            </li>
            <li>
              <button type="button" onClick={()=>{}}>
                <FolderOpen /> Load project
              </button>
            </li>
            <li>
              <button type="button" onClick={()=>{}}>
                <Map /> Change basemap
              </button>
            </li>
            <li>
              <button type="button" onClick={()=>{}}>
                <GraduationCap /> Start tutorial
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default SettingsMenu;