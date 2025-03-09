import { FC, useState, useRef } from 'react';
import { HslaColorPicker, HslaColor } from 'react-colorful';
import './ColorPicker.css';
import useClickOutside from '../hooks/useClickOutside';

interface ColorPickerProps {
  color: HslaColor;
  onChange: (color: HslaColor) => void;
}

const ColorPicker:FC<ColorPickerProps> = ({color, onChange}) => {

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
          backgroundColor: `hsl(${color.h},${color.s}%,${color.l}%)`
        }}
      ></button>
    
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