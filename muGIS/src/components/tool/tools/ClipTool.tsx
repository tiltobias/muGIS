import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { intersect } from '@turf/intersect';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { pointsWithinPolygon } from '@turf/points-within-polygon';
import { FeatureCollection, Point, MultiPoint, LineString, MultiLineString, Feature, Polygon } from 'geojson';
import { lineSplit } from '@turf/line-split';
import { booleanWithin } from '@turf/boolean-within';
import { flatten } from '@turf/flatten';
import { buffer } from '@turf/buffer';
import { ClipIcon } from '../../icons';

const ClipTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedMaskLayer, setSelectedMaskLayer] = useState<LayerData[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<LayerData[]>([]);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedMaskLayer[0] && selectedLayer[0]) {
      setNewLayerName(`clip(${selectedLayer[0].name}, ${selectedMaskLayer[0].name})`);
    }
  }, [selectedLayer, selectedMaskLayer]);

  const onFormSubmit = () => {
    if (!selectedMaskLayer[0] || !selectedLayer[0]) {
      alert("Please select two layers");
      return false;
    };
    let outLayer = {
      type: "FeatureCollection",
      features: [],
    } as FeatureCollection;
    
    if (selectedLayer[0].renderingType === "circle") {
      outLayer = pointsWithinPolygon(
        selectedLayer[0].featureCollection as FeatureCollection<Point|MultiPoint>, 
        selectedMaskLayer[0].featureCollection as FeatureCollectionPolygon);
    } else if (selectedLayer[0].renderingType === "fill") {
      const maskLayer = selectedMaskLayer[0].featureCollection as FeatureCollectionPolygon;
      const layer = selectedLayer[0].featureCollection as FeatureCollectionPolygon;
      maskLayer.features.forEach((maskFeature) => {
        layer.features.forEach((feature) => {
          const result = intersect({type:"FeatureCollection",features:[feature, maskFeature]});
          if (result) {
            outLayer.features.push(result);
          }
        });
      });
    } else if (selectedLayer[0].renderingType === "line") {
      const maskLayer: FeatureCollection<Polygon> = flatten(selectedMaskLayer[0].featureCollection as FeatureCollectionPolygon);
      const layer: FeatureCollection<LineString> = flatten(selectedLayer[0].featureCollection as FeatureCollection<LineString|MultiLineString>);
      maskLayer.features.forEach((maskFeature) => {
        const maskBuffer = buffer(maskFeature, 0.01, { units: "meters" }) as Feature<Polygon>;
        layer.features.forEach((line) => {
          if (booleanWithin(line, maskBuffer)) {
            outLayer.features.push(line);
          } else {
            const split = lineSplit(line, maskFeature);
            split.features.forEach((splitLine) => {
              if (booleanWithin(splitLine, maskBuffer)) {
                outLayer.features.push(splitLine);
              }
            });
          };
        });
      });
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

  const description = "Clip any type of layer with a polygon layer. The output will be a layer of the same type containing only the features that are within the clip layer.";

  return (
    <ToolModal buttonLabel="Clip" onFormSubmit={onFormSubmit} buttonIcon={<ClipIcon />} description={description}>

      <span className="toolInputLabel">Select layer:</span>
      <SelectLayer 
        selectedLayers={selectedLayer} 
        setSelectedLayers={setSelectedLayer} 
      />

      <span className="toolInputLabel">Select polygon layer to clip with:</span>
      <SelectLayer 
        selectedLayers={selectedMaskLayer} 
        setSelectedLayers={setSelectedMaskLayer} 
        renderingType="fill"
        unselectableLayerIds={[selectedLayer[0]?.id]}
      />

      <label htmlFor="outputLayerName">Output Layer Name:</label>
      <input id="outputLayerName" type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default ClipTool;