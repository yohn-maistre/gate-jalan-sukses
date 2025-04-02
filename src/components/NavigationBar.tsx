
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
          "px-4 py-2 text-sm transition-all duration-200", 
          isActive("/roadmap") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        Peta Jalan
      </Link>
      
      <Link 
        to="/chat" 
        className={cn(
          "px-4 py-2 text-sm transition-all duration-200", 
          isActive("/chat") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        Chat Mentor
      </Link>
      
      <Link 
        to="/profile" 
        className={cn(
          "px-4 py-2 text-sm transition-all duration-200", 
          isActive("/profile") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        Profil
      </Link>
    </div>
  );
};

export default NavigationBar;
