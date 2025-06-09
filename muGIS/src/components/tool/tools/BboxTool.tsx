import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData } from '../../../hooks/useLayerStore';
import { bbox } from '@turf/bbox';
import ToolModal from '../ToolModal';
import { Feature, Polygon, MultiPolygon } from 'geojson';
import { bboxPolygon } from '@turf/bbox-polygon';
import SelectLayer from '../SelectLayer';
import { BboxIcon } from '../../icons';

const BboxTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayers, setSelectedLayers] = useState<LayerData[]>([]);
  const [newLayerName, setNewLayerName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayers && selectedLayers.length >= 1) {
      let inNames = selectedLayers[0].name;
      for (let i = 1; i < selectedLayers.length; i++) {
        inNames += `, ${selectedLayers[i].name}`;
      }
      setNewLayerName(`bbox(${inNames})`);
    }
  }, [selectedLayers]);

  const onFormSubmit = () => {
    if (!selectedLayers || selectedLayers.length < 1) {
      setErrorMessage("Please select one or more layers");
      return false;
    };
    const features = selectedLayers.flatMap(layer => layer.featureCollection.features) as Feature<Polygon | MultiPolygon>[];
    const result = bboxPolygon(bbox({
      type:"FeatureCollection",
      features: features,
    }));
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

  const description = "Create a bounding box polygon from one or more layers. The output will be a polygon layer containing the bounding box of all the selected geometries.";

  return (
    <ToolModal buttonLabel="Bbox" onFormSubmit={onFormSubmit} buttonIcon={<BboxIcon />} description={description} errorMessage={errorMessage}>

      <span className="toolInputLabel">Select one or more layers:</span>
      <SelectLayer 
        selectedLayers={selectedLayers} 
        setSelectedLayers={setSelectedLayers}
        multiple
      />

      <label htmlFor="outputLayerName">Output Layer Name:</label>
      <input id="outputLayerName" type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default BboxTool;