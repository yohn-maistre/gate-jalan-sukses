
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useToast } from "@/hooks/use-toast";

const RoadmapReview = () => {
  const navigate = useNavigate();
  const { roadmap, updateRoadmap, isLoading } = useRoadmap();
  const { toast } = useToast();
  const [showApproveButton, setShowApproveButton] = useState(false);
  
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
        <h1 className="text-3xl font-bold text-jalan-text mb-8">
          <TypedText text="Peta Jalanmu" speed={50} onComplete={() => setShowApproveButton(true)} />
        </h1>
        
        <div className="space-y-8 mt-10">
          <div className="mb-6">
            <h2 className="text-xl text-jalan-text mb-1">
              {showApproveButton && <TypedText text={`Tujuan: ${roadmap.goal}`} speed={30} delay={300} />}
            </h2>
          </div>
          
          {showApproveButton && roadmap.milestones.map((milestone, index) => (
            <div 
              key={milestone.id} 
              className="border-l-2 border-jalan-accent pl-4 py-2 animate-text-appear opacity-0"
              style={{ animationDelay: `${(index + 1) * 0.5}s` }}
            >
              <h3 className="text-jalan-text font-medium text-lg">
                {milestone.title} <span className="text-jalan-secondary">[{milestone.timeframe}]</span>
              </h3>
              
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
              
              <div className="mt-2 flex space-x-4">
                <button className="text-jalan-accent text-sm hover:brightness-110">
                  &gt; Edit
                </button>
                <button className="text-jalan-accent text-sm hover:brightness-110">
                  &gt; Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {showApproveButton && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 p-6 animate-text-appear opacity-0" style={{ animationDelay: "3s" }}>
            <div className="max-w-2xl mx-auto flex justify-between">
              <button className="text-jalan-accent hover:brightness-110">
                &gt; Tambah Langkah
              </button>
              
              <button 
                onClick={handleApproveRoadmap}
                disabled={isLoading}
                className="text-jalan-accent hover:brightness-110"
              >
                &gt; Setujui Peta Jalan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapReview;
