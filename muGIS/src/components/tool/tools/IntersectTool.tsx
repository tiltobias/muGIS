import { FC, useState, useEffect } from 'react';
import useLayerStore, { LayerData, FeatureCollectionPolygon } from '../../../hooks/useLayerStore';
import { intersect } from '@turf/intersect';
import ToolModal from '../ToolModal';
import ReactSelect from 'react-select';

const IntersectTool: FC = () => {

  const {
    layers,
    addLayer,
  } = useLayerStore();

  const [selectedLayers, setSelectedLayers] = useState<LayerData[] | undefined>(undefined);
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
    <ToolModal buttonLabel="Intersect" onFormSubmit={onFormSubmit}>
      
      <ReactSelect 
        isMulti={true}
        options={
          layers
            .filter(layer => layer.renderingType === "fill")
            .map(layer => ({value: layer.id, label: layer.name, color: layer.color}))
        }
        value={selectedLayers?.map(layer => ({value: layer.id, label: layer.name, color: layer.color}))}
        onChange={selectedOptions=>setSelectedLayers(selectedOptions?.map(option=>layers.find(layer=>layer.id===option.value)) as LayerData[])}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "none",
            "&:hover": {
              border: "1px solid #aaa",
            },
          }),
          multiValue: (base, state) => {
            return { ...base, backgroundColor: `hsl(${state.data.color.h},${state.data.color.s}%,${state.data.color.l}%)`, opacity: state.isFocused ? 0.8 : 1, };
          },
          option: (base, state) => {
            return {
              ...base,
              backgroundColor: `hsl(${state.data.color.h},${state.data.color.s}%,${state.data.color.l}%)`,
              opacity: state.isFocused ? 0.8 : 1,
              color: "white",
            };
          },
        }}
      />

      <input type="text" value={newLayerName} onChange={(e)=>setNewLayerName(e.target.value)} />
    </ToolModal>
  );
}
export default IntersectTool;