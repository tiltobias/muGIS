import { FC, useState, useMemo, useEffect } from 'react';
import { TextSearch, X, ArrowUp, ArrowDown, Square, SquareCheck, SquareMinus, Funnel, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info } from 'lucide-react';
import './AttributeTable.css';
import useLayerStore from '../../../hooks/useLayerStore';
import SelectLayer from '../SelectLayer';
import { Feature, GeoJsonProperties } from 'geojson';
import useAttributeTableStore, { applyFilter } from '../../../hooks/useAttributeTableStore';
import FilterPanel from './Filter';

const AttributeTable: FC = () => {

  const {
    selectedLayer,
    setSelectedLayer,
    tableOpen,
    setTableOpen,
    filters,
    filterConnector,
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

  const activeFilters = useMemo(() => {
    return filters.filter(filter => filter.active)
  }, [filters]);

  const filteredFeatures = useMemo(() => {
    if (activeFilters.length === 0) return features; // If no active filters, return all features

    return features.filter(feature => {
      return filterConnector === 'and' ? 
        activeFilters.every(filter => applyFilter(feature, filter)) : 
        activeFilters.some(filter => applyFilter(feature, filter));
    });
  }, [features, activeFilters, filterConnector]);

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

  const [tablePage, setTablePage] = useState<number>(1);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const description = "This tool allows you to view and manage the attributes of features in a selected layer. You can filter, sort, and select features, and create a new layer from the selected features. Click on the column headers to sort by attribute. You can select individual features by clicking the checkbox in the first column, or all of them by clicking the checkbox in the header. Use the 'Create Layer From Selection' button to create a new layer from the selected features. To filter the displayed features, click 'Open Filter' and use the filter panel to set your criteria. Use 'Combine filters by AND' to require all conditions to be met, or 'Combine filters by OR' to allow any condition to be met.";

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
            <div className="modalHeader">
              <h3>Attribute Table</h3>
              <button type="button" className="infoButton" onClick={() => setShowDescription(!showDescription)}>
                <Info />
              </button>
            </div>

            {showDescription && <p className="modalDescription">{description}</p>}

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
              <FilterPanel headers={headers} headerTypes={headerTypes} />
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
                    {sortedFilteredFeatures.slice((tablePage - 1) * 100, tablePage * 100).map((feature, index) => (
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
            {selectedLayer.length > 0 && (
              <div className="tableFooter">
                <span>Showing {filteredFeatures.length} of {features.length} features</span>
                <div className="tableFooterRight">
                  <span>{(tablePage - 1) * 100 + 1}–{Math.min(tablePage * 100, filteredFeatures.length)} of {filteredFeatures.length}</span>
                  <div className="tablePagination">
                    <button type="button" onClick={() => setTablePage(1)} disabled={tablePage <= 1}>
                      <ChevronsLeft />
                    </button>
                    <button type="button" onClick={() => setTablePage(prev => Math.max(1, prev - 1))} disabled={tablePage <= 1}>
                      <ChevronLeft />
                    </button>
                    <button type="button" onClick={() => setTablePage(prev => Math.min(Math.ceil(filteredFeatures.length / 100), prev + 1))} disabled={tablePage >= Math.ceil(filteredFeatures.length / 100)}>
                      <ChevronRight />
                    </button>
                    <button type="button" onClick={() => setTablePage(Math.ceil(filteredFeatures.length / 100))} disabled={tablePage >= Math.ceil(filteredFeatures.length / 100)}>
                      <ChevronsRight />
                    </button>
                  </div>
                </div>
              </div>
            )}

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