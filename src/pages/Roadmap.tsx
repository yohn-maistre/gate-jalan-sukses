
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import NavigationBar from "@/components/NavigationBar";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useAuth } from "@/contexts/AuthContext";

const getMotivationalMessage = () => {
  const messages = [
    "Kamu sedang on track untuk mencapai mimpimu!",
    "Setiap langkah kecil membawamu lebih dekat ke tujuan!",
    "Progress is progress, no matter how small.",
    "Teruslah melangkah, meskipun pelan!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

const Roadmap = () => {
  const navigate = useNavigate();
  const { roadmap, completeMilestone } = useRoadmap();
  const { user } = useAuth();
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showMotivation, setShowMotivation] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!roadmap) {
      navigate("/onboarding");
      return;
    }
    
    // Set a random motivational message
    setMotivationalMessage(getMotivationalMessage());
    
    // Show the motivation message after a delay
    const timer = setTimeout(() => {
      setShowMotivation(true);
    }, 1500);
    
    return () => clearTimeout(timer);
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
        <h1 className="text-3xl font-bold text-jalan-text mb-6">Peta Jalanmu</h1>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1 w-full bg-jalan-secondary/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-jalan-accent rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-jalan-secondary text-sm mt-1">
            Progress: {progressPercentage.toFixed(0)}% selesai
          </p>
        </div>
        
        {/* Motivational message */}
        {showMotivation && (
          <div className="mb-8 p-4 border border-jalan-accent/20 rounded animate-text-appear opacity-0">
            <TypedText
              text={motivationalMessage}
              className="text-jalan-text"
              speed={30}
            />
          </div>
        )}
        
        {/* Current goal */}
        <div className="mb-8">
          <h2 className="text-lg text-jalan-secondary">Tujuan:</h2>
          <p className="text-jalan-text text-xl">{roadmap.goal}</p>
        </div>
        
        {/* Milestones */}
        <div className="space-y-8">
          {roadmap.milestones.map((milestone, index) => (
            <div 
              key={milestone.id} 
              className={`border-l-2 ${
                milestone.status === "completed" 
                  ? "border-jalan-accent" 
                  : milestone.status === "in-progress" 
                    ? "border-jalan-accent/70" 
                    : "border-jalan-secondary/50"
              } pl-4 py-2`}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-jalan-text font-medium text-lg">
                  {milestone.title} 
                  <span className="text-jalan-secondary text-sm ml-2">
                    [{
                      milestone.status === "completed" 
                        ? "Selesai"
                        : milestone.status === "in-progress" 
                          ? "Sedang Berlangsung" 
                          : "Akan Datang"
                    }]
                  </span>
                </h3>
                
                {milestone.status !== "completed" && (
                  <button 
                    onClick={() => handleCompleteMilestone(milestone.id)}
                    className="text-jalan-accent text-sm hover:brightness-110"
                  >
                    &gt; Selesai
                  </button>
                )}
              </div>
              
              <p className="text-jalan-secondary mt-1 text-sm">
                {milestone.description}
              </p>
              
              {milestone.resources.length > 0 && (
                <div className="mt-2 space-y-1">
                  {milestone.resources.map((resource) => (
                    <a 
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-jalan-accent text-sm hover:brightness-110"
                    >
                      &gt; {resource.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat mentor button */}
      <Link
        to="/chat"
        className="fixed bottom-20 right-6 bg-jalan-accent/20 border border-jalan-accent text-jalan-accent p-3 rounded-full hover:bg-jalan-accent/30 transition-colors"
      >
        &gt; Chat Mentor
      </Link>
      
      {/* Bottom navigation */}
      <NavigationBar />
    </div>
  );
};

export default Roadmap;
