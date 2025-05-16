import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { buffer } from '@turf/buffer';
import ToolModal from '../ToolModal';
import SelectLayers from '../SelectLayers';

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
    <ToolModal buttonLabel="Buffer" onFormSubmit={onFormSubmit}>
      
      <SelectLayers
        selectedLayers={selectedLayer} 
        setSelectedLayers={setSelectedLayer} 
      />
      
      buffer radius [m]: {radius}
      <input type="number" value={radius} onChange={(e)=>setRadius(e.target.value)} />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default BufferTool;