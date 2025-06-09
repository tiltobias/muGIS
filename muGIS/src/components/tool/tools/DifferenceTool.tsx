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

  const description = "Create a difference of two polygon layers. The output will be a polygon layer containing the geometries from the first layer that do not intersect with the second layer.";

  return (
    <ToolModal buttonLabel="Difference" onFormSubmit={onFormSubmit} buttonIcon={<DifferenceIcon />} description={description}>

      <span className="toolInputLabel">Select a polygon layer:</span>
      <SelectLayer 
        selectedLayers={selectedLayer1} 
        setSelectedLayers={setSelectedLayer1} 
        renderingType="fill"
      />

      <span className="toolInputLabel">Select polygon layer to subtract:</span>
      <SelectLayer 
        selectedLayers={selectedLayer2} 
        setSelectedLayers={setSelectedLayer2} 
        renderingType="fill"
        unselectableLayerIds={[selectedLayer1[0]?.id]}
      />

      <label htmlFor="outputLayerName">Output Layer Name:</label>
      <input id="outputLayerName" type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default DifferenceTool;