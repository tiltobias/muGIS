import { FC, useState, useRef } from 'react';
 import "./BasemapMenu.css";
 import useClickOutside from '../hooks/useClickOutside';
 import { Map } from 'lucide-react';
 import useMapStore, { Basemap } from '../hooks/useMapStore';
 
 interface BasemapMenuProps {
   test?: string;
 }
 
 const BasemapMenu:FC<BasemapMenuProps> = () => {
   const [basemapOpen, setBasemapOpen] = useState<boolean>(false);
   const basemapContainer = useRef<HTMLDivElement>(null);
   useClickOutside(basemapContainer, ()=>{setBasemapOpen(false)});
   const [savedBasemap, setSavedBasemap] = useState<Basemap | null>(null);
 
   const {
    basemap,
    setBasemap,
   } = useMapStore();
 
   const basemaps: Basemap[] = [
    //  { // this one is slightly buggy for some reason
    //    url: "mapbox://styles/mapbox/standard",
    //    name: "Standard",
    //  },
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
    //  {
    //   url: "mapbox://styles/tobiand/cm8rb3aur00bo01sh8ifqccos",
    //   name: "μGIS test",
    //  },
    //  {
    //   url: "mapbox://styles/tobiand/cm8rbbblx00bp01sh42j77jz0",
    //   name: "μGIS blank",
    //  },
     {
      url: "mapbox://styles/tobiand/cm8rbg7j900be01sa5wc6d4lq",
      name: "Off (white)",
     },
     {
      url: "mapbox://styles/tobiand/cm8rbd89l00az01sb97a8hfyh",
      name: "Off (black)",
     },
   ];
   
 
   return (
     <div className="basemap" ref={basemapContainer}>
       <button type="button" onClick={()=>setBasemapOpen(!basemapOpen)}>
         <Map /> Change basemap
       </button>
       {basemapOpen && (
         <div className="basemapPopover">
           <ul 
            onMouseEnter={()=>{
              setSavedBasemap(basemap)
            }}
            onMouseLeave={()=>{
              setBasemap(savedBasemap as Basemap);
              setSavedBasemap(null);
            }}
          >
             {basemaps.map((basemapOption) => (
               <li key={basemapOption.name}>
                 <button type="button" 
                  onClick={()=>{
                    setSavedBasemap(basemapOption);
                  }}
                  onMouseEnter={()=>{
                    setBasemap(basemapOption);
                  }}
                 >
                   {(savedBasemap===null && basemapOption.name===basemap.name) || (savedBasemap!==null && basemapOption.name===savedBasemap.name) ? "*" : ""}{basemapOption.name}
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