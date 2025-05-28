import { FC, useState, useMemo } from 'react';
import { FileSearch, X, ArrowUp, ArrowDown } from 'lucide-react';
import './AttributeTable.css';
import { LayerData } from '../../hooks/useLayerStore';
import SelectLayer from './SelectLayer';
import { GeoJsonProperties } from 'geojson';

const AttributeTable: FC = () => {

  const [tableOpen, setTableOpen] = useState<boolean>(false);
  const [selectedLayer, setSelectedLayer] = useState<LayerData[]>([]);

  const features: GeoJsonProperties[] = useMemo(() => {
    return selectedLayer.length > 0 ? selectedLayer[0].featureCollection.features.map((feature) => feature.properties) : [];
  }, [selectedLayer]);

  const headers: string[] = useMemo(() => {
    const keySet = new Set<string>();
    features.forEach((props) => {
      if (props) {
        Object.keys(props).forEach(key => keySet.add(key));
      }
    });
    
    return Array.from(keySet);
  }, [features]);

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  const sortedFeatures = useMemo(() => {
    if (!sortKey) return features;

    return [...features].sort((a, b) => {
      const aValue: string | number = a && sortKey in a ? (a[sortKey] as string | number) ?? '' : '';
      const bValue: string | number = b && sortKey in b ? (b[sortKey] as string | number) ?? '' : '';

      if (aValue === bValue) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      if (aValue < bValue) return sortAscending ? -1 : 1;
      if (aValue > bValue) return sortAscending ? 1 : -1;
      return 0;
    });
  }, [features, sortKey, sortAscending]);

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

  return (
    <div>
      <button type="button" className="toolButton" onClick={() => setTableOpen(!tableOpen)}>
        <FileSearch />
      </button>

      {tableOpen && (
        <div className="cover" onClick={(e)=>{
          if (e.target === e.currentTarget) setTableOpen(false);  // only close if clicked on the cover
        }}>
          <div className="attributeTable">
            <button type="button" className="modalCloseButton" onClick={()=>setTableOpen(false)}><X /></button>
            <h3>Attribute Table</h3>

            <SelectLayer 
              selectedLayers={selectedLayer} 
              setSelectedLayers={setSelectedLayer}
            />

            <div className="tableContainer">
              {selectedLayer.length > 0 && (
                <table>
                  <thead>
                    <tr>
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
                    {sortedFeatures.map((props, index) => (
                      <tr key={index}>
                        {headers.map((header, headerIndex) => (
                          <td key={headerIndex}>
                            {props ? props[header] : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>

                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttributeTable;