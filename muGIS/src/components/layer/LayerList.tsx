import { FC, useState } from 'react';
import useLayerStore from '../../hooks/useLayerStore';
import Layer from './Layer';
import './LayerList.css';

interface LayerListProps {
  test?: string;
}

const LayerList: FC<LayerListProps> = () => {
  const {
    layers,
    moveLayerUp,
    moveLayerDown,
  } = useLayerStore();

  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, layerId: string) => {
    setDraggingLayerId(layerId);
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Hide the default drag image
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, layerId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move'; 
    if (draggingLayerId === null || draggingLayerId === layerId) return;
    if (layers.findIndex(layer => layer.id === draggingLayerId) < layers.findIndex(layer => layer.id === layerId)) {
      moveLayerDown(draggingLayerId);
    } else {
      moveLayerUp(draggingLayerId);
    }
  };

  const handleDrop = () => {
    setDraggingLayerId(null);
  }


  return (
    <ol className="layerList">
      {layers.map((layer, index) => (
        <li 
          key={layer.id} 
          draggable 
          className="layerListItem"
          onDragStart={(e)=>handleDragStart(e, layer.id)}
          onDragOver={(e)=>handleDragOver(e, layer.id)}
          onDrop={handleDrop}
        >
          <Layer 
            layerData={layer} 
            layerAboveId={index === 0 ? undefined : layers[index-1].id}
          />
        </li>
      ))}
    </ol>
  );
};

export default LayerList;