import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { buffer } from '@turf/buffer';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { BufferIcon } from '../../icons';

const BufferTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer, setSelectedLayer] = useState<LayerData[]>([]);
  const [radius, setRadius] = useState<string>("");
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer[0]) {
      setNewLayerName(`buffer(${selectedLayer[0].name}, ${radius}m)`);
    }
  }, [selectedLayer, radius]);

  const onFormSubmit = () => {
    if (!selectedLayer[0] || radius === "") {
      alert("Please select a layer and enter a radius");
      return false;
    };
    const layer = selectedLayer[0].featureCollection as FeatureCollectionPolygon;
    const result = buffer(layer, radius as unknown as number * 0.001, { units: 'kilometers' });
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
    <ToolModal buttonLabel="Buffer" onFormSubmit={onFormSubmit} buttonIcon={<BufferIcon />}>
      
      <span className="toolInputLabel">Select a layer:</span>
      <SelectLayer 
        selectedLayers={selectedLayer} 
        setSelectedLayers={setSelectedLayer} 
      />

      <span className="toolInputLabel">Buffer radius [m]:</span>
      <input type="number" className="toolNumberInput" value={radius} onChange={(e)=>setRadius(e.target.value)} />


      <label htmlFor="outputLayerName">Output Layer Name:</label>
      <input id="outputLayerName" type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default BufferTool;