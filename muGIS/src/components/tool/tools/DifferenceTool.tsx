import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { difference } from '@turf/difference';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { combine } from '@turf/combine';
import { DifferenceIcon } from '../../icons';

const DifferenceTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer1, setSelectedLayer1] = useState<LayerData[]>([]);
  const [selectedLayer2, setSelectedLayer2] = useState<LayerData[]>([]);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer1[0] && selectedLayer2[0]) {
      setNewLayerName(`difference(${selectedLayer1[0].name}, ${selectedLayer2[0].name})`);
    }
  }, [selectedLayer1, selectedLayer2]);

  const onFormSubmit = () => {
    if (!selectedLayer1[0] || !selectedLayer2[0]) {
      alert("Please select two layers");
      return false;
    };
    const outLayer: FeatureCollectionPolygon = {
      type: "FeatureCollection",
      features: [],
    };
    const layerBase = selectedLayer1[0].featureCollection as FeatureCollectionPolygon;
    const layerSubtract = selectedLayer2[0].featureCollection as FeatureCollectionPolygon;
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
    <ToolModal buttonLabel="Difference" onFormSubmit={onFormSubmit} buttonIcon={<DifferenceIcon />}>
      
      select base layer: 
      <SelectLayer 
        selectedLayers={selectedLayer1} 
        setSelectedLayers={setSelectedLayer1} 
        renderingType="fill"
      />

      select layer to subtract: 
      <SelectLayer 
        selectedLayers={selectedLayer2} 
        setSelectedLayers={setSelectedLayer2} 
        renderingType="fill"
        unselectableLayerIds={[selectedLayer1[0]?.id]}
      />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default DifferenceTool;