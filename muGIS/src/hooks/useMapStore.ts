import { create } from 'zustand';
import { createRef } from 'react';

interface Basemap {
    url: string;
    name: string;
}

interface MapStore {
    mapRef: React.RefObject<mapboxgl.Map | null>;
    setMapRef: (newMapRef: React.RefObject<mapboxgl.Map | null>) => void;
    mapReady: boolean;
    setMapReady: (ready: boolean) => void;
    basemap: Basemap;
    setBasemap: (newBasemap: Basemap) => void;
    resetMapStore: () => void;
}

const useMapStore = create<MapStore>((set) => ({
    mapRef: createRef(),

    setMapRef: (newMapRef: React.RefObject<mapboxgl.Map | null>) => set({ mapRef: newMapRef }),

    mapReady: false,

    setMapReady: (ready: boolean) => set({ mapReady: ready }),

    basemap: {
        url: "mapbox://styles/mapbox/streets-v12",
        name: "Streets",
    },

    setBasemap: (newBasemap: Basemap) => set((state)=>{
        if (newBasemap.url === state.basemap.url) {
            return state;
        }
        return { basemap: newBasemap }
    }),

    resetMapStore: () => set(()=>{
        return { 
            mapReady: false, 
            basemap: {
                url: "mapbox://styles/mapbox/streets-v12",
                name: "Streets",
            } 
        }
    }),

}));

export default useMapStore;
export type { Basemap };