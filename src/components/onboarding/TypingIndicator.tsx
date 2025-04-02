
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-8 flex space-x-2 animate-fade-in z-50">
      <div className="w-2 h-2 rounded-full bg-jalan-accent animate-pulse"></div>
      <div className="w-2 h-2 rounded-full bg-jalan-accent animate-pulse" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-2 h-2 rounded-full bg-jalan-accent animate-pulse" style={{ animationDelay: "0.4s" }}></div>
    </div>
  );
};

export default TypingIndicator;
