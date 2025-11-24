import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, setQuantity }) => {

  const increment = () => {
    setQuantity((prev) => Math.min(prev + 1, 100));
  };

  const decrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      setQuantity(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrement}
        className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md ${quantity > 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
        disabled={quantity === 1}
      >
        -
      </button>
      <input
        value={quantity}
        type="number"
        min="1"
        max="100"
        onChange={handleInputChange}
        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none py-2 border rounded-md text-center"
      />
      <button
        onClick={increment}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
