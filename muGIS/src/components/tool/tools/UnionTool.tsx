import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData } from '../../../hooks/useLayerStore';
import { union } from '@turf/union';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { Feature, Polygon, MultiPolygon } from 'geojson';
import { UnionIcon } from '../../icons';

const UnionTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayers, setSelectedLayers] = useState<LayerData[]>([]);
  const [newLayerName, setNewLayerName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      setErrorMessage("Please select two layers");
      return false;
    };
    const features = selectedLayers.flatMap(layer => layer.featureCollection.features) as Feature<Polygon | MultiPolygon>[];
    const result = union({
      type:"FeatureCollection",
      features: features,
    });
    if (!result) {
      setErrorMessage("No results found");
      return false;
    }
    addLayer({
      featureCollection: {
        type: "FeatureCollection",
        features: [result],
      },
      name: newLayerName,
    })
    setSelectedLayers([]);
    setNewLayerName("");
    setErrorMessage("");
    return true;
  }

  const description = "Create a union of two or more polygon layers. The output will be a polygon layer containing the union of all the geometries.";

  return (
    <ToolModal buttonLabel="Union" onFormSubmit={onFormSubmit} buttonIcon={<UnionIcon />} description={description} errorMessage={errorMessage}>

      <span className="toolInputLabel">Select two or more polygon layers:</span>
      <SelectLayer 
        selectedLayers={selectedLayers} 
        setSelectedLayers={setSelectedLayers}
        renderingType="fill"
        multiple
      />

      <label htmlFor="outputLayerName">Output Layer Name:</label>
      <input id="outputLayerName" type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default UnionTool;