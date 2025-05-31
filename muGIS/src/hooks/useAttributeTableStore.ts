import { create } from 'zustand';
import { LayerData } from './useLayerStore';

export type FilterOperator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'contains' | 'startsWith' | 'endsWith';

export interface Filter {
  attribute: string;
  operator: FilterOperator;
  value: string;
}

interface AttributeTableStore {
  selectedLayer: LayerData[];
  setSelectedLayer: React.Dispatch<React.SetStateAction<LayerData[]>>;
  tableOpen: boolean;
  setTableOpen: (open: boolean) => void;
  openTableWithLayer: (layer: LayerData[]) => void;
  filters: Filter[];
  addFilter: () => void;
  removeFilter: (index: number) => void;
  updateFilter: (index: number, filter: Filter) => void;
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

  filters: [],

  addFilter: () => set((state) => {
    const newFilter: Filter = { attribute: '', operator: '=', value: '' };
    return { filters: [...state.filters, newFilter] };
  }),

  removeFilter: (index: number) => set((state) => {
    const filters = [...state.filters];
    filters.splice(index, 1);
    return { filters };
  }),

  updateFilter: (index: number, filter: Filter) => set((state) => {
    const filters = [...state.filters];
    filters[index] = filter;
    return { filters };
  }),

}));

export default useAttributeTableStore;