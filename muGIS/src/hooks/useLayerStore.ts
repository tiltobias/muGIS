import { create } from 'zustand';
import { FeatureCollection } from "geojson";
import { HslaColor } from "../components/ColorPicker";
import { createRef } from 'react';

interface Basemap {
    url: string;
    name: string;
}

type LayerRenderingType = "fill"|"line"|"circle";

interface LayerData {
  featureCollection: FeatureCollection;
  id: string;
  name: string;
  renderingType: LayerRenderingType;
  visible: boolean;
  color: HslaColor;
}

interface NewLayerData {
    featureCollection: FeatureCollection;
    name: string | null;
}

interface LayerStore {
    mapRef: React.RefObject<mapboxgl.Map | null>;
    mapReady: boolean;
    setMapReady: (ready: boolean) => void;
    basemap: Basemap;
    setBasemap: (newBasemap: Basemap) => void;

    layers: LayerData[];
    resetLayerStore: () => void;
    loadProjectLayers: (loadedLayers: LayerData[]) => void
    renderLayer: (layer: LayerData) => void;
    unrenderLayer: (id: string) => void;
    renderAllLayers: () => void;
    addLayer: (newLayer: NewLayerData) => void;
    moveLayerUp: (id: string) => void;
    moveLayerDown: (id: string) => void;
    deleteLayer: (id: string) => void;
    toggleLayerVisibility: (id: string) => void;
    toggleLayerVisibilityAll: () => void;
    changeLayerColor: (id: string, color: HslaColor) => void;
}

const useLayerStore = create<LayerStore>((set, get) => ({
    mapRef: createRef(),

    mapReady: false,

    setMapReady: (ready: boolean) => set({ mapReady: ready }),

    basemap: {
        url: "mapbox://styles/mapbox/streets-v12",
        name: "Streets",
    },

    setBasemap: (newBasemap: Basemap) => set(()=>{
        return { basemap: newBasemap }
    }),



    layers: [],

    resetLayerStore: () => {
        get().layers.forEach(layer => get().deleteLayer(layer.id));
        get().setBasemap({
            url: "mapbox://styles/mapbox/streets-v12",
            name: "Streets",
        });
    },

    loadProjectLayers: (loadedLayers: LayerData[]) => set((state) => {
        state.resetLayerStore();
        state.mapRef.current?.once("style.load", () => {
            // loadedLayers.forEach(layer => {
            //     state.renderLayer(layer);
            // });
            get().renderAllLayers();
        });
        return { layers: loadedLayers }
    }),

    renderLayer: (layerData: LayerData) => {
        // get().mapRef.current?.once("style.load", () => {
            get().mapRef.current?.addSource(layerData.id, {
                type: "geojson",
                data: layerData.featureCollection,
            });
            get().mapRef.current?.addLayer({
                id: layerData.id,
                type: layerData.renderingType,
                source: layerData.id,
                paint: 
                    layerData.renderingType === "fill" ? {
                        "fill-color": `hsl(${layerData.color.h},${layerData.color.s}%,${layerData.color.l}%)`,
                        "fill-opacity": layerData.color.a,
                    } :
                    layerData.renderingType === "line" ? {
                        "line-color": `hsl(${layerData.color.h},${layerData.color.s}%,${layerData.color.l}%)`,
                        "line-opacity": layerData.color.a,
                        "line-width": 2,
                    } :
                    layerData.renderingType === "circle" ? {
                        "circle-color": `hsl(${layerData.color.h},${layerData.color.s}%,${layerData.color.l}%)`,
                        "circle-opacity": layerData.color.a,
                        "circle-radius": 5,
                    } :
                    {},
            });
        // });
    },

    unrenderLayer: (id: string) => {
        get().mapRef.current?.removeLayer(id);
        get().mapRef.current?.removeSource(id);
    },

    renderAllLayers: () => get().layers.forEach(layer => get().renderLayer(layer)),

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
                renderingType === "fill" ? "polygon layer" :
                renderingType === "line" ? "line layer" :
                renderingType === "circle" ? "point layer" : "not possible";
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
        };
        state.renderLayer(layerData); // render layer on map
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

    deleteLayer: (id: string) => set((state) => {
        state.unrenderLayer(id);
        return { layers: state.layers.filter(layer => layer.id !== id) }
    }),
    
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
    
}));

export default useLayerStore;
export type { Basemap, LayerData, LayerRenderingType };