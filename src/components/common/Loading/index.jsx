import { memo } from "react";

const Loading = () => {
  const spinnerStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "4px solid #ccc",
    borderTopColor: "#333",
    animation: "spin 1s linear infinite",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default memo(Loading);
