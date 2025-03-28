import { FC, useState } from 'react';
import "./Toolbar.css";

interface ToolbarProps {
  test?: string;
}

const Toolbar:FC<ToolbarProps> = () => {
  
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <button type="button" onClick={()=>{
        setModalOpen(!modalOpen);
      }}>Intersect</button>
      {modalOpen && (
        <div className="cover" onClick={(e)=>{
          if (e.target === e.currentTarget) setModalOpen(false);  // only close if clicked on the cover
        }}>
          <div className="modalContainer">
            <form onSubmit={(e)=>{
              e.preventDefault();
              setModalOpen(false);
            }}>
              <h3>Intersect</h3>
              <p>TODO: Intersect two layers</p>
              <button type="button" onClick={()=>{
                setModalOpen(false);
              }}>Close</button>
              <input type="text" />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Toolbar;