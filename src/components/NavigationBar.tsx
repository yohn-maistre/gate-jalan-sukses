
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MapIcon, MessageCircleIcon, UserIcon } from "lucide-react";

const NavigationBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="bottom-nav">
      <Link 
        to="/roadmap" 
        className={cn(
          "flex flex-col items-center justify-center px-4 py-1 text-xs transition-all duration-200", 
          isActive("/roadmap") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        <MapIcon size={20} className="mb-1" />
        <span>Peta Jalan</span>
      </Link>
      
      <Link 
        to="/chat" 
        className={cn(
          "flex flex-col items-center justify-center px-4 py-1 text-xs transition-all duration-200", 
          isActive("/chat") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        <MessageCircleIcon size={20} className="mb-1" />
        <span>Chat Mentor</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={cn(
          "flex flex-col items-center justify-center px-4 py-1 text-xs transition-all duration-200", 
          isActive("/profile") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        <UserIcon size={20} className="mb-1" />
        <span>Profil</span>
      </Link>
    </div>
  );
};

export default NavigationBar;
