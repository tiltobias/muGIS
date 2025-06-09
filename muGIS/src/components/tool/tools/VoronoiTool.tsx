import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { voronoi } from '@turf/voronoi';
import ToolModal from '../ToolModal';
import SelectLayer from '../SelectLayer';
import { FeatureCollection, Point } from 'geojson';
import { flatten } from '@turf/flatten';
import { bbox } from '@turf/bbox';
import { VoronoiIcon } from '../../icons';

const VoronoiTool: FC = () => {

  const {
    addLayer,
  } = useLayerStore();

  const [selectedLayer, setSelectedLayer] = useState<LayerData[]>([]);
  const [bboxEnabled, setBboxEnabled] = useState<boolean>(false);
  const [selectedBboxLayer, setSelectedBboxLayer] = useState<LayerData[]>([]);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer[0]) {
      if (bboxEnabled && selectedBboxLayer[0]) {
        setNewLayerName(`voronoi(${selectedLayer[0].name}, ${selectedBboxLayer[0].name})`);
      } else {
        setNewLayerName(`voronoi(${selectedLayer[0].name})`);
      }
    }
  }, [selectedLayer, selectedBboxLayer, bboxEnabled]);

  const onFormSubmit = () => {
    if (!selectedLayer[0]) {
      alert("Please select a layer");
      return false;
    };
    const layer = flatten(selectedLayer[0].featureCollection) as FeatureCollection<Point>;
    const bboxBase = bboxEnabled && selectedBboxLayer[0] ? flatten(selectedBboxLayer[0].featureCollection) as FeatureCollection : layer;
    const result = voronoi(layer, {bbox: bbox(bboxBase)}) as FeatureCollectionPolygon;
    if (!result || result.features.length === 0) {
      alert("No results found");
      return false;
    }
    result.features = result.features.filter((feature) =>feature.geometry.type === "Polygon"); // filter out null geometries
    addLayer({
      featureCollection: result,
      name: newLayerName,
      outline: true,
    })
    return true;
  }

  return (
    <ToolModal buttonLabel="Voronoi" onFormSubmit={onFormSubmit} buttonIcon={<VoronoiIcon />}>
      
      <span className="toolInputLabel">Select a point layer:</span>
      <SelectLayer 
        selectedLayers={selectedLayer} 
        setSelectedLayers={setSelectedLayer} 
        renderingType="circle"
      />
      
      <span className={bboxEnabled ? "toolInputLabel" : ""}>
        <input type="checkbox" checked={bboxEnabled} onChange={(e)=>setBboxEnabled(e.target.checked)} id="checkboxPropertyEnabled" />

        <label htmlFor="checkboxPropertyEnabled">Use custom bounding box{bboxEnabled && ":"}</label>
      </span>
      {bboxEnabled && 
        <SelectLayer 
          selectedLayers={selectedBboxLayer} 
          setSelectedLayers={setSelectedBboxLayer} 
        />
      }

      <label htmlFor="outputLayerName">Output Layer Name:</label>
      <input id="outputLayerName" type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default VoronoiTool;