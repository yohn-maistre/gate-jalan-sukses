
import React, { createContext, useContext, useState, useEffect } from "react";
import { generateRoadmap as llmGenerateRoadmap } from "@/lib/llm";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  title: string;
  url: string;
  type: "link" | "video" | "document";
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  status: "completed" | "in-progress" | "upcoming";
  resources: Resource[];
}

interface Roadmap {
  id: string;
  title: string;
  goal: string;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

interface RoadmapContextType {
  roadmap: Roadmap | null;
  roadmaps: Roadmap[];
  isLoading: boolean;
  createRoadmap: (goal: string, additionalInfo: Record<string, string>) => Promise<void>;
  updateRoadmap: (updatedRoadmap: Roadmap) => Promise<void>;
  completeMilestone: (milestoneId: string) => Promise<void>;
  setActiveRoadmap: (roadmapId: string) => void;
  deleteRoadmap: (roadmapId: string) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
};

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Get the active roadmap
  const roadmap = activeRoadmapId 
    ? roadmaps.find(r => r.id === activeRoadmapId) || null
    : roadmaps.length > 0 ? roadmaps[0] : null;

  useEffect(() => {
    // Load roadmaps from localStorage
    const storedRoadmaps = localStorage.getItem("jalanSuksesRoadmaps");
    if (storedRoadmaps) {
      try {
        const parsedRoadmaps = JSON.parse(storedRoadmaps) as Roadmap[];
        setRoadmaps(parsedRoadmaps);
        
        // Set active roadmap from localStorage or use the first one
        const storedActiveId = localStorage.getItem("jalanSuksesActiveRoadmap");
        if (storedActiveId && parsedRoadmaps.some(r => r.id === storedActiveId)) {
          setActiveRoadmapId(storedActiveId);
        } else if (parsedRoadmaps.length > 0) {
          setActiveRoadmapId(parsedRoadmaps[0].id);
          localStorage.setItem("jalanSuksesActiveRoadmap", parsedRoadmaps[0].id);
        }
      } catch (error) {
        console.error("Error parsing stored roadmaps:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data tersimpan. Memulai dengan data baru.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const saveRoadmaps = (newRoadmaps: Roadmap[]) => {
    setRoadmaps(newRoadmaps);
    try {
      localStorage.setItem("jalanSuksesRoadmaps", JSON.stringify(newRoadmaps));
    } catch (error) {
      console.error("Error saving roadmaps to localStorage:", error);
      toast({
        title: "Perhatian",
        description: "Gagal menyimpan data secara lokal. Pastikan browser Anda mendukung localStorage.",
        variant: "destructive"
      });
    }
  };

  const setActiveRoadmap = (roadmapId: string) => {
    setActiveRoadmapId(roadmapId);
    localStorage.setItem("jalanSuksesActiveRoadmap", roadmapId);
  };

  const createRoadmap = async (goal: string, additionalInfo: Record<string, string>) => {
    setIsLoading(true);
    try {
      // Call the LLM service to generate a roadmap
      const llmResponse = await llmGenerateRoadmap({ goal, userInfo: additionalInfo });
      
      // Create a new roadmap from the LLM response
      const newRoadmap: Roadmap = {
        id: "roadmap_" + Math.random().toString(36).substring(2, 9),
        title: llmResponse.title,
        goal: llmResponse.goal,
        milestones: llmResponse.milestones.map((m, index) => ({
          id: `milestone_${index + 1}`,
          title: m.title,
          description: m.description,
          timeframe: m.timeframe,
          status: index === 0 ? "in-progress" : "upcoming",
          resources: m.resources
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new roadmap to the list and set it as active
      const updatedRoadmaps = [...roadmaps, newRoadmap];
      saveRoadmaps(updatedRoadmaps);
      setActiveRoadmap(newRoadmap.id);
      
      toast({
        title: "Sukses",
        description: "Peta jalan berhasil dibuat!",
      });
    } catch (error) {
      console.error("Error creating roadmap:", error);
      toast({
        title: "Error",
        description: "Gagal membuat peta jalan. Silakan coba lagi.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoadmap = async (updatedRoadmap: Roadmap) => {
    setIsLoading(true);
    try {
      const newRoadmap = {
        ...updatedRoadmap,
        updatedAt: new Date().toISOString()
      };
      
      const updatedRoadmaps = roadmaps.map(r => 
        r.id === newRoadmap.id ? newRoadmap : r
      );
      
      saveRoadmaps(updatedRoadmaps);
      
      toast({
        title: "Sukses",
        description: "Peta jalan berhasil diperbarui!",
      });
    } catch (error) {
      console.error("Error updating roadmap:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui peta jalan. Silakan coba lagi.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeMilestone = async (milestoneId: string) => {
    if (!roadmap) return;
    
    setIsLoading(true);
    try {
      const updatedMilestones = roadmap.milestones.map((milestone, index, array) => {
        // Mark the current milestone as completed
        if (milestone.id === milestoneId) {
          return { ...milestone, status: "completed" as const };
        }
        
        // Find the next upcoming milestone to mark as in-progress
        const isCurrentMilestoneCompleted = milestone.id === milestoneId || 
          milestone.status === "completed";
          
        const nextIndex = array.findIndex(m => 
          m.status === "upcoming" && array.slice(0, array.indexOf(m))
            .every(prev => prev.id === milestoneId || prev.status === "completed")
        );
        
        if (
          nextIndex !== -1 && 
          index === nextIndex && 
          isCurrentMilestoneCompleted
        ) {
          return { ...milestone, status: "in-progress" as const };
        }
        
        return milestone;
      });
      
      const updatedRoadmap = {
        ...roadmap,
        milestones: updatedMilestones,
        updatedAt: new Date().toISOString()
      };
      
      const updatedRoadmaps = roadmaps.map(r => 
        r.id === updatedRoadmap.id ? updatedRoadmap : r
      );
      
      saveRoadmaps(updatedRoadmaps);
      
      toast({
        title: "Sukses",
        description: "Milestone berhasil diselesaikan!",
      });
    } catch (error) {
      console.error("Error completing milestone:", error);
      toast({
        title: "Error",
        description: "Gagal menyelesaikan milestone. Silakan coba lagi.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRoadmap = (roadmapId: string) => {
    // Don't allow deleting the last roadmap
    if (roadmaps.length <= 1) {
      toast({
        title: "Perhatian",
        description: "Tidak dapat menghapus peta jalan terakhir.",
      });
      return;
    }
    
    const updatedRoadmaps = roadmaps.filter(r => r.id !== roadmapId);
    saveRoadmaps(updatedRoadmaps);
    
    // If we deleted the active roadmap, set a new active roadmap
    if (activeRoadmapId === roadmapId && updatedRoadmaps.length > 0) {
      setActiveRoadmap(updatedRoadmaps[0].id);
    }
    
    toast({
      title: "Sukses",
      description: "Peta jalan berhasil dihapus.",
    });
  };

  return (
    <RoadmapContext.Provider 
      value={{ 
        roadmap, 
        roadmaps, 
        isLoading, 
        createRoadmap, 
        updateRoadmap, 
        completeMilestone,
        setActiveRoadmap,
        deleteRoadmap
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};
