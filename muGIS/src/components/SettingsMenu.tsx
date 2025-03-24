import { FC, useState, useRef } from 'react';
import "./SettingsMenu.css";
import useClickOutside from '../hooks/useClickOutside';
import { Settings, File, Save, FolderOpen, Map, GraduationCap } from 'lucide-react';

interface SettingsMenuProps {
  test?: string;
}

const SettingsMenu:FC<SettingsMenuProps> = () => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const settingsContainer = useRef<HTMLDivElement>(null);
  useClickOutside(settingsContainer, ()=>{setSettingsOpen(false)});



  return (
    <div className="settings" ref={settingsContainer}>
      <button type="button" onClick={()=>{setSettingsOpen(!settingsOpen)}}>
        <Settings />
      </button>
      {settingsOpen && (
        <div className="settingsPopover">
          <ul>
            <li>
              <button type="button" onClick={()=>{}}>
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