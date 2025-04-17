import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { dissolve } from '@turf/dissolve';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { flatten } from '@turf/flatten';

const DissolveTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer, setSelectedLayer] = useState<LayerData | undefined>(undefined);
  const [propertyEnabled, setPropertyEnabled] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<string | undefined>(undefined);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer) {
      if (propertyEnabled && selectedProperty) {
        setNewLayerName(`dissolve(${selectedLayer.name}, ${selectedProperty})`);
      } else {
        setNewLayerName(`dissolve(${selectedLayer.name})`);
      }
    }
  }, [selectedLayer, propertyEnabled, selectedProperty]);

  const onFormSubmit = () => {
    if (!selectedLayer) {
      alert("Please select a layer");
      return false;
    };
    const layer = selectedLayer.featureCollection as FeatureCollectionPolygon;
    const result = !(propertyEnabled && selectedProperty) ? dissolve(flatten(layer)) : dissolve(flatten(layer), { propertyName: selectedProperty });
    if (!result) {
      alert("No results found");
      return false;
    }
    addLayer({
      featureCollection: result,
      name: newLayerName,
    })
    return true;
  }

  return (
    <ToolModal buttonLabel="Dissolve" onFormSubmit={onFormSubmit}>
      
      selected layer: {selectedLayer?.name}
      <SelectLayer 
        selectedLayer={selectedLayer} 
        setSelectedLayer={setSelectedLayer} 
        renderingType="fill"
      />

      <span>
        <input type="checkbox" checked={propertyEnabled} onChange={(e)=>setPropertyEnabled(e.target.checked)}  />

        dissolve by property: {selectedProperty}
      </span>
      <select required disabled={!propertyEnabled} value={selectedProperty} onChange={(e)=>setSelectedProperty(e.target.value)}>
        <option value="">Select a property</option>
        {selectedLayer?.featureCollection.features[0].properties && Object.keys(selectedLayer.featureCollection.features[0].properties).map((property) => (
            <option key={property} value={property}>{property}</option>
        ))}
      </select>
      

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default DissolveTool;