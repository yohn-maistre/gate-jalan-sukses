
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const RoadmapReview = () => {
  const navigate = useNavigate();
  const { roadmap, updateRoadmap, isLoading } = useRoadmap();
  const { toast } = useToast();
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  
  useEffect(() => {
    if (!roadmap) {
      navigate("/onboarding");
    }
  }, [roadmap, navigate]);
  
  const handleApproveRoadmap = () => {
    if (!roadmap) return;
    
    toast({
      title: "Peta Jalan Disetujui",
      description: "Selamat datang di perjalananmu menuju kesuksesan!"
    });
    
    navigate("/roadmap");
  };
  
  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jalan-background">
        <p className="text-jalan-text animate-pulse">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-jalan-background p-6 pt-10 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-jalan-text mb-2">
          <TypedText text="Peta Jalanmu Sudah Siap" speed={40} onComplete={() => setShowApproveButton(true)} />
        </h1>
        
        <p className="text-jalan-secondary mb-10">
          {showApproveButton && (
            <TypedText 
              text="Berikut adalah rencana perjalananmu menuju sukses. Kamu bisa menyesuaikannya sesuai kebutuhanmu." 
              speed={30} 
              delay={300}
              onComplete={() => setShowMilestones(true)}
            />
          )}
        </p>
        
        <div className="space-y-8 mt-10">
          <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
            <h2 className="text-xl text-jalan-text mb-1">Tujuanmu</h2>
            {showApproveButton && <TypedText text={roadmap.goal} speed={20} delay={1000} className="text-jalan-accent font-medium text-lg" />}
          </div>
          
          {showMilestones && roadmap.milestones.map((milestone, index) => (
            <div 
              key={milestone.id} 
              className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 animate-text-appear opacity-0"
              style={{ animationDelay: `${(index + 1) * 0.5}s` }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-jalan-text font-medium text-lg">
                  {milestone.title}
                </h3>
                <span className="text-jalan-secondary text-sm">
                  {milestone.timeframe}
                </span>
              </div>
              
              <p className="text-jalan-secondary mt-2 text-sm">
                {milestone.description}
              </p>
              
              {milestone.resources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <h4 className="text-sm text-jalan-secondary">Resources</h4>
                  {milestone.resources.map((resource) => (
                    <a 
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-jalan-accent text-sm hover:brightness-110 group flex items-center"
                    >
                      <span className="mr-1">&gt;</span>
                      <span className="group-hover:underline">{resource.title}</span>
                    </a>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex space-x-4">
                <button className="text-jalan-accent text-sm hover:brightness-110">
                  Edit
                </button>
                <button className="text-jalan-accent text-sm hover:brightness-110">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {showApproveButton && (
          <div 
            className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-6 animate-text-appear opacity-0" 
            style={{ animationDelay: "3s" }}
          >
            <div className="max-w-2xl mx-auto flex justify-between">
              <button className="text-jalan-accent hover:brightness-110 px-4 py-2 border border-jalan-accent/30 rounded-md">
                Tambah Langkah
              </button>
              
              <button 
                onClick={handleApproveRoadmap}
                disabled={isLoading}
                className="bg-jalan-accent text-black font-medium px-6 py-2 rounded-md hover:brightness-110 transition-all"
              >
                Setujui Peta Jalan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapReview;
