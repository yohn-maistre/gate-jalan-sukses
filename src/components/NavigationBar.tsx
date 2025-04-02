
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
          "px-4 py-2 text-sm", 
          isActive("/roadmap") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        &gt; Peta Jalan
      </Link>
      
      <Link 
        to="/chat" 
        className={cn(
          "px-4 py-2 text-sm", 
          isActive("/chat") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        &gt; Chat Mentor
      </Link>
      
      <Link 
        to="/profile" 
        className={cn(
          "px-4 py-2 text-sm", 
          isActive("/profile") ? "text-jalan-accent" : "text-jalan-secondary"
        )}
      >
        &gt; Profil
      </Link>
    </div>
  );
};

export default NavigationBar;
