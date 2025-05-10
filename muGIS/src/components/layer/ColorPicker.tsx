import { FC, useState, useRef } from 'react';
import { HslaColorPicker, HslaColor } from 'react-colorful';
import './ColorPicker.css';
import useClickOutside from '../../hooks/useClickOutside';
import {LayerLineIcon, LayerPointIcon, LayerPolygonIcon} from '../icons/';
import { LayerRenderingType } from '../../hooks/useLayerStore';

interface ColorPickerProps {
  color: HslaColor;
  onChange: (color: HslaColor) => void;
  layerType: LayerRenderingType;
}

const ColorPicker:FC<ColorPickerProps> = ({color, onChange, layerType}) => {

  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const colorPicker = useRef<HTMLDivElement>(null);


  useClickOutside(colorPicker, ()=>{setOpenPicker(false)});

  return (
    <div className="colorPicker" ref={colorPicker}>
      <button 
        type="button" 
        className="colorPickerButton" 
        onClick={()=>{
          setOpenPicker(!openPicker);
        }}
        style={{
          color: `hsl(${color.h},${color.s}%,${color.l}%)`
        }}
      >
        {layerType === 'circle' && <LayerPointIcon />}
        {layerType === 'line' && <LayerLineIcon />}
        {layerType === 'fill' && <div className="polygonShrinker"><LayerPolygonIcon /></div>}
      </button>
    
      {openPicker && (
        <div className="colorPickerPopover" >
          <HslaColorPicker
            color={color}
            onChange={(color)=>{
              onChange(color);
            }}
          />
          
        </div>
      )}
    </div>
  )
}

export default ColorPicker;
export type { HslaColor } from 'react-colorful';