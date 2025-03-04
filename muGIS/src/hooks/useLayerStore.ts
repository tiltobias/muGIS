import { create } from 'zustand';
import { LayerData } from "../components/Layer";

interface LayerStore {
    layers: LayerData[];
    setLayers: (newLayers: LayerData[]) => void;
    addLayer: (newLayer: LayerData) => void;
    moveLayerUp: (id: string) => void;
    moveLayerDown: (id: string) => void;
    deleteLayer: (id: string) => void;
    toggleLayerVisibility: (id: string) => void;
    toggleLayerVisibilityAll: () => void;
}

const useLayerStore = create<LayerStore>((set) => ({
    layers: [],

    setLayers: (newLayers: LayerData[]) => set({ layers: newLayers}),

    addLayer: (newLayer: LayerData) => set((state) => (
        { layers: [newLayer, ...state.layers] }
    )),

    moveLayerUp: (id: string) => set((state) => {
        const index = state.layers.findIndex(layer => layer.id === id);
        if (index === 0) {return state;} // already at top
        const newLayers = [...state.layers];
        newLayers.splice(index-1, 0, newLayers.splice(index, 1)[0]); // move layer up
        return { layers: newLayers };
    }),

    moveLayerDown: (id: string) => set((state) => {
        const index = state.layers.findIndex(layer => layer.id === id);
        if (index === state.layers.length - 1) {return state;} // already at bottom
        const newLayers = [...state.layers];
        newLayers.splice(index+1, 0, newLayers.splice(index, 1)[0]); // move layer down
        return { layers: newLayers };
    }),

    deleteLayer: (id: string) => set((state) => (
        { layers: state.layers.filter(layer => layer.id !== id) }
    )),
    
    toggleLayerVisibility: (id: string) => set((state) => (
        { layers: state.layers.map(layer => layer.id === id ? {...layer, visible: !layer.visible} : layer) }
    )),

    toggleLayerVisibilityAll: () => set((state) => {
        const allVisible = state.layers.every(layer => layer.visible);
        return { layers: state.layers.map(layer => ({...layer, visible: !allVisible})) };
    }),
    
}));

export default useLayerStore;