import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { dissolve } from '@turf/dissolve';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { flatten } from '@turf/flatten';
import { DissolveIcon } from '../../icons';
import Select from '../Select';

const DissolveTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer, setSelectedLayer] = useState<LayerData[]>([]);
  const [propertyEnabled, setPropertyEnabled] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer[0]) {
      if (propertyEnabled && selectedProperty) {
        setNewLayerName(`dissolve(${selectedLayer[0].name}, ${selectedProperty})`);
      } else {
        setNewLayerName(`dissolve(${selectedLayer[0].name})`);
      }
    }
  }, [selectedLayer, propertyEnabled, selectedProperty]);

  const onFormSubmit = () => {
    if (!selectedLayer[0]) {
      alert("Please select a layer");
      return false;
    };
    const layer = selectedLayer[0].featureCollection as FeatureCollectionPolygon;
    const result = !(propertyEnabled && selectedProperty) ? dissolve(flatten(layer)) : dissolve(flatten(layer), { propertyName: selectedProperty });
    if (!result || result.features.length === 0) {
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
    <ToolModal buttonLabel="Dissolve" onFormSubmit={onFormSubmit} buttonIcon={<DissolveIcon />}>
      
      select layer: 
      <SelectLayer 
        selectedLayers={selectedLayer} 
        setSelectedLayers={setSelectedLayer} 
        renderingType="fill"
      />

      <span>
        <input type="checkbox" checked={propertyEnabled} onChange={(e)=>setPropertyEnabled(e.target.checked)} id="checkboxPropertyEnabled" />

        <label htmlFor="checkboxPropertyEnabled">dissolve by property: {propertyEnabled && selectedProperty}</label>
      </span>
      {propertyEnabled && (
        <Select
          options={selectedLayer[0]?.featureCollection.features[0].properties ? Object.keys(selectedLayer[0].featureCollection.features[0].properties) : []}
          selectedOption={selectedProperty}
          setSelectedOption={(value) => setSelectedProperty(value)}
          placeholder="Select a property"
          clearable
        />
      )}
      

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default DissolveTool;