import { FC, RefObject, useState } from 'react';
// import { RgbaColorPicker } from 'react-colorful';

interface LayerProps {
  mapRef: RefObject<mapboxgl.Map | null>;
  id: string;
  name: string;
}

const Layer:FC<LayerProps> = ({mapRef, id, name}) => {
  const [layerName] = useState<string>(name);

  return (
    <li>
      <div>{layerName}</div>
      <button onClick={()=>{
        if (mapRef.current?.getLayoutProperty(id, "visibility") === "none") {
          mapRef.current?.setLayoutProperty(id, "visibility", "visible");
          console.log(mapRef.current?.getPaintProperty(id, "fill-color"));
        } else {
          mapRef.current?.setLayoutProperty(id, "visibility", "none");
        }
      }}>Eye</button>
      <input type="color" 
        value={mapRef.current?.getPaintProperty(id, "fill-color") as string}
        onChange={(event)=>{
          console.log(event.target.value);
          mapRef.current?.setPaintProperty(id, "fill-color", event.target.value);
        }}
      />
      {/* <RgbaColorPicker 
        color={mapRef.current?.getPaintProperty(layer.id, "fill-color") as string}
        onChange={(color)=>{
          mapRef.current?.setPaintProperty(layer.id, "fill-color", color);
        }}
      /> */}
    </li>
  );
}

export default Layer;