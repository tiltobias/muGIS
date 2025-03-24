import { create } from 'zustand';
import { createRef } from 'react';

interface MapStore {
    mapRef: React.RefObject<mapboxgl.Map | null>;
    setMapRef: (newMapRef: React.RefObject<mapboxgl.Map | null>) => void;
    mapReady: boolean;
    setMapReady: (ready: boolean) => void;
}

const useMapStore = create<MapStore>((set) => ({
    mapRef: createRef(),

    setMapRef: (newMapRef: React.RefObject<mapboxgl.Map | null>) => set({ mapRef: newMapRef }),

    mapReady: false,

    setMapReady: (ready: boolean) => set({ mapReady: ready }),

}));

export default useMapStore;