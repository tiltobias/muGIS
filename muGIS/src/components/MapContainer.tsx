import { FC, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapContainer.css';
import useMapStore, { Basemap } from '../hooks/useMapStore';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import useLayerStore from '../hooks/useLayerStore';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapContainerProps {
  test?: string;
}

const MapContainer:FC<MapContainerProps> = () => {

  const { 
    mapRef,
    mapReady,
    setMapReady, 
    basemap,
  } = useMapStore();
  
  const { 
    addLayer,
    updateAllLayers,
  } = useLayerStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize map on mount of map component (Runs only on mount/component creation)
  useEffect(() => {
    if (!mapReady && mapContainerRef.current) {
      mapContainerRef.current.innerHTML = ""; // remove old controls and such

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current, // should be stable, if not use Id and remove from if statement
        style: basemap.url, // style URL
        center: [10.4, 63.425], // starting position [lng, lat]
        zoom: 12, // starting zoom
        // attributionControl: false,
        // projection: "mercator",
      });
      mapRef.current?.addControl(new mapboxgl.FullscreenControl(), "top-right"); // Add fullscreen button
      mapRef.current?.addControl(new mapboxgl.NavigationControl({visualizePitch:true}), "top-right"); // Add compass and zoom buttons
      mapRef.current?.addControl(new mapboxgl.ScaleControl(), "bottom-right"); // Add scale bar
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: true,
          line_string: true,
          polygon: true,
          // trash: true
        },
        boxSelect: false,
      });
      mapRef.current?.addControl(draw as mapboxgl.IControl, "bottom-left");
      mapRef.current?.on('draw.create', () => {
        addLayer({
          featureCollection: draw.getAll(),
          name: null,
        });
        draw.deleteAll();
      });

      mapRef.current?.on("style.load", () => {
        setMapReady(true);
      });
    };
  }, [mapRef, addLayer, mapReady, setMapReady, basemap]);

  // Set basemap on state change, with cooldown to prevent change while layers are loading
  const [basemapCooldown, setBasemapCooldown] = useState<boolean>(false);
  const queuedBasemap = useRef<Basemap>(basemap); // If basemap changes while cooldown is active, save it here
  const [currentBasemap, setCurrentBasemap] = useState<Basemap>(basemap); // Don't update if basemap is the same (prevents infinite loop)
  useEffect(() => {
    if (queuedBasemap.current.url !== basemap.url) {
      queuedBasemap.current = basemap;
    };
    if (!basemapCooldown && currentBasemap.url !== queuedBasemap.current.url) {
      setBasemapCooldown(true);
      if (mapReady && mapRef.current) {
        mapRef.current.setStyle(queuedBasemap.current.url);
        setCurrentBasemap(basemap);
      };
      mapRef.current?.once("style.load", () => {
        updateAllLayers();
      });
      setTimeout(() => {
        setBasemapCooldown(false);
      }, 200); // Cooldown time in ms
    };
  }, [basemap, mapRef, mapReady, basemapCooldown, currentBasemap, updateAllLayers]);


  return (
    <div ref={mapContainerRef} className="mapContainer"></div>
  );
}

export default MapContainer;