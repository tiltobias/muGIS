import { FC, useState, useRef, useEffect } from 'react';
import useLayerStore from '../hooks/useLayerStore';

interface LayerNameProps {
  layerId: string;
  initialLayerName: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayerName:FC<LayerNameProps> = ({layerId, initialLayerName, isEditing, setIsEditing}) => {

  const { 
    changeLayerName, 
  } = useLayerStore();

  const [layerName, setLayerName] = useState<string>(initialLayerName);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    changeLayerName(layerId, layerName);
    setIsEditing(false);
  }

  return (
    <div className="layerNameContainer">
      {isEditing ? (

        <form 
          ref={formRef} 
          onSubmit={handleSubmit}
        >
          <input 
            type="text" 
            value={layerName} 
            onChange={(e)=>setLayerName(e.target.value)} 
            ref={inputRef} 
            onFocus={()=>setIsEditing(true)}
            onBlur={()=>handleSubmit()} // instead of useClickOutside (more reliable)
          />
        </form>

      ) : (

        <span onDoubleClick={()=>setIsEditing(true)}>{layerName}</span>

      )}
    </div>
  )
}
export default LayerName;