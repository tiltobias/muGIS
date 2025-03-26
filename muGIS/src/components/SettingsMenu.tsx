import { FC, useState, useRef } from 'react';
import "./SettingsMenu.css";
import useClickOutside from '../hooks/useClickOutside';
import { Settings, File, Save, FolderOpen, GraduationCap } from 'lucide-react';
import useLayerStore, { LayerData } from '../hooks/useLayerStore';
import useMapStore from '../hooks/useMapStore';
import BasemapMenu from './BasemapMenu';

interface SettingsMenuProps {
  test?: string;
}

const SettingsMenu:FC<SettingsMenuProps> = () => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const settingsContainer = useRef<HTMLDivElement>(null);
  useClickOutside(settingsContainer, ()=>{setSettingsOpen(false)});

  const {
    layers,
    resetLayerStore,
    loadProjectLayers,
  } = useLayerStore();
  const {
    resetMapStore,
  } = useMapStore();

  const handleResetProject = () => {
    resetLayerStore();
    resetMapStore();
  }

  const handleDownloadProject = () => {
    const blob = new Blob([JSON.stringify(layers)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "μGIS_project.mugis";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const projectFileInput = useRef<HTMLInputElement>(null);
  const handleUploadProject = () => {
    projectFileInput.current?.click();
  }
  const loadProjectFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      console.log("no file selected");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedLayers = JSON.parse(e.target?.result as string) as LayerData[];
        loadProjectLayers(loadedLayers);
      } catch (error) {
        console.log(error);
      }
    }
    handleResetProject(); // clear current project to reset map
    reader.readAsText(files[0]);
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
              <button type="button" onClick={handleDownloadProject}>
                <Save /> Save project
              </button>
            </li>
            <li>
              <input ref={projectFileInput} type="file" accept=".mugis" onChange={loadProjectFromFile} />
              <button type="button" onClick={handleUploadProject}>
                <FolderOpen /> Load project
              </button>
            </li>
            <li>
              <BasemapMenu />
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