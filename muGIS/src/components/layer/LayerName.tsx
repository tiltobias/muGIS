import { FC, useState, useRef, useEffect } from 'react';
import useLayerStore from '../../hooks/useLayerStore';
import './LayerName.css';
import useClickOutside from '../../hooks/useClickOutside';

interface LayerNameProps {
  layerId: string;
  initialLayerName: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  closeMenu: () => void;
}

const LayerName:FC<LayerNameProps> = ({layerId, initialLayerName, isEditing, setIsEditing, closeMenu}) => {

  const { 
    changeLayerName, 
  } = useLayerStore();

  const [layerName, setLayerName] = useState<string>(initialLayerName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  useClickOutside(inputRef, () => {
    if (isEditing) {
      changeLayerName(layerId, layerName);
      setIsEditing(false);
      closeMenu();
    }
  });

  return (
    <div className="layerNameContainer">
      {isEditing ? (

        <form 
          onSubmit={(e)=>{
            e.preventDefault();
            changeLayerName(layerId, layerName);
            setIsEditing(false);
          }}
        >
          <input 
            type="text" 
            value={layerName} 
            onChange={(e)=>setLayerName(e.target.value)} 
            ref={inputRef} 
            onFocus={()=>setIsEditing(true)}
            onBlur={()=>changeLayerName(layerId, layerName)} 
          />
        </form>

      ) : (

        <div>
          <span onDoubleClick={()=>setIsEditing(true)}>{layerName}</span>
        </div>

      )}
    </div>
  )
}
export default LayerName;