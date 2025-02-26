import { FC, useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapContainer.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapContainerProps {
  test?: string;
  mapRef: RefObject<mapboxgl.Map | null>;
}

const MapContainer:FC<MapContainerProps> = ({mapRef}) => {

  
  useEffect(() => {
    if (!mapRef.current) { // dont reinitialize the map if it already exists
      mapRef.current = new mapboxgl.Map({
        container: 'mapContainer', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [10.4, 63.425], // starting position [lng, lat]
        zoom: 12, // starting zoom
        // attributionControl: false,
      });
      mapRef.current?.addControl(new mapboxgl.FullscreenControl(), "top-right"); // Add fullscreen button
      mapRef.current?.addControl(new mapboxgl.NavigationControl({visualizePitch:true}), "top-right"); // Add compass and zoom buttons
      mapRef.current?.addControl(new mapboxgl.ScaleControl(), "bottom-right"); // Add scale bar
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="mapContainer" className="mapContainer"></div>
  );
}

export default MapContainer;