import { FC, useRef, useState, useEffect } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import "./Select.css";
import { SquareX } from "lucide-react";

interface SelectProps {
  options: string[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  placeholder?: string;
  clearable?: boolean;
}

const Select: FC<SelectProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  placeholder = "Select an option",
  clearable = false,
}) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

 useClickOutside(selectRef, ()=>{setSelectOpen(false)});

 useEffect(() => {
    if (selectRef.current && popoverRef.current) {
      popoverRef.current?.style.setProperty('max-height', `${window.innerHeight - selectRef.current?.getBoundingClientRect().bottom - 10}px`);
      popoverRef.current?.style.setProperty('width', `${selectRef.current?.getBoundingClientRect().width}px`);
      popoverRef.current?.style.setProperty('top', `${selectRef.current?.getBoundingClientRect().bottom + window.scrollY}px`);
    }
  }, [selectOpen, selectedOption]);

  return (
    <div className="selectLayersContainer select" ref={selectRef} onClick={()=>{setSelectOpen(!selectOpen)}}>
      <div className="selectedList">
        {selectedOption ? (
          <div className="layerItem">
            <div className="layerName">{selectedOption}</div>
            {clearable && selectOpen && (
              <button
                type="button"
                onClick={(e) => {
                  setSelectedOption("");
                  e.stopPropagation();
                }}
              >
                <SquareX />
              </button>
            )}
          </div>
        ) : (
          <div className="layerName">{placeholder}</div>
        )}
      </div>

      {selectOpen && (
        <div className="selectListContainer" ref={popoverRef}>
          <ol className="selectList">
            {options.map((option) => (
              <li
                key={option}
                className="selectListItem"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOption(option);
                  setSelectOpen(false);
                }}
              >
                <div className="selectItem">
                  {option}
                </div>
              </li>
            ))}
            {options.length === 0 && <p>No options available</p>}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Select;