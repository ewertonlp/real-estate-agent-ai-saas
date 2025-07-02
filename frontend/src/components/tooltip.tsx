import React, { useState } from "react";

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block z-50">
      <button
        type="button"
        aria-label="Ajuda"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="ml-2 text-primary hover:text-blue-800 focus:outline-none z-50 transition-colors"
      >
        ?
      </button>
      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-56 p-2 bg-primary text-white text-xs rounded shadow-lg z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
        </div>
      )}
    </span>
  );
};

export default Tooltip;
