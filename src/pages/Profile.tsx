
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { roadmap } = useRoadmap();
  const { toast } = useToast();
  
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
        <h1 className="text-3xl font-bold text-jalan-text mb-8">Profil</h1>
        
        <div className="space-y-6">
          {/* User info */}
          <div className="p-4 border border-white/10 rounded-md">
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
              
              <div className="p-4 border border-white/10 rounded-md">
                <TypedText
                  text={`Kamu sudah ${progressPercentage.toFixed(0)}% menuju langkah jangka pendekmu.`}
                  className="text-jalan-text"
                  speed={30}
                />
                
                <div className="h-1 w-full bg-jalan-secondary/30 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-jalan-accent rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4 border border-white/10 rounded-md">
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
              className="block w-full text-left text-jalan-accent hover:brightness-110 transition-all"
            >
              &gt; Sesuaikan Peta Jalan
            </button>
            
            <button 
              onClick={handleLogout}
              className="block w-full text-left text-jalan-accent hover:brightness-110 transition-all"
            >
              &gt; Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <NavigationBar />
    </div>
  );
};

export default Profile;
