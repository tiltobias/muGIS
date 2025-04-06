import { FC, useState, useRef, useEffect } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import useLayerStore from '../hooks/useLayerStore';

interface LayerNameProps {
  layerId: string;
  initialLayerName: string;
}

const LayerName:FC<LayerNameProps> = ({layerId, initialLayerName}) => {

  const { 
    changeLayerName, 
  } = useLayerStore();

  const [layerName, setLayerName] = useState<string>(initialLayerName);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useClickOutside(inputRef, ()=>{
    handleSubmit();
  });

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
          />
        </form>

      ) : (

        <span onDoubleClick={()=>setIsEditing(true)}>{layerName}</span>

      )}
    </div>
  )
}
export default LayerName;