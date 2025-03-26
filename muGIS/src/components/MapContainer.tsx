import { FC, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapContainer.css';
// import useMapStore from '../hooks/useMapStore';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import useLayerStore from '../hooks/useLayerStore';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapContainerProps {
  test?: string;
}

const MapContainer:FC<MapContainerProps> = () => {

  // const { 
  //   mapRef,
  //   mapReady,
  //   setMapReady,
  //   basemap,
  // } = useMapStore();
  
  const {
    mapRef,
    mapReady,
    setMapReady,
    basemap,
    addLayer,
    renderAllLayers,
  } = useLayerStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize map on mount of map component (Runs only on mount/component creation)
  useEffect(() => {
    if (!mapReady && mapContainerRef.current) {
      mapContainerRef.current.innerHTML = ""; // remove old controls and such

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current, // should be stable, if not use Id and remove from if statement
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [10.4, 63.425], // starting position [lng, lat]
        zoom: 12, // starting zoom
        // attributionControl: false,
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
  }, [mapRef, addLayer, mapReady, setMapReady]);

  // Set basemap on change
  useEffect(() => {
    if (mapReady && mapRef.current) {
      mapRef.current.setStyle(basemap.url);
    }
    mapRef.current?.once("style.load", () => {
      renderAllLayers();
      // toggleLayerVisibilityAll();
      // setTimeout(() => {
      //   toggleLayerVisibilityAll();
      // }, 1);
    }
    );
  }, [basemap, mapRef, renderAllLayers, mapReady]);

  return (
    <div ref={mapContainerRef} className="mapContainer"></div>
  );
}

export default MapContainer;