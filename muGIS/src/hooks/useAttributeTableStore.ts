import { create } from 'zustand';
import { LayerData } from './useLayerStore';
import { Feature } from 'geojson';


export const filterNumberOperators = ['=', '!=', '<', '<=', '>', '>='] as const;
export const filterStringOperators = ['=', '!=', 'contains', 'does not contain', 'starts with', 'does not start with', 'ends with', 'does not end with'] as const;

export type FilterNumberOperator = typeof filterNumberOperators[number];
export type FilterStringOperator = typeof filterStringOperators[number];
export type FilterOperator = FilterNumberOperator | FilterStringOperator;
export type FilterConnector = 'and' | 'or';

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
  filterConnector: FilterConnector;
  setFilterConnector: (connector: FilterConnector) => void;
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

  filterConnector: 'and',

  setFilterConnector: (connector: FilterConnector) => set(() => ({
    filterConnector: connector,
  })),

}));

export default useAttributeTableStore;

export function applyFilter(feature: Feature, filter: Filter) {
  const { active, attribute, attributeType, operator, value } = filter;
  if (!active) return true; // If filter is not active, do not filter out the feature

  if (attributeType === 'number') {
    const featureValue = feature.properties?.[attribute] as number | undefined | null;

    // Enable filtering in or out features with undefined values
    if (featureValue === undefined || featureValue === null) {
      switch (operator) {
        case '=':
          return value === undefined || value === '' || Number.isNaN(value);
        case '!=':
          return value !== undefined && value !== '' && !Number.isNaN(value);
        default:
          return false;
      }
    }
        
    const val = value as number;
    switch (operator as FilterNumberOperator) {
      case '=':
        return featureValue === val;
      case '!=':
        return featureValue !== val;
      case '<':
        return featureValue < val;
      case '<=':
        return featureValue <= val;
      case '>':
        return featureValue > val;
      case '>=':
        return featureValue >= val;
      default:
        return false;
    }
    

  } else { // If attributeType is string
    const featureValue = feature.properties?.[attribute] as string | undefined | null;
    
    // Enable filtering in or out features with undefined values
    if (featureValue === undefined || featureValue === null) {
      switch (operator) {
        case '=':
          return value === undefined || value === '';
        case '!=':
          return value !== undefined && value !== '';
        default:
          return false;
      }
    }

    const val = value as string;
    switch (operator as FilterStringOperator) {
      case '=':
        return String(featureValue) === val;
      case '!=':
        return String(featureValue) !== val;
      case 'contains':
        return String(featureValue).includes(val);
      case 'does not contain':
        return !String(featureValue).includes(val);
      case 'starts with':
        return String(featureValue).startsWith(val);
      case 'does not start with':
        return !String(featureValue).startsWith(val);
      case 'ends with':
        return String(featureValue).endsWith(val);
      case 'does not end with':
        return !String(featureValue).endsWith(val);
      default:
        return false;
    }
  }
}