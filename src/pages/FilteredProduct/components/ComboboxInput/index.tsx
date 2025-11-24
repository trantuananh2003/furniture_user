import React, { useState } from "react";
import "./style.css";

type CustomRendererProps = {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
};

const MultiFieldComboBox: React.FC<CustomRendererProps> = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (field: any, value: number) => {
    setFilters((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="combobox-input-container">
      <div className="combobox-title" onClick={() => setIsOpen((prev) => !prev)}>
        Kích thước
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      <div className={`combobox-input-content ${isOpen ? "open-combobox-input-box" : ""}`} >
        <div className="combobox-input">
          <span className="combobox-input-name">Chiều dài : </span>
          <input
            type="number"
            value={filters?.long}
            onChange={(e) => handleChange("long", e.target.valueAsNumber)}
            placeholder="Nhập chiều Dài"
            className="combobox-input-field"
          />
          <span>Cm</span>
        </div>
        <div className="combobox-input">
          <span className="combobox-input-label">Chiều rộng : </span>
          <input
            type="number"
            value={filters?.width}
            onChange={(e) => handleChange("width", e.target.valueAsNumber)}
            placeholder="Nhập chiều Rộng"
            className="combobox-input-field"
          />
          <span>Cm</span>
        </div>
        <div className="combobox-input">
          <span className="combobox-input-label">Chiều cao : </span>
          <input
            type="number"
            value={filters?.height}
            onChange={(e) => handleChange("height", e.target.valueAsNumber)}
            placeholder="Nhập chiều Cao"
            className="combobox-input-field"
          />
          <span>Cm</span>
        </div>
      </div>
    </div>
  );
};

export default MultiFieldComboBox;
