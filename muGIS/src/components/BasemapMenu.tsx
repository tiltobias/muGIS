import { FC, useState, useRef } from 'react';
import "./BasemapMenu.css";
import useClickOutside from '../hooks/useClickOutside';
import { Map } from 'lucide-react';
import useLayerStore, { Basemap } from '../hooks/useLayerStore';

interface BasemapMenuProps {
  test?: string;
}

const BasemapMenu:FC<BasemapMenuProps> = () => {
  const [basemapOpen, setBasemapOpen] = useState<boolean>(false);
  const basemapContainer = useRef<HTMLDivElement>(null);
  useClickOutside(basemapContainer, ()=>{setBasemapOpen(false)});

  const {
    // mapRef,
    basemap,
    setBasemap,
  } = useLayerStore();

  const basemaps: Basemap[] = [
    {
      url: "mapbox://styles/mapbox/standard",
      name: "Standard",
    },
    {
      url: "mapbox://styles/mapbox/streets-v12",
      name: "Streets",
    },
    {
      url: "mapbox://styles/mapbox/outdoors-v12",
      name: "Outdoors",
    },
    {
      url: "mapbox://styles/mapbox/light-v11",
      name: "Light",
    },
    {
      url: "mapbox://styles/mapbox/dark-v11",
      name: "Dark",
    },
    {
      url: "mapbox://styles/mapbox/satellite-v9",
      name: "Satellite",
    },
    {
      url: "mapbox://styles/mapbox/satellite-streets-v12",
      name: "Satellite Streets",
    },
    {
      url: "mapbox://styles/mapbox/navigation-day-v1",
      name: "Navigation Day",
    },
    {
      url: "mapbox://styles/mapbox/navigation-night-v1",
      name: "Navigation Night",
    },
  ];
  

  return (
    <div className="basemap" ref={basemapContainer}>
      <button type="button" onClick={()=>setBasemapOpen(!basemapOpen)}>
        <Map /> Change basemap
      </button>
      {basemapOpen && (
        <div className="basemapPopover">
          <ul>
            {basemaps.map((basemapOption) => (
              <li key={basemapOption.name}>
                <button type="button" onClick={()=>{
                  setBasemap(basemapOption);
                }}
                // onMouseEnter={()=>{
                //   mapRef.current?.setStyle(basemapOption.url);
                // }}
                // onMouseLeave={()=>{
                //   mapRef.current?.setStyle(basemap.url);
                // }}
                >
                  {basemapOption.name===basemap.name ? "*" : ""}{basemapOption.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default BasemapMenu;