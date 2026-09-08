import { useState, type ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./style.css";

interface RadioButtonBoxProps {
  title: string;
  filters: any[];
  setFilters: React.Dispatch<React.SetStateAction<any[]>>;
  renderHeader?: (filter: any) => ReactNode;
}

const RadioButtonBox: React.FC<RadioButtonBoxProps> = ({
  title,
  filters,
  setFilters,
  renderHeader,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (clickedItem: any) => {
    const updated = filters.map((item: any) =>
      item === clickedItem
        ? { ...item, isChecked: !item.isChecked }
        : item,
    );
    setFilters(updated);
  };

  return (
    <div className="radio-box-container">
      {/* Header / Toggle */}
      <span
        className="radiobox-title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
        <FaChevronDown className="size-6" />
      </span>

      {/* Dropdown content */}
      <div
        className={`radio-box-content ${
          isOpen ? "open-radio-box-content" : ""
        }`}
      >
        {filters.map((item: any, index: number) => (
          <label className="radio-box-item" key={index}>
            <span className="radio-box-label flex gap-2">
              <div className="flex justify-between gap-1 w-full">
                <p>{item.label || item.stringDescription || item}</p>
                {renderHeader && <div>{renderHeader(item)}</div>}
              </div>
            </span>
            <input
              type="checkbox"
              checked={!!item.isChecked}
              onChange={() => handleToggle(item)}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonBox;