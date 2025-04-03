import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface RoadmapSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoadmapSidebar = ({ isOpen, onClose }: RoadmapSidebarProps) => {
  const { roadmaps, roadmap: activeRoadmap, setActiveRoadmap, deleteRoadmap } = useRoadmap();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Close confirmation dialog when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmDelete(null);
    }
  }, [isOpen]);
  
  const handleRoadmapSelect = (roadmapId: string) => {
    setActiveRoadmap(roadmapId);
    onClose();
  };
  
  const handleDeleteClick = (roadmapId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the roadmap selection
    setConfirmDelete(roadmapId);
  };
  
  const handleConfirmDelete = (roadmapId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the roadmap selection
    deleteRoadmap(roadmapId);
    setConfirmDelete(null);
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the roadmap selection
    setConfirmDelete(null);
  };
  
  const handleCreateNewRoadmap = () => {
    navigate("/onboarding");
    onClose();
  };
  
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-80 bg-black/90 backdrop-blur-lg border-l border-white/10 shadow-xl transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-jalan-text">Peta Jalanmu</h2>
          <button
            onClick={onClose}
            className="text-jalan-secondary hover:text-jalan-text transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-4">
          <div className="space-y-3">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                onClick={() => handleRoadmapSelect(roadmap.id)}
                className={cn(
                  "p-4 rounded-lg cursor-pointer transition-all",
                  roadmap.id === activeRoadmap?.id
                    ? "bg-jalan-accent/20 border border-jalan-accent/50"
                    : "bg-black/20 border border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-jalan-text">{roadmap.title}</h3>
                    <p className="text-sm text-jalan-secondary mt-1 line-clamp-2">{roadmap.goal}</p>
                  </div>
                  
                  {/* Only show delete button if we have more than one roadmap */}
                  {roadmaps.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteClick(roadmap.id, e)}
                      className="text-jalan-secondary hover:text-red-400 transition-colors p-1"
                      aria-label="Delete roadmap"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                {/* Delete confirmation */}
                {confirmDelete === roadmap.id && (
                  <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-sm">
                    <p className="text-white mb-2">Hapus peta jalan ini?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleConfirmDelete(roadmap.id, e)}
                        className="px-3 py-1 bg-red-500/80 text-white rounded hover:bg-red-600/80 transition-colors"
                      >
                        Ya
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-jalan-secondary">
                  {new Date(roadmap.updatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleCreateNewRoadmap}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-jalan-accent/10 border border-jalan-accent/30 rounded-lg text-jalan-accent hover:bg-jalan-accent/20 transition-all"
          >
            <Plus size={18} />
            <span>Buat Peta Jalan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSidebar;