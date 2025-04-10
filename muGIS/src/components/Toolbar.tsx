import { FC, useState, useEffect } from 'react';
// import "./Toolbar.css";
import useLayerStore, { LayerData, LayerOption, FeatureCollectionPolygon } from '../hooks/useLayerStore';
import { intersect } from '@turf/intersect';
import ToolModal from './tools/ToolModal';
import PolygonTool from './tools/PolygonTool';

interface ToolbarProps {
  test?: string;
}

const Toolbar:FC<ToolbarProps> = () => {
  
  const {
    layers,
    addLayer,
  } = useLayerStore();

  const [polygonLayers, setPolygonLayers] = useState<LayerOption[]>([]);
  // useEffect(() => {
  //   setPolygonLayers(
  //     layers
  //       .filter((layer)=>layer.renderingType === "fill")
  //       .map(({ id, name, renderingType }) => ({ id, name, renderingType }))
  //   );
  // }, [layers]);

  const [selectedLayer1, setSelectedLayer1] = useState<LayerData | null>(null);
  const [selectedLayer2, setSelectedLayer2] = useState<LayerData | null>(null);
  const [newLayerName, setNewLayerName] = useState<string>("");

  // Update the new layer name when the selected layers change
  useEffect(() => {
    if (selectedLayer1 && selectedLayer2) {
      setNewLayerName(`intersect: ${selectedLayer1.name} & ${selectedLayer2.name}`);
    }
  }, [selectedLayer1, selectedLayer2]);

  const onFormSubmit = () => {
    if (!selectedLayer1 || !selectedLayer2) {
      alert("Please select two layers");
      return false;
    };
    const outLayer: FeatureCollectionPolygon = {
      type: "FeatureCollection",
      features: [],
    };
    const layer1 = selectedLayer1.featureCollection as FeatureCollectionPolygon;
    const layer2 = selectedLayer2.featureCollection as FeatureCollectionPolygon;
    layer1.features.forEach((feature1) => {
      layer2.features.forEach((feature2) => {
        const intersection = intersect({type:"FeatureCollection",features:[feature1, feature2]});
        if (intersection) {
          outLayer.features.push(intersection);
        }
      });
    });
    if (!outLayer) {
      alert("No intersection found");
      return false;
    }
    addLayer({
      featureCollection: outLayer,
      name: newLayerName,
    })
    return true;
  }

  return (
    <ToolModal buttonLabel="Intersect" onFormSubmit={onFormSubmit}> 
      <PolygonTool setPolygonLayers={setPolygonLayers} />
      selected layer1: {selectedLayer1?.name}
      <select name="layer1" id="" required value={selectedLayer1?.id} onChange={(e)=>{
        const layer = layers.find((layer) => layer.id === e.target.value);
        if (layer) {
          setSelectedLayer1(layer);
        } else {
          setSelectedLayer1(null);
        }
      }}>
        <option value={undefined}>Select a layer</option>
        {polygonLayers.map((layer) => (
          <option key={layer.id} value={layer.id}>{layer.name}</option>
        ))}
      </select>

      selected layer2: {selectedLayer2?.name}
      <select name="layer1" id="" required value={selectedLayer2?.id} onChange={(e)=>{
        const layer = layers.find((layer) => layer.id === e.target.value);
        if (layer) {
          setSelectedLayer2(layer);
        } else {
          setSelectedLayer2(null);
        }
      }}>
        <option value={undefined}>Select a layer</option>
        {polygonLayers
          .filter((layer) => layer.id !== selectedLayer1?.id) // don't choose the same layer twice
          .map((layer) => (
            <option key={layer.id} value={layer.id}>{layer.name}</option>
        ))}
      </select>

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  )
}

export default Toolbar;