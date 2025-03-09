import { create } from 'zustand';
import { createRef } from 'react';

interface MapStore {
    mapRef: React.RefObject<mapboxgl.Map | null>;
    setMapRef: (newMapRef: React.RefObject<mapboxgl.Map | null>) => void;
}

const useMapStore = create<MapStore>((set) => ({
    mapRef: createRef(),

    setMapRef: (newMapRef: React.RefObject<mapboxgl.Map | null>) => set({ mapRef: newMapRef }),

}));

export default useMapStore;