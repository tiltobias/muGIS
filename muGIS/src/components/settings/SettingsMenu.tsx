import { FC, useState, useRef, useEffect } from 'react';
import './SettingsMenu.css';
import useClickOutside from '../../hooks/useClickOutside';
import { Settings, File, Save, FolderOpen, GraduationCap, Sun, Moon } from 'lucide-react';
import useLayerStore, { LayerData } from '../../hooks/useLayerStore';
import useMapStore, { Basemap } from '../../hooks/useMapStore';
import BasemapMenu from './BasemapMenu';
import useThemeStore from '../../hooks/useThemeStore';

interface MugisFile {
  layers: LayerData[];
  basemap: Basemap;
}

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
    basemap,
    setBasemap,
    resetMapStore,
  } = useMapStore();
  const {
    theme,
    setTheme,
  } = useThemeStore();

  const handleResetProject = () => {
    resetLayerStore();
    resetMapStore();
  }

  const handleDownloadProject = () => {
    const mugisFile: MugisFile = {
      layers: layers,
      basemap: basemap,
    };
    const blob = new Blob([JSON.stringify(mugisFile)], {type: "application/json"});
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
        // const loadedLayers = JSON.parse(e.target?.result as string) as LayerData[]; // saved in case reading old file format
        // loadProjectLayers(loadedLayers);
        const mugisFile = JSON.parse(e.target?.result as string) as MugisFile;
        loadProjectLayers(mugisFile.layers);
        setBasemap(mugisFile.basemap);
      } catch (error) {
        console.log(error);
      }
    }
    reader.readAsText(files[0]);
  }

  // Update css variables on theme change
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])

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
              <button type="button" onClick={()=>{setTheme(theme === "light" ? "dark" : "light")}}>
                {theme === "light" ? <Sun /> : <Moon />} Toggle theme
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