
import React, { createContext, useContext, useState, useEffect } from "react";

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
}

interface RoadmapContextType {
  roadmap: Roadmap | null;
  isLoading: boolean;
  createRoadmap: (goal: string, additionalInfo: Record<string, string>) => Promise<void>;
  updateRoadmap: (updatedRoadmap: Roadmap) => Promise<void>;
  completeMilestone: (milestoneId: string) => Promise<void>;
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
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load roadmap from localStorage
    const storedRoadmap = localStorage.getItem("jalanSuksesRoadmap");
    if (storedRoadmap) {
      setRoadmap(JSON.parse(storedRoadmap));
    }
  }, []);

  const saveRoadmap = (newRoadmap: Roadmap) => {
    setRoadmap(newRoadmap);
    localStorage.setItem("jalanSuksesRoadmap", JSON.stringify(newRoadmap));
  };

  const createRoadmap = async (goal: string, additionalInfo: Record<string, string>) => {
    setIsLoading(true);
    try {
      // Simulate API call to LLM for roadmap generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This is mock data - in a real app, this would come from the LLM
      const newRoadmap: Roadmap = {
        id: "roadmap_" + Math.random().toString(36).substring(2, 9),
        title: `Roadmap untuk: ${goal}`,
        goal,
        milestones: [
          {
            id: "milestone_1",
            title: "Lulus SMA dengan Nilai Bagus",
            description: "Fokus pada mata pelajaran Biologi, Kimia, dan Matematika untuk persiapan masuk Kedokteran",
            timeframe: "6 Bulan",
            status: "in-progress",
            resources: [
              {
                title: "Panduan SBMPTN 2025",
                url: "https://example.com/sbmptn",
                type: "link"
              },
              {
                title: "Video Pembelajaran Biologi",
                url: "https://example.com/biologi",
                type: "video"
              }
            ]
          },
          {
            id: "milestone_2",
            title: "Persiapan UTBK/SBMPTN",
            description: "Ikuti bimbel dan latihan soal untuk persiapan ujian masuk",
            timeframe: "1 Tahun",
            status: "upcoming",
            resources: [
              {
                title: "Kursus Online UTBK/SBMPTN",
                url: "https://example.com/kursus",
                type: "link"
              }
            ]
          },
          {
            id: "milestone_3",
            title: "Masuk Fakultas Kedokteran",
            description: "Persiapkan dokumen pendaftaran dan materi ujian masuk",
            timeframe: "1.5 Tahun",
            status: "upcoming",
            resources: [
              {
                title: "Daftar Beasiswa Kedokteran",
                url: "https://example.com/beasiswa",
                type: "document"
              }
            ]
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      saveRoadmap(newRoadmap);
    } catch (error) {
      console.error("Error creating roadmap:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoadmap = async (updatedRoadmap: Roadmap) => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API to update the roadmap
      await new Promise(resolve => setTimeout(resolve, 500));
      const newRoadmap = {
        ...updatedRoadmap,
        updatedAt: new Date().toISOString()
      };
      saveRoadmap(newRoadmap);
    } catch (error) {
      console.error("Error updating roadmap:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeMilestone = async (milestoneId: string) => {
    if (!roadmap) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would call an API to update the milestone
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedMilestones = roadmap.milestones.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, status: "completed" as const } 
          : milestone
      );
      
      const updatedRoadmap = {
        ...roadmap,
        milestones: updatedMilestones,
        updatedAt: new Date().toISOString()
      };
      
      saveRoadmap(updatedRoadmap);
    } catch (error) {
      console.error("Error completing milestone:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoadmapContext.Provider value={{ roadmap, isLoading, createRoadmap, updateRoadmap, completeMilestone }}>
      {children}
    </RoadmapContext.Provider>
  );
};
