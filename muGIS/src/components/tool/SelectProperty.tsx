import { FC } from 'react';
import { LayerData } from '../../hooks/useLayerStore';

interface SelectPropertyProps {
  propertyEnabled?: boolean;
  selectedLayer: LayerData;
  selectedProperty: string | undefined;
  setSelectedProperty: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SelectProperty: FC<SelectPropertyProps> = ({
  propertyEnabled = true,
  selectedLayer,
  selectedProperty,
  setSelectedProperty,
}) => {
  return (
    <select required disabled={!propertyEnabled} value={selectedProperty} onChange={(e)=>setSelectedProperty(e.target.value)}>
      <option value="">Select a property</option>
      {selectedLayer?.featureCollection.features[0].properties && Object.keys(selectedLayer.featureCollection.features[0].properties).map((property) => (
          <option key={property} value={property}>{property}</option>
      ))}
    </select>
  );
}

export default SelectProperty;

/*
<div>
      {filters.map((filter, index) => (
        <div key={index}>
          <input
            type="text"
            value={filter.attribute}
            onChange={(e) => updateFilter(index, { ...filter, attribute: e.target.value })}
          />
          <select
            value={filter.operator}
            onChange={(e) => updateFilter(index, { ...filter, operator: e.target.value as FilterOperator })}
          >
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value=">=">&gt;=</option>
          </select>
          <input
            type="text"
            value={filter.value}
            onChange={(e) => updateFilter(index, { ...filter, value: e.target.value })}
          />
          <button onClick={() => removeFilter(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addFilter}>Add Filter</button>
    </div>
    */