import { FC } from 'react';
import { LayerRenderingType } from '../../hooks/useLayerStore';
import { HslaColor } from '../layer/ColorPicker';
import { LayerPointIcon, LayerLineIcon, LayerPolygonIcon } from '../icons';
import { SquareX } from 'lucide-react';

interface LayerOptionProps {
  name: string;
  type: LayerRenderingType;
  index: number;
  color: HslaColor;
  onRemove?: () => void;
}

const LayerOption: FC<LayerOptionProps> = ({ name, type, index, color, onRemove }) => {
  return (
    <div className="layerItem">
      <span className="layerIndex">{index+1}.</span>
      <div 
        className="colorPickerButton" 
        style={{
          color: `hsl(${color.h},${color.s}%,${color.l}%)`
        }}
      >
        {type === 'circle' && <LayerPointIcon />}
        {type === 'line' && <LayerLineIcon />}
        {type === 'fill' && <div className="polygonShrinker"><LayerPolygonIcon /></div>}
      </div>
      <div className="layerName">
        <span>{name}</span>
      </div>
      {onRemove && (
        <button 
          type="button" 
          onClick={(e)=>{
            onRemove();
            e.stopPropagation();
          }}
        >
          <SquareX />
        </button>
      )}
    </div>
  );
};

export default LayerOption;