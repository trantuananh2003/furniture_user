import React from "react";
import CheckOutMain from "./components/CheckOutMain";
import CheckOutBill from "./components/CheckOutBill";

const CheckOut: React.FC = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6 bg-gray-100 h-full min-h-[100vh]">
      {/* Main content */}
      <div className="flex-1">
        <CheckOutMain />
      </div>

      {/* Bill (sidebar) */}
      <div className="w-full lg:w-96">
        <CheckOutBill />
      </div>
    </div>
  );
};

export default CheckOut;
