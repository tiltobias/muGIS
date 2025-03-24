import { create } from 'zustand';
import { FeatureCollection } from "geojson";

type LayerRenderingType = "fill"|"line"|"circle";

interface LayerData {
  featureCollection: FeatureCollection;
  id: string;
  name: string;
  renderingType: LayerRenderingType;
  visible: boolean;
}

interface NewLayerData {
    featureCollection: FeatureCollection;
    name: string;
}

interface LayerStore {
    layers: LayerData[];
    addLayer: (newLayer: NewLayerData) => void;
    moveLayerUp: (id: string) => void;
    moveLayerDown: (id: string) => void;
    deleteLayer: (id: string) => void;
    toggleLayerVisibility: (id: string) => void;
    toggleLayerVisibilityAll: () => void;
}

const useLayerStore = create<LayerStore>((set) => ({
    layers: [],

    addLayer: (newLayer: NewLayerData) => set((state) => {
        const makeUniqueFileId = (id: string): string => {
            if (state.layers.some(layer => layer.id === id)) {
                return makeUniqueFileId(id + "1");
            } else {
                return id;
            };
        };
        const t = newLayer.featureCollection.features[0].geometry.type;
        const renderingType: LayerRenderingType | null = 
            t === "Polygon" || t === "MultiPolygon" ? "fill" :
            t === "LineString" || t === "MultiLineString" ? "line" :
            t === "Point" || t === "MultiPoint" ? "circle" :
            null;
        if (!renderingType) {
            throw new Error("Unsupported geometry type: " + t);
        }

        const layerData: LayerData = {
            featureCollection: newLayer.featureCollection,
            id: makeUniqueFileId(newLayer.name),
            name: newLayer.name,
            renderingType: renderingType,
            visible: true,
        };
        return { layers: [layerData, ...state.layers] }
    }),

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
export type { LayerData, LayerRenderingType };