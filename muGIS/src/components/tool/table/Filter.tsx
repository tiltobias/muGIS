import { FC } from 'react';
import useAttributeTableStore, { FilterOperator, filterNumberOperators, filterStringOperators, FilterNumberOperator, FilterStringOperator } from '../../../hooks/useAttributeTableStore';
import './Filter.css';
import { Square, SquareCheck, Trash2 } from 'lucide-react';

interface FilterProps {
  headers: string[]; // The headers of the attribute table, used to populate filter options
  headerTypes: (string | null)[]; // The types of the headers, used to determine the operator options
}

const Filter: FC<FilterProps> = ({ headers, headerTypes }) => {

  const { 
    filters, 
    addFilter, 
    removeFilter, 
    updateFilter, 
    filterConnector,
    setFilterConnector,
  } = useAttributeTableStore();

  return (
    <div className="filterContainer">
      {filters.map((filter, index) => (
        <div key={index} className="filterRow">
          <select
            value={filter.attribute}
            onChange={(e) => updateFilter(index, { ...filter, attribute: e.target.value, attributeType: (headerTypes[headers.indexOf(e.target.value)] || 'string') as 'number' | 'string' })}
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
            {filter.attributeType === 'number' ? 
              filterNumberOperators.map((op: FilterNumberOperator) => (
                <option key={op} value={op}>{op}</option>
              )) : 
              filterStringOperators.map((op: FilterStringOperator) => (
                <option key={op} value={op}>{op}</option>
              ))
            }
          </select>
          <input
            type={filter.attributeType === 'number' ? 'number' : 'text'}
            placeholder={`Enter ${filter.attributeType} value`}
            value={filter.value}
            onChange={(e) => updateFilter(index, { ...filter, value: filter.attributeType === 'number' ? parseFloat(e.target.value) : e.target.value })}
          />
          <button type="button" onClick={() => {
            updateFilter(index, { ...filter, active: !filter.active });
          }}>
            {filter.active ? <SquareCheck /> : <Square />}
          </button>
          <button onClick={() => removeFilter(index)}><Trash2 /></button>
        </div>
      ))}
      <button onClick={addFilter}>Add Filter</button>
      <div className="filterConnector">
        <span>Combine filters by: </span>
        <select value={filterConnector} onChange={(e) => setFilterConnector(e.target.value as 'and' | 'or')}>
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
      </div>
    </div>
  )
}

export default Filter;