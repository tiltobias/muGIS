import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { intersect } from '@turf/intersect';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';

const IntersectTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer1, setSelectedLayer1] = useState<LayerData | undefined>(undefined);
  const [selectedLayer2, setSelectedLayer2] = useState<LayerData | undefined>(undefined);
  const [selectedLayer3, setSelectedLayer3] = useState<LayerData | undefined>(undefined);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer1 && selectedLayer2) {
      setNewLayerName(`intersect: ${selectedLayer1.name} & ${selectedLayer2.name}`);
    }
  }, [selectedLayer1, selectedLayer2]);

  const onFormSubmit = () => {
    if (!selectedLayer1 || !selectedLayer2 || !selectedLayer3) {
      alert("Please select two layers");
      return false;
    };
    const outLayer: FeatureCollectionPolygon = {
      type: "FeatureCollection",
      features: [],
    };
    const layer1 = selectedLayer1.featureCollection as FeatureCollectionPolygon;
    const layer2 = selectedLayer2.featureCollection as FeatureCollectionPolygon;
    const layer3 = selectedLayer3.featureCollection as FeatureCollectionPolygon;
    layer1.features.forEach((feature1) => {
      layer2.features.forEach((feature2) => {
        layer3.features.forEach((feature3) => {
          const result = intersect({type:"FeatureCollection",features:[feature1, feature2, feature3]});
          if (result) {
            outLayer.features.push(result);
          }
        });
      });
    });
    if (!outLayer || outLayer.features.length === 0) {
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

      selected layer3: {selectedLayer3?.name}
      <SelectLayer
        selectedLayer={selectedLayer3} 
        setSelectedLayer={setSelectedLayer3} 
        renderingType="fill"
        unselectableLayerIds={[selectedLayer1?.id, selectedLayer2?.id]}
      />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default IntersectTool;