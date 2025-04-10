import { FC, useEffect } from 'react';
import { LayerOption } from '../../hooks/useLayerStore';
import useLayerStore from '../../hooks/useLayerStore';

interface PolygonToolProps {
  // polygonLayers: LayerOption[];
  setPolygonLayers: React.Dispatch<React.SetStateAction<LayerOption[]>>;
}

const PolygonTool: FC<PolygonToolProps> = ({ setPolygonLayers }) => {

  const {
    layers,
  } = useLayerStore();

  useEffect(() => {
    setPolygonLayers(
      layers
        .filter((layer)=>layer.renderingType === "fill")
        .map(({ id, name, renderingType }) => ({ id, name, renderingType }))
    );
  }, [layers, setPolygonLayers]);

  return (
    <>

    </>
  )
}
export default PolygonTool;