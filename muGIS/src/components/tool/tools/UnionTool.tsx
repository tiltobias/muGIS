import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData } from '../../../hooks/useLayerStore';
import { union } from '@turf/union';
import ToolModal from '../ToolModal';
import SelectLayers from '../SelectLayers';
import { Feature, Polygon, MultiPolygon } from 'geojson';

const UnionTool: FC = () => {

  const {
    // layers,
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
      setNewLayerName(`union(${inNames})`);
    }
  }, [selectedLayers]);

  const onFormSubmit = () => {
    if (!selectedLayers || selectedLayers.length < 2) {
      alert("Please select two layers");
      return false;
    };
    const features = selectedLayers.flatMap(layer => layer.featureCollection.features) as Feature<Polygon | MultiPolygon>[];
    const result = union({
      type:"FeatureCollection",
      features: features,
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
      
      selected layers: {selectedLayers?.map(layer => layer.name).join(", ")}
      <SelectLayers 
        selectedLayers={selectedLayers} 
        setSelectedLayers={setSelectedLayers}
        renderingType="fill"
      />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default UnionTool;