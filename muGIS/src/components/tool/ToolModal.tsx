import { ReactNode, FC, useState } from 'react';
import "./ToolModal.css";
import { X } from 'lucide-react';

interface ToolModalProps {
  children: ReactNode | ReactNode[];
  buttonLabel: string;
  onFormSubmit: () => boolean; // function to be called on form submit, should return true if the form is valid and false if not
}

const ToolModal:FC<ToolModalProps> = ({children, buttonLabel, onFormSubmit}) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <button type="button" onClick={()=>setModalOpen(!modalOpen)}>
        {buttonLabel}
      </button>
      
      {modalOpen && (
        <div className="cover" onClick={(e)=>{
          if (e.target === e.currentTarget) setModalOpen(false);  // only close if clicked on the cover
        }}>
          <div className={"modal" + (loading ? " loading" : "")}>
            <form onSubmit={(e)=>{
              e.preventDefault();
              setLoading(true);
              setTimeout(() => {
                if (onFormSubmit()) setModalOpen(false); // only close the modal if the form is valid
                setLoading(false);
              }, 0);
            }}>
              <button type="button" className="modalCloseButton" onClick={()=>setModalOpen(false)}><X /></button>
              <h3>{buttonLabel}</h3>

              {children}

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default ToolModal;