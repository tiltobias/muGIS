import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { union } from '@turf/union';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';

const UnionTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer1, setSelectedLayer1] = useState<LayerData | undefined>(undefined);
  const [selectedLayer2, setSelectedLayer2] = useState<LayerData | undefined>(undefined);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer1 && selectedLayer2) {
      setNewLayerName(`union: ${selectedLayer1.name} & ${selectedLayer2.name}`);
    }
  }, [selectedLayer1, selectedLayer2]);

  const onFormSubmit = () => {
    if (!selectedLayer1 || !selectedLayer2) {
      alert("Please select two layers");
      return false;
    };
    const layer1 = selectedLayer1.featureCollection as FeatureCollectionPolygon;
    const layer2 = selectedLayer2.featureCollection as FeatureCollectionPolygon;
    const result = union({
      type:"FeatureCollection",
      features: [...layer1.features, ...layer2.features],
    });
    if (!result) {
      alert("No results found");
      return false;
    }
    addLayer({
      featureCollection: {
        type: "FeatureCollection",
        features: [result],
      },
      name: newLayerName,
    })
    return true;
  }

  return (
    <ToolModal buttonLabel="Union" onFormSubmit={onFormSubmit}>
      
      selected layer1: {selectedLayer1?.name}
      <SelectLayer 
        selectedLayer={selectedLayer1} 
        setSelectedLayer={setSelectedLayer1} 
        renderingType="fill"
      />

      selected layer2: {selectedLayer2?.name}
      <SelectLayer
        selectedLayer={selectedLayer2} 
        setSelectedLayer={setSelectedLayer2} 
        renderingType="fill"
        unselectableLayerIds={[selectedLayer1?.id]}
      />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default UnionTool;