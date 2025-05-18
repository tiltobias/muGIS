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
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer[0]) {
      setNewLayerName(`voronoi(${selectedLayer[0].name})`);
    }
  }, [selectedLayer]);

  const onFormSubmit = () => {
    if (!selectedLayer[0]) {
      alert("Please select a layer");
      return false;
    };
    const layer = flatten(selectedLayer[0].featureCollection) as FeatureCollection<Point>;
    const result = voronoi(layer, {bbox: bbox(layer)}) as FeatureCollectionPolygon;
    if (!result || result.features.length === 0) {
      alert("No results found");
      return false;
    }
    result.features = result.features.filter((feature) =>feature.geometry.type === "Polygon"); // filter out null geometries
    addLayer({
      featureCollection: result,
      name: newLayerName,
    })
    return true;
  }

  return (
    <ToolModal buttonLabel="Voronoi" onFormSubmit={onFormSubmit} buttonIcon={<VoronoiIcon />}>
      
      select layer: 
      <SelectLayer 
        selectedLayers={selectedLayer} 
        setSelectedLayers={setSelectedLayer} 
        renderingType="circle"
      />
      
      
      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default VoronoiTool;