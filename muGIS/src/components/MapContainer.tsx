import { FC, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapContainer.css';
import useMapStore from '../hooks/useMapStore';
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
  } = useMapStore();
  
  const { 
    addLayer,
  } = useLayerStore();
  
  // Initialize map on mount of map component (Runs only on mount/component creation)
  useEffect(() => {
    if (!mapReady) {
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

      mapRef.current?.on('load', () => {
        setMapReady(true);
      });

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

    };
  }, [mapRef, addLayer, mapReady, setMapReady]);

  return (
    <div id="mapContainer" className="mapContainer"></div>
  );
}

export default MapContainer;