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
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      setErrorMessage("Please select a layer");
      return false;
    };
    const layer = selectedLayer[0].featureCollection as FeatureCollectionPolygon;
    const result = !(propertyEnabled && selectedProperty) ? dissolve(flatten(layer)) : dissolve(flatten(layer), { propertyName: selectedProperty });
    if (!result || result.features.length === 0) {
      setErrorMessage("No results found");
      return false;
    }
    addLayer({
      featureCollection: result,
      name: newLayerName,
    })
    setSelectedLayer([]);
    setPropertyEnabled(false);
    setSelectedProperty("");
    setNewLayerName("");
    setErrorMessage("");
    return true;
  }

  const description = "Dissolve polygons in a layer based on a property or without any property. The output will be a polygon layer containing the dissolved geometries.";

  return (
    <ToolModal buttonLabel="Dissolve" onFormSubmit={onFormSubmit} buttonIcon={<DissolveIcon />} description={description} errorMessage={errorMessage}>

      <span className="toolInputLabel">Select a polygon layer:</span>
      <SelectLayer 
        selectedLayers={selectedLayer} 
        setSelectedLayers={setSelectedLayer} 
        renderingType="fill"
      />

      <span className={propertyEnabled ? "toolInputLabel" : ""}>
        <input type="checkbox" checked={propertyEnabled} onChange={(e)=>setPropertyEnabled(e.target.checked)} id="checkboxPropertyEnabled" />

        <label htmlFor="checkboxPropertyEnabled">Dissolve by property{propertyEnabled && ":"}</label>
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
      

      <label htmlFor="outputLayerName">Output Layer Name:</label>
      <input id="outputLayerName" type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default DissolveTool;