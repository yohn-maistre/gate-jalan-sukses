
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import MainSidebar from "@/components/MainSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { roadmap } = useRoadmap();
  const { toast } = useToast();
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout Berhasil",
      description: "Sampai jumpa kembali!"
    });
    navigate("/");
  };
  
  // Calculate progress
  const totalMilestones = roadmap?.milestones.length || 0;
  const completedMilestones = roadmap?.milestones.filter(m => m.status === "completed").length || 0;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jalan-background">
        <p className="text-jalan-text animate-pulse">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-jalan-background pb-20">
      <div className="p-6 pt-10">
        <div className="flex items-center mb-8">
          <button
            onClick={() => setIsMainSidebarOpen(true)}
            className="mr-4 p-2 text-jalan-secondary hover:text-jalan-text transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-jalan-text">Profil</h1>
        </div>
        
        <div className="space-y-8">
          {/* User info */}
          <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
            <h2 className="text-xl text-jalan-text">
              {user.name || (user.isGuest ? "Pengguna Tamu" : user.email)}
            </h2>
            <p className="text-jalan-secondary text-sm mt-1">
              {user.isGuest 
                ? "Masuk untuk menyimpan perkembanganmu"
                : user.email}
            </p>
          </div>
          
          {/* Progress insights */}
          {roadmap && (
            <div className="space-y-4">
              <h2 className="text-xl text-jalan-text">Insights</h2>
              
              <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
                <TypedText
                  text={`Kamu sudah ${progressPercentage.toFixed(0)}% menuju langkah jangka pendekmu.`}
                  className="text-jalan-text"
                  speed={30}
                />
                
                <div className="h-2 w-full bg-jalan-secondary/10 rounded-full overflow-hidden mt-6">
                  <div 
                    className="h-full bg-jalan-accent rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
                {completedMilestones > 0 ? (
                  <TypedText
                    text={`Kamu telah menyelesaikan ${completedMilestones} dari ${totalMilestones} langkah. Luar biasa!`}
                    className="text-jalan-text"
                    speed={30}
                    delay={1000}
                  />
                ) : (
                  <TypedText
                    text="Belum ada langkah yang kamu selesaikan. Yuk mulai perjalananmu!"
                    className="text-jalan-text"
                    speed={30}
                    delay={1000}
                  />
                )}
              </div>
            </div>
          )}
          
          {/* Options */}
          <div className="space-y-4 mt-8">
            <button 
              onClick={() => navigate("/roadmap-review")}
              className={cn(
                "option-button-typeform justify-between",
                "group hover:border-jalan-accent hover:bg-jalan-accent/5"
              )}
            >
              <span>Sesuaikan Peta Jalan</span>
              <span className="text-jalan-accent group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className={cn(
                "option-button-typeform justify-between",
                "group hover:border-jalan-accent hover:bg-jalan-accent/5"
              )}
            >
              <span>Logout</span>
              <span className="text-jalan-accent group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Sidebar */}
      <MainSidebar 
        isOpen={isMainSidebarOpen} 
        onClose={() => setIsMainSidebarOpen(false)} 
      />
    </div>
  );
};

export default Profile;
