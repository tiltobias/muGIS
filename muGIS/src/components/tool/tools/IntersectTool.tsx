import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { intersect } from '@turf/intersect';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { IntersectIcon } from '../../icons';

const IntersectTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayers, setSelectedLayers] = useState<LayerData[]>([]);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayers && selectedLayers.length >= 2) {
      let inNames = selectedLayers[0].name;
      for (let i = 1; i < selectedLayers.length; i++) {
        inNames += `, ${selectedLayers[i].name}`;
      }
      setNewLayerName(`intersect(${inNames})`);
    }
  }, [selectedLayers]);

  const onFormSubmit = () => {
    if (!selectedLayers || selectedLayers.length < 2) {
      alert("Please select two layers");
      return false;
    };
    const outLayer: FeatureCollectionPolygon = {
      type: "FeatureCollection",
      features: (selectedLayers[0].featureCollection as FeatureCollectionPolygon).features,
    };
    for (let i = 1; i < selectedLayers.length; i++) {
      const currentLayer = selectedLayers[i].featureCollection as FeatureCollectionPolygon;
      const results: FeatureCollectionPolygon["features"] = [];
      outLayer.features.forEach((feature) => {
        currentLayer.features.forEach((currentFeature) => {
          const result = intersect({type:"FeatureCollection",features:[feature, currentFeature]});
          if (result) {
            results.push(result);
          }
        });
      });
      outLayer.features = results;
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
    <ToolModal buttonLabel="Intersect" onFormSubmit={onFormSubmit} buttonIcon={<IntersectIcon />}>
      
      <SelectLayer 
        selectedLayers={selectedLayers} 
        setSelectedLayers={setSelectedLayers}
        renderingType="fill"
        multiple
      />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default IntersectTool;