import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { intersect } from '@turf/intersect';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { pointsWithinPolygon } from '@turf/points-within-polygon';
import { FeatureCollection, Point, MultiPoint } from 'geojson';

const ClipTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedMaskLayer, setSelectedMaskLayer] = useState<LayerData | undefined>(undefined);
  const [selectedLayer, setSelectedLayer] = useState<LayerData | undefined>(undefined);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedMaskLayer && selectedLayer) {
      setNewLayerName(`clip(${selectedLayer.name}, ${selectedMaskLayer.name})`);
    }
  }, [selectedLayer, selectedMaskLayer]);

  const onFormSubmit = () => {
    if (!selectedMaskLayer || !selectedLayer) {
      alert("Please select two layers");
      return false;
    };
    let outLayer = {
      type: "FeatureCollection",
      features: [],
    } as FeatureCollection;
    
    if (selectedLayer.renderingType === "circle") {
      outLayer = pointsWithinPolygon(
        selectedLayer.featureCollection as FeatureCollection<Point|MultiPoint>, 
        selectedMaskLayer.featureCollection as FeatureCollectionPolygon);
    } else if (selectedLayer.renderingType === "fill") {
      const maskLayer = selectedMaskLayer.featureCollection as FeatureCollectionPolygon;
      const layer = selectedLayer.featureCollection as FeatureCollectionPolygon;
      maskLayer.features.forEach((maskFeature) => {
        layer.features.forEach((feature) => {
          const result = intersect({type:"FeatureCollection",features:[feature, maskFeature]});
          if (result) {
            outLayer.features.push(result);
          }
        });
      });
    } else if (selectedLayer.renderingType === "line") {
      throw new Error("Line clipping is not supported yet");
    } else {
      throw new Error("Unknown rendering type");
    }


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
      
      selected layer: {selectedLayer?.name}
      <SelectLayer 
        selectedLayer={selectedLayer} 
        setSelectedLayer={setSelectedLayer} 
      />

      selected mask layer: {selectedMaskLayer?.name}
      <SelectLayer
        selectedLayer={selectedMaskLayer} 
        setSelectedLayer={setSelectedMaskLayer} 
        renderingType="fill"
        unselectableLayerIds={[selectedLayer?.id]}
      />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default ClipTool;