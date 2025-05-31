import { create } from 'zustand';
import { LayerData } from './useLayerStore';


export const filterNumberOperators = ['=', '!=', '<', '<=', '>', '>='] as const;
export const filterStringOperators = ['=', '!=', 'contains', 'does not contain', 'starts with', 'does not start with', 'ends with', 'does not end with'] as const;

export type FilterNumberOperator = typeof filterNumberOperators[number];
export type FilterStringOperator = typeof filterStringOperators[number];
export type FilterOperator = FilterNumberOperator | FilterStringOperator;

export interface Filter {
  active: boolean;
  attribute: string;
  attributeType: 'number' | 'string';
  operator: FilterOperator;
  value: number | string;
}

const defaultFilter: Filter = {
  active: false,
  attribute: '',
  attributeType: 'string',
  operator: '=',
  value: '',
};

interface AttributeTableStore {
  selectedLayer: LayerData[];
  setSelectedLayer: React.Dispatch<React.SetStateAction<LayerData[]>>;
  tableOpen: boolean;
  setTableOpen: (open: boolean) => void;
  openTableWithLayer: (layer: LayerData[]) => void;
  filters: Filter[];
  resetFilters: () => void;
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

  filters: [{ ...defaultFilter }],

  resetFilters: () => set(() => ({
    filters: [{ ...defaultFilter }],
  })),

  addFilter: () => set((state) => {
    const newFilter: Filter = { ...defaultFilter };
    return { filters: [...state.filters, newFilter] };
  }),

  removeFilter: (index: number) => set((state) => {
    const filters = [...state.filters];
    filters.splice(index, 1);
    if (filters.length === 0) {
      filters.push({ ...defaultFilter });
    }
    return { filters };
  }),

  updateFilter: (index: number, filter: Filter) => set((state) => {
    const filters = [...state.filters];
    filters[index] = filter;
    return { filters };
  }),

}));

export default useAttributeTableStore;