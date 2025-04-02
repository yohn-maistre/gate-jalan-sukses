
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-8 flex space-x-2 animate-fade-in">
      <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse"></div>
      <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
    </div>
  );
};

export default TypingIndicator;
