import { FC } from 'react';
import useAttributeTableStore, { FilterOperator, filterNumberOperators, filterStringOperators } from '../../../hooks/useAttributeTableStore';
import './Filter.css';
import { Square, SquareCheck, Trash2, CopyPlus } from 'lucide-react';
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
      <div className="filterHeader">
        <div className="filterConnector">
          <span>Combine filters by: </span>
          <Select
            options={['and', 'or']}
            selectedOption={filterConnector}
            setSelectedOption={(value) => setFilterConnector(value as 'and' | 'or')}
            placeholder="Select connector"
            clearable={false}
          />
        </div>
        <button onClick={addFilter}><CopyPlus />Add Filter</button>
      </div>
      <div className="filterRows">
        {filters.map((filter, index) => (
          <div key={index} className={`filterRow` + (filter.active ? ' active' : '')}>
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
            <button type="button" className={`filterToggle ${filter.active ? 'active' : ''}`} onClick={() => {
              updateFilter(index, { ...filter, active: !filter.active });
            }}>
              {filter.active ? <SquareCheck /> : <Square />}
            </button>
            <button onClick={() => removeFilter(index)}><Trash2 /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Filter;