import { FC } from 'react';
import useAttributeTableStore, { FilterOperator, filterNumberOperators, filterStringOperators } from '../../../hooks/useAttributeTableStore';
import './Filter.css';
import { Square, SquareCheck, Trash2 } from 'lucide-react';
import Select from '../Select';

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
          <Select
            options={headers}
            selectedOption={filter.attribute}
            setSelectedOption={(value) => updateFilter(index, { ...filter, attribute: value, attributeType: (headerTypes[headers.indexOf(value)] || 'string') as 'number' | 'string' })}
            placeholder="Select an attribute"
            clearable
          />
          <Select
            options={filter.attributeType === 'number' ? [...filterNumberOperators] : [...filterStringOperators]}
            selectedOption={filter.operator}
            setSelectedOption={(value) => updateFilter(index, { ...filter, operator: value as FilterOperator })}
            placeholder="Select operator"
          />
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