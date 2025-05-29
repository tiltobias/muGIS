import { create } from 'zustand';
import { LayerData } from './useLayerStore';

interface AttributeTableStore {
  selectedLayer: LayerData[];
  setSelectedLayer: React.Dispatch<React.SetStateAction<LayerData[]>>;
  tableOpen: boolean;
  setTableOpen: (open: boolean) => void;
  openTableWithLayer: (layer: LayerData[]) => void;
}

const useAttributeTableStore = create<AttributeTableStore>((set) => ({

  selectedLayer: [],

  // This function allows for both direct value setting and functional updates (compatible with React's useState)
  setSelectedLayer: (value: React.SetStateAction<LayerData[]>) => set((state) => {
    if (typeof value === 'function') {
        return { selectedLayer: value(state.selectedLayer) };
    } else {
        return { selectedLayer: value };
    }
  }),

  tableOpen: false,

  setTableOpen: (open: boolean) => set(() => {
    return { tableOpen: open };
  }),

  openTableWithLayer: (layer: LayerData[]) => set(() => {
    return { tableOpen: true, selectedLayer: layer };
  }),

}));

export default useAttributeTableStore;