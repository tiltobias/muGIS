import { FC, useState, useRef } from 'react';
import { RgbaColorPicker, RgbaColor } from 'react-colorful';
import './ColorPicker.css';
import useClickOutside from '../hooks/useClickOutside';

interface ColorPickerProps {
  color: RgbaColor;
  onChange: (color: RgbaColor) => void;
}

const ColorPicker:FC<ColorPickerProps> = ({color, onChange}) => {
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const colorPicker = useRef<HTMLDivElement>(null);
  useClickOutside(colorPicker, ()=>{setOpenPicker(false)});

  return (
    <div className="colorPicker">
      <button 
        type="button" 
        className="colorPickerButton" 
        onClick={()=>{
          setOpenPicker(!openPicker);
        }}
        style={{
          backgroundColor: `rgb(${color.r},${color.g},${color.b})`
        }}
      >
        
      </button>
    
      {openPicker && (
        <div className="colorPickerPopover" ref={colorPicker}>
          {/* <div className="popoverCover" onClick={()=>{setOpenPicker(false)}}></div> */}
          {/* Cover element underneath is an alternative to useClickOutside.ts */}
          <RgbaColorPicker
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
export type { RgbaColor } from 'react-colorful';