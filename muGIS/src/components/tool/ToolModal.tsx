import { ReactNode, FC, useState } from 'react';
import "./ToolModal.css";
import { X, Info } from 'lucide-react';

interface ToolModalProps {
  children: ReactNode | ReactNode[];
  buttonLabel: string;
  onFormSubmit: () => boolean; // function to be called on form submit, should return true if the form is valid and false if not
  buttonIcon?: ReactNode;
  description?: string;
  errorMessage?: string;
}

const ToolModal:FC<ToolModalProps> = ({children, buttonLabel, onFormSubmit, buttonIcon, description, errorMessage}) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <div>
      <button type="button" className="toolButton" onClick={()=>setModalOpen(!modalOpen)}>
        {buttonIcon} {buttonLabel}
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
              
              <div className="modalHeader">
                <h3>{buttonLabel}</h3>
                {description && (
                  <button type="button" onClick={()=>setShowDescription(!showDescription)}>
                    <Info />
                  </button>
                )}
              </div>

              {showDescription && <p className="modalDescription">{description}</p>}

              {children}

              {errorMessage && <p className="modalErrorMessage">{errorMessage}</p>}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default ToolModal;