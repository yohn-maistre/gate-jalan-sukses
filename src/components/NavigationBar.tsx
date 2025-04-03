
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MapIcon, UserIcon } from "lucide-react";

const NavigationBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-lg flex items-center justify-around">
      <Link 
        to="/roadmap" 
        className={cn(
          "flex flex-col items-center justify-center px-4 py-1 text-xs transition-all duration-200", 
          isActive("/roadmap") 
            ? "text-jalan-accent" 
            : "text-jalan-secondary hover:text-jalan-secondary/80"
        )}
      >
        <MapIcon size={20} className={cn(
          "mb-1 transition-all",
          isActive("/roadmap") 
            ? "stroke-[2.5px]" 
            : "stroke-[1.5px]"
        )} />
        <span>Peta Jalan</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={cn(
          "flex flex-col items-center justify-center px-4 py-1 text-xs transition-all duration-200", 
          isActive("/profile") 
            ? "text-jalan-accent" 
            : "text-jalan-secondary hover:text-jalan-secondary/80"
        )}
      >
        <UserIcon size={20} className={cn(
          "mb-1 transition-all",
          isActive("/profile") 
            ? "stroke-[2.5px]" 
            : "stroke-[1.5px]"
        )} />
        <span>Profil</span>
      </Link>
    </div>
  );
};

export default NavigationBar;
