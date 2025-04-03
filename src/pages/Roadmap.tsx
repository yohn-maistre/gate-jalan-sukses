
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import MainSidebar from "@/components/MainSidebar";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { generateMotivationalMessage } from "@/lib/llm";

const Roadmap = () => {
  const navigate = useNavigate();
  const { roadmap, completeMilestone } = useRoadmap();
  const { user } = useAuth();
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showMotivation, setShowMotivation] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!roadmap) {
      navigate("/onboarding");
      return;
    }
    
    // Get a motivational message from LLM
    const fetchMotivationalMessage = async () => {
      try {
        const message = await generateMotivationalMessage(roadmap.goal);
        setMotivationalMessage(message);
        
        // Show the motivation message after a delay
        setTimeout(() => {
          setShowMotivation(true);
        }, 1500);
      } catch (error) {
        console.error("Error fetching motivational message:", error);
        // Fallback to default message
        setMotivationalMessage("Teruslah melangkah, kamu pasti bisa!");
        setTimeout(() => {
          setShowMotivation(true);
        }, 1500);
      }
    };
    
    fetchMotivationalMessage();
  }, [roadmap, user, navigate]);
  
  const handleCompleteMilestone = async (milestoneId: string) => {
    await completeMilestone(milestoneId);
  };
  
  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jalan-background">
        <p className="text-jalan-text animate-pulse">Loading...</p>
      </div>
    );
  }
  
  // Calculate progress
  const totalMilestones = roadmap.milestones.length;
  const completedMilestones = roadmap.milestones.filter(m => m.status === "completed").length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  
  return (
    <div className="min-h-screen bg-jalan-background pb-20">
      <div className="p-6 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="mr-4 p-2 text-jalan-secondary hover:text-jalan-text transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-3xl font-bold text-jalan-text">Peta Jalanmu</h1>
            </div>
            <p className="text-jalan-secondary opacity-80 mt-2">Untuk mencapai: {roadmap.goal}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 w-full bg-jalan-secondary/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-jalan-accent rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-jalan-secondary text-sm mt-1">
            Progress: {progressPercentage.toFixed(0)}% selesai
          </p>
        </div>
        
        {/* Motivational message */}
        {showMotivation && (
          <div className="mb-8 p-4 bg-jalan-accent/5 border border-jalan-accent/20 rounded-lg animate-fade-in opacity-0">
            <TypedText
              text={motivationalMessage}
              className="text-jalan-text"
              speed={30}
            />
          </div>
        )}
        
        {/* Milestones */}
        <div className="space-y-6 mt-10">
          {roadmap.milestones.map((milestone, index) => {
            const isCompleted = milestone.status === "completed";
            const isInProgress = milestone.status === "in-progress";
            
            return (
              <div 
                key={milestone.id} 
                className={cn(
                  "relative pl-6 py-4 transition-all",
                  isCompleted ? "opacity-70" : "opacity-100"
                )}
              >
                {/* Timeline connector */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-jalan-secondary/20"></div>
                
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-[-4px] top-6 w-[10px] h-[10px] rounded-full",
                  isCompleted 
                    ? "bg-jalan-accent" 
                    : isInProgress
                      ? "bg-jalan-accent/70" 
                      : "bg-jalan-secondary/50"
                )}></div>
                
                <div className="flex items-start justify-between">
                  <h3 className={cn(
                    "text-lg font-medium transition-all",
                    isCompleted 
                      ? "text-jalan-secondary line-through" 
                      : "text-jalan-text"
                  )}>
                    {milestone.title} 
                  </h3>
                  
                  {milestone.status !== "completed" && (
                    <button 
                      onClick={() => handleCompleteMilestone(milestone.id)}
                      className="text-jalan-accent text-sm hover:brightness-110 ml-4"
                    >
                      {isInProgress ? "Selesaikan" : "Mulai"}
                    </button>
                  )}
                </div>
                
                <p className={cn(
                  "mt-1 text-sm",
                  isCompleted ? "text-jalan-secondary/60" : "text-jalan-secondary"
                )}>
                  {milestone.description}
                </p>
                
                {milestone.resources.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {milestone.resources.map((resource) => (
                      <a 
                        key={resource.title}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-jalan-accent text-sm hover:brightness-110 transition-all"
                      >
                        &gt; {resource.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Chat mentor button */}
      <Link
        to="/chat"
        className="fixed bottom-20 right-6 bg-jalan-accent text-black font-medium px-4 py-2 rounded-full hover:brightness-110 transition-all"
      >
        Chat Mentor →
      </Link>
      
      
      {/* Main Sidebar */}
      <MainSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
};

export default Roadmap;
