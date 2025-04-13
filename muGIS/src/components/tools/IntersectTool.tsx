import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../hooks/useLayerStore';
import { intersect } from '@turf/intersect';
import ToolModal from './ToolModal';

const IntersectTool: FC = () => {

  const {
    layers,
    addLayer,
  } = useLayerStore();

  const [selectedLayer1, setSelectedLayer1] = useState<LayerData | undefined>(undefined);
  const [selectedLayer2, setSelectedLayer2] = useState<LayerData | undefined>(undefined);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer1 && selectedLayer2) {
      setNewLayerName(`intersect: ${selectedLayer1.name} & ${selectedLayer2.name}`);
    }
  }, [selectedLayer1, selectedLayer2]);

  const onFormSubmit = () => {
    if (!selectedLayer1 || !selectedLayer2) {
      alert("Please select two layers");
      return false;
    };
    const outLayer: FeatureCollectionPolygon = {
      type: "FeatureCollection",
      features: [],
    };
    const layer1 = selectedLayer1.featureCollection as FeatureCollectionPolygon;
    const layer2 = selectedLayer2.featureCollection as FeatureCollectionPolygon;
    layer1.features.forEach((feature1) => {
      layer2.features.forEach((feature2) => {
        const result = intersect({type:"FeatureCollection",features:[feature1, feature2]});
        if (result) {
          outLayer.features.push(result);
        }
      });
    });
    if (!outLayer) {
      alert("No results found");
      return false;
    }
    addLayer({
      featureCollection: outLayer,
      name: newLayerName,
    })
    return true;
  }

  return (
    <ToolModal buttonLabel="Intersect" onFormSubmit={onFormSubmit}>
      selected layer1: {selectedLayer1?.name}
      <select name="layer1" id="" required value={selectedLayer1?.id} onChange={(e)=>setSelectedLayer1(layers.find((layer) => layer.id === e.target.value))}>
        <option value={undefined}>Select a layer</option>
        {layers
          .filter((layer)=>layer.renderingType === "fill")
          .map((layer) => (
            <option key={layer.id} value={layer.id}>{layer.name}</option>
        ))}
      </select>

      selected layer2: {selectedLayer2?.name}
      <select name="layer1" id="" required value={selectedLayer2?.id} onChange={(e)=>setSelectedLayer2(layers.find((layer) => layer.id === e.target.value))}>
        <option value={undefined}>Select a layer</option>
        {layers
          .filter((layer)=>layer.renderingType === "fill" && layer.id !== selectedLayer1?.id) // don't choose the same layer twice
          .map((layer) => (
            <option key={layer.id} value={layer.id}>{layer.name}</option>
          ))
        }
      </select>

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default IntersectTool;