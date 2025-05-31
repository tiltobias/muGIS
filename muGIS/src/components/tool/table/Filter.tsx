import { FC } from 'react';
import useAttributeTableStore, { FilterOperator } from '../../../hooks/useAttributeTableStore';

interface FilterProps {
  headers: string[]; // The headers of the attribute table, used to populate filter options
}

const Filter: FC<FilterProps> = ({ headers }) => {

  const { 
    filters, 
    addFilter, 
    removeFilter, 
    updateFilter, 
  } = useAttributeTableStore();

  return (
    <div className="filterContainer">
      {filters.map((filter, index) => (
        <div key={index} className="filterRow">
          <select
            value={filter.attribute}
            onChange={(e) => updateFilter(index, { ...filter, attribute: e.target.value })}
          >
            <option value="">Select an attribute</option>
            {headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
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
  )
}

export default Filter;