import { create } from 'zustand';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { HslaColor } from '../components/sidebar/layer/ColorPicker';

export type LayerRenderingType = "fill"|"line"|"circle";

export interface LayerData {
  featureCollection: FeatureCollection;
  id: string;
  name: string;
  renderingType: LayerRenderingType;
  visible: boolean;
  color: HslaColor;
  updater?: number;
  outline?: boolean;
}

export interface NewLayerData {
    featureCollection: FeatureCollection;
    name: string | null;
    outline?: boolean;
}

export interface LayerOption {
    id: string;
    name: string;
    renderingType: LayerRenderingType;
}

export type FeatureCollectionPolygon = FeatureCollection<Polygon | MultiPolygon>;

interface LayerStore {
    layers: LayerData[];
    resetLayerStore: () => void;
    loadProjectLayers: (loadedLayers: LayerData[]) => void
    addLayer: (newLayer: NewLayerData) => void;
    moveLayerUp: (id: string) => void;
    moveLayerDown: (id: string) => void;
    deleteLayer: (id: string) => void;
    toggleLayerVisibility: (id: string) => void;
    toggleLayerVisibilityAll: () => void;
    changeLayerColor: (id: string, color: HslaColor) => void;
    updateAllLayers: () => void;
    changeLayerName: (id: string, name: string) => void;
}

const useLayerStore = create<LayerStore>((set) => ({
    layers: [],

    resetLayerStore: () => set(()=>{
        return { layers: [] }
    }),

    loadProjectLayers: (loadedLayers: LayerData[]) => set(() => {
        return { layers: loadedLayers }
    }),

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
        if (!newLayer.name) {
            newLayer.name = 
                renderingType === "fill" ? "polygon" :
                renderingType === "line" ? "line" :
                renderingType === "circle" ? "point" : "not possible";
        };
        const color: HslaColor = {
            h: Math.floor(Math.random()*360), 
            s: 90, 
            l: 48, 
            a: renderingType === "fill" ? 0.7 : 1,
        }

        const layerData: LayerData = {
            featureCollection: newLayer.featureCollection,
            id: makeUniqueFileId(newLayer.name),
            name: newLayer.name,
            renderingType: renderingType,
            visible: true,
            color: color,
            outline: newLayer.outline,
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

    changeLayerColor: (id: string, color: HslaColor) => set((state) => (
        { layers: state.layers.map(layer => layer.id === id ? {...layer, color: color} : layer) }
    )),

    updateAllLayers: () => set((state) => (
        { layers: state.layers.map(layer => ({...layer, updater: layer.updater ? layer.updater + 1 : 1})) }
    )),

    changeLayerName: (id: string, name: string) => set((state) => (
        { layers: state.layers.map(layer => layer.id === id ? {...layer, name: name} : layer) }
    )),
    
}));

export default useLayerStore;