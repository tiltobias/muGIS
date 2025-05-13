import { FC, useState } from 'react';
import useLayerStore, { LayerData, LayerRenderingType } from '../../hooks/useLayerStore';
import LayerOption from './LayerOption';
import './SelectLayers.css'

interface SelectLayersProps {
  selectedLayers: LayerData[];
  setSelectedLayers: React.Dispatch<React.SetStateAction<LayerData[]>>;
  renderingType?: LayerRenderingType;
}

const SelectLayers: FC<SelectLayersProps> = ({ 
  // selectedLayers, 
  // setSelectedLayers,
  renderingType = undefined,
}) => {
  const {
    layers,
  } = useLayerStore();

  const [selectOpen, setSelectOpen] = useState<boolean>(false);

  return (
    <div>
      <ul className="selectedList">

      </ul>
      <button type="button" className="addLayerButton" onClick={() => setSelectOpen(!selectOpen)}>
        Add Layer
      </button>
      {selectOpen && (
        <div className="layerListContainer">
          <ol className="selectList">
            {layers.map((layer, index) => {
              if (renderingType && layer.renderingType !== renderingType) return null;
              return (
                <li key={layer.id} className="selectListItem">
                  <LayerOption
                    name={layer.name}
                    type={layer.renderingType}
                    index={index}
                    color={layer.color}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
export default SelectLayers;