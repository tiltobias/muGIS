import { FC } from 'react';
import useLayerStore, { LayerData, LayerRenderingType } from '../../hooks/useLayerStore';

interface SelectLayerProps {
  selectedLayer: LayerData | undefined;
  setSelectedLayer: React.Dispatch<React.SetStateAction<LayerData | undefined>>;
  renderingType?: LayerRenderingType;
  unselectableLayerIds?: (string | undefined)[];
}

const SelectLayer: FC<SelectLayerProps> = ({ 
  selectedLayer, 
  setSelectedLayer, 
  renderingType = undefined,
  unselectableLayerIds = [],
}) => {
  const {
    layers,
  } = useLayerStore();

  return (
    <select name="layer1" id="" required value={selectedLayer?.id} onChange={(e)=>setSelectedLayer(layers.find((layer) => layer.id === e.target.value))}>
      <option value={undefined}>Select a layer1</option>
      {layers
        .filter((layer) => renderingType ? layer.renderingType === renderingType : true) // filter by rendering type if provided
        .filter((layer) => !unselectableLayerIds.includes(layer.id)) // filter out unselectable layers
        .map((layer) => (
          <option key={layer.id} value={layer.id}>{layer.name}</option>
      ))}
    </select>
  );
}

export default SelectLayer;