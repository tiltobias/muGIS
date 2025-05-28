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
                          <button type="button">
                            {header}
                            <span className="sortIcons">
                              <ArrowUp className="sortIcon" />
                              <ArrowDown className="sortIcon" />
                            </span>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((props, index) => (
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