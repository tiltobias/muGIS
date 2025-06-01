import { FC, useState, useMemo, useEffect } from 'react';
import { TextSearch, X, ArrowUp, ArrowDown, Square, SquareCheck, SquareMinus, Funnel } from 'lucide-react';
import './AttributeTable.css';
import useLayerStore from '../../../hooks/useLayerStore';
import SelectLayer from '../SelectLayer';
import { Feature, GeoJsonProperties } from 'geojson';
import useAttributeTableStore, { FilterNumberOperator, FilterStringOperator} from '../../../hooks/useAttributeTableStore';
import Filter from './Filter';

const AttributeTable: FC = () => {

  const {
    selectedLayer,
    setSelectedLayer,
    tableOpen,
    setTableOpen,
    filters,
  } = useAttributeTableStore();

  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    setFeatures(
      selectedLayer.length > 0 ? selectedLayer[0].featureCollection.features.map(
        (feature, index) => {
          const newProps: GeoJsonProperties = {...(feature.properties || {}), mugisSelected: false, mugisIndex: index};
          return {...feature, properties: newProps} as Feature;
        }
      ) : []
    );
    console.log('Selected layer changed:', selectedLayer);
  }, [selectedLayer]);

  const headers: string[] = useMemo(() => {
    const keySet = new Set<string>();
    features.forEach((feature) => {
      if (feature && feature.properties) {
        Object.keys(feature.properties).forEach(key => keySet.add(key));
      }
    });

    keySet.delete('mugisSelected'); 
    keySet.delete('mugisIndex'); 
    // Remove keys that dont have valid values in all features (arrays, null, undefined)
    keySet.forEach(header => {
      const values = features.map(feature => feature.properties?.[header] as unknown);
      if (values.every(value => Array.isArray(value) || value === null || value === undefined)) {
        keySet.delete(header);
      }
    });

    return Array.from(keySet);
  }, [features]);

  const headerTypes: (string | null)[] = useMemo(() => {
    return headers.map(header => {
      const values = features.map(feature => feature.properties?.[header] as unknown).filter(value => value !== undefined && value !== null);
      if (values.every(value => typeof value === 'number')) {
        return 'number';
      } else  {
        return 'string'; // Default to string if not all values are numbers
      }
    });
  }, [headers, features]);

  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const filteredFeatures = useMemo(() => {
    return features.filter(feature => {
      return filters.every(filter => {
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
              return featureValue === val;
            case '!=':
              return featureValue !== val;
            case 'contains':
              return featureValue.includes(val);
            case 'does not contain':
              return !featureValue.includes(val);
            case 'starts with':
              return featureValue.startsWith(val);
            case 'does not start with':
              return !featureValue.startsWith(val);
            case 'ends with':
              return featureValue.endsWith(val);
            case 'does not end with':
              return !featureValue.endsWith(val);
            default:
              return false;
          }
        }
      });
    });
  }, [features, filters]);

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  const sortedFilteredFeatures = useMemo(() => {
    if (!sortKey) return filteredFeatures;

    return [...filteredFeatures].sort((a, b) => {
      const aValue: string | number = a && a.properties && sortKey in a.properties ? (a.properties[sortKey] as string | number) ?? '' : '';
      const bValue: string | number = b && b.properties && sortKey in b.properties ? (b.properties[sortKey] as string | number) ?? '' : '';

      if (aValue === bValue) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      if (aValue < bValue) return sortAscending ? -1 : 1;
      if (aValue > bValue) return sortAscending ? 1 : -1;
      return 0;
    });
  }, [filteredFeatures, sortKey, sortAscending]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortAscending) {
        setSortAscending(false);
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  const {
    addLayer,
  } = useLayerStore();

  const handleSubmit = () => {
    if (selectedLayer.length === 0 || features.length === 0) return;

    const selectedFeatures = filteredFeatures.filter(feature => feature.properties?.mugisSelected).map(
      (feature) => (
        {...feature, properties: {...feature.properties, mugisSelected: undefined, mugisIndex: undefined}} as Feature
      ));
    if (selectedFeatures.length === 0) return;

    addLayer({
      featureCollection: {
        type: 'FeatureCollection',
        features: selectedFeatures,
      },
      name: `selection(${selectedLayer[0].name})`,
      outline: selectedLayer[0].outline,
    });
    setTableOpen(false);
  }

  

  return (
    <div>
      <button type="button" className="toolButton" onClick={() => setTableOpen(!tableOpen)}>
        <TextSearch />
      </button>

      {tableOpen && (
        <div className="cover" onClick={(e)=>{
          if (e.target === e.currentTarget) setTableOpen(false);  // only close if clicked on the cover
        }}>
          <div className="attributeTable">
            <button type="button" className="modalCloseButton" onClick={()=>setTableOpen(false)}><X /></button>
            <h3>Attribute Table</h3>

            <div className="tableInputHeader">
              <SelectLayer 
                selectedLayers={selectedLayer} 
                setSelectedLayers={setSelectedLayer}
              />
              <button type="button" className={`openFilterButton ${filters.some(filter => filter.active) ? 'active' : ''}`} onClick={() => setFilterOpen(!filterOpen)}>
                <Funnel /> { filterOpen ? 'Close Filter' : 'Open Filter' }
              </button>
            </div>

            {filterOpen && (
              <Filter headers={headers} headerTypes={headerTypes} />
            )}

            <div className="tableContainer">
              {selectedLayer.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>
                        <button type="button" className="selectAll" onClick={() => {
                          if (filteredFeatures.every((feature) => !feature.properties?.mugisSelected)) {
                            setFeatures((prev) => prev.map((f) => {
                              const newProps = {...(f.properties || {}), mugisSelected: true};
                              return {...f, properties: newProps} as Feature;
                            }));
                          } else {
                            setFeatures((prev) => prev.map((f) => {
                              const newProps = {...(f.properties || {}), mugisSelected: false};
                              return {...f, properties: newProps} as Feature;
                            }));
                          }
                        }}>
                          {filteredFeatures.every((feature) => feature.properties!.mugisSelected) ? 
                            <SquareCheck /> : 
                          filteredFeatures.every((feature) => !feature.properties!.mugisSelected) ? 
                            <Square /> : 
                            <SquareMinus />
                          }
                        </button>
                      </th>
                      {headers.map((header, index) => (
                        <th key={index}>
                          <button type="button" onClick={() => handleSort(header)}>
                            {header}
                            <div className="sortIcon">
                              {sortKey === header && (
                                sortAscending ? 
                                  <ArrowUp /> : 
                                  <ArrowDown />                              
                              )}
                            </div>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFilteredFeatures.map((feature, index) => (
                      <tr key={index} className={feature.properties?.mugisSelected ? 'selected' : ''}>
                        <td>
                          <button type="button" onClick={() => {
                            setFeatures((prev) => prev.map((f, i) => {
                              if (i === feature.properties?.mugisIndex) {
                                const newProps = {...(f.properties || {}), mugisSelected: !f.properties?.mugisSelected};
                                return {...f, properties: newProps} as Feature;
                              }
                              return f;
                            }))
                          }}>
                            { feature.properties!.mugisSelected ? <SquareCheck /> : <Square />}
                          </button>
                        </td>
                        {headers.map((header, headerIndex) => (
                          <td key={headerIndex}>
                            {feature.properties && !Array.isArray(feature.properties[header]) && feature.properties[header] !== null && feature.properties[header] !== undefined ? String(feature.properties[header]) : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>

                </table>
              )}
            </div>

            <button type="button" onClick={handleSubmit}>
              Create Layer From Selection
              {filteredFeatures.filter(feature => feature.properties?.mugisSelected).length > 0 && (
                ` (${filteredFeatures.filter(feature => feature.properties?.mugisSelected).length} selected)`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttributeTable;