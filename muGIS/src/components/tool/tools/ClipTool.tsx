import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { difference } from '@turf/difference';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { combine } from '@turf/combine';

const ClipTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer1, setSelectedLayer1] = useState<LayerData | undefined>(undefined);
  const [selectedLayer2, setSelectedLayer2] = useState<LayerData | undefined>(undefined);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer1 && selectedLayer2) {
      setNewLayerName(`clip: ${selectedLayer1.name} - ${selectedLayer2.name}`);
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
    const layerBase = selectedLayer1.featureCollection as FeatureCollectionPolygon;
    const layerSubtract = selectedLayer2.featureCollection as FeatureCollectionPolygon;
    const subtractPolygon = (combine(layerSubtract) as FeatureCollectionPolygon).features[0];
    layerBase.features.forEach((feature) => {
      const result = difference({type:"FeatureCollection",features:[feature, subtractPolygon]});
      if (result) {
          outLayer.features.push(result);
      }
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
    <ToolModal buttonLabel="Clip" onFormSubmit={onFormSubmit}>
      
      selected base layer: {selectedLayer1?.name}
      <SelectLayer 
        selectedLayer={selectedLayer1} 
        setSelectedLayer={setSelectedLayer1} 
        renderingType="fill"
      />

      selected layer to subtract: {selectedLayer2?.name}
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
export default ClipTool;