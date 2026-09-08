import React, { useState } from "react";
import type { SizeFilter } from "../../types";
import "./style.css";

interface SizeComboBoxProps {
  value: SizeFilter;
  onChange: (updated: SizeFilter) => void;
}

const SIZE_FIELDS: { key: keyof SizeFilter; label: string }[] = [
  { key: "length", label: "Dài" },
  { key: "width", label: "Rộng" },
  { key: "height", label: "Cao" },
];

const MultiFieldComboBox: React.FC<SizeComboBoxProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFieldChange = (field: keyof SizeFilter, raw: number) => {
    const val = Number.isNaN(raw) || raw < 0 ? 0 : raw;
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="multicombo-container">
      {/* Header / Toggle */}
      <div
        className="multicombo-title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Kích thước
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {/* Dropdown */}
      <div
        className={`multicombo-content ${
          isOpen ? "open-multicombo-content" : ""
        }`}
      >
        {SIZE_FIELDS.map(({ key, label }) => (
          <div className="multicombo-field" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              min={0}
              value={value[key] || ""}
              onChange={(e) =>
                handleFieldChange(key, e.target.valueAsNumber)
              }
              placeholder="0"
            />
            <span className="unit">Cm</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiFieldComboBox;