import { FC, useState, useRef, useEffect } from 'react';
import useLayerStore, { LayerData, LayerRenderingType } from '../../hooks/useLayerStore';
import LayerOption from './LayerOption';
import './SelectLayers.css'
import useClickOutside from '../../hooks/useClickOutside';

interface SelectLayersProps {
  selectedLayers: LayerData[];
  setSelectedLayers: React.Dispatch<React.SetStateAction<LayerData[]>>;
  renderingType?: LayerRenderingType;
  multiple?: boolean;
  unselectableLayerIds?: (string | undefined)[];
}

const SelectLayers: FC<SelectLayersProps> = ({ 
  selectedLayers, 
  setSelectedLayers,
  renderingType = undefined,
  multiple = false,
  unselectableLayerIds = [],
}) => {
  const {
    layers,
  } = useLayerStore();

  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const selectLayersRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(selectLayersRef, ()=>{setSelectOpen(false)});

  useEffect(() => {
    if (selectLayersRef.current && popoverRef.current) {
      popoverRef.current?.style.setProperty('max-height', `${window.innerHeight - selectLayersRef.current?.getBoundingClientRect().bottom - 10}px`);
      popoverRef.current?.style.setProperty('width', `${selectLayersRef.current?.getBoundingClientRect().width}px`);
      popoverRef.current?.style.setProperty('top', `${selectLayersRef.current?.getBoundingClientRect().bottom + window.scrollY}px`);
    }
  }, [selectOpen, selectedLayers]);

  useEffect(() => {
    selectedLayers.forEach((layer) => {
      if (unselectableLayerIds.includes(layer.id)) {
        setSelectedLayers((old) => old.filter((selectedLayer) => selectedLayer.id !== layer.id));
      }
    });
  }, [unselectableLayerIds, selectedLayers, setSelectedLayers]);

  return (
    <div className="selectLayersContainer" ref={selectLayersRef} onClick={()=>{setSelectOpen(!selectOpen)}}>
      <ol className="selectedList">
        {selectedLayers.length === 0 ? 
          (
            <p>No layer selected</p>
          ) : 
          layers.map((layer, index) => {
            if (renderingType && layer.renderingType !== renderingType) return null;
            if (!selectedLayers.some((selectedLayer) => selectedLayer.id === layer.id)) return null;
            return (
              <li key={layer.id}>
                <LayerOption
                  name={layer.name}
                  type={layer.renderingType}
                  index={index}
                  color={layer.color}
                  onRemove={() => {
                    setSelectedLayers((old) => old.filter((selectedLayer) => selectedLayer.id !== layer.id));
                  }}
                />
              </li>
            );
          })
        }
      </ol>

      {selectOpen && (
        <div className="selectListContainer" onClick={(e)=>{if (multiple) e.stopPropagation()}} ref={popoverRef}>
          <h4>Select Layers</h4>
          <ol className="selectList">
            {layers.map((layer, index) => {
              if (renderingType && layer.renderingType !== renderingType) return null;
              if (selectedLayers.some((selectedLayer) => selectedLayer.id === layer.id)) return null;
              if (unselectableLayerIds.includes(layer.id)) return null;
              return (
                <li 
                  key={layer.id} 
                  className="selectListItem"
                  onClick={()=>{
                    if (multiple) {
                      setSelectedLayers((old)=>[...old, layer])  
                    } else {
                      setSelectedLayers([layer]);
                    }
                  }}
                >
                  <LayerOption
                    name={layer.name}
                    type={layer.renderingType}
                    index={index}
                    color={layer.color}
                  />
                </li>
              );
            }) || <p>No layers available</p>
            }
          </ol>
        </div>
      )}
    </div>
  );
}
export default SelectLayers;