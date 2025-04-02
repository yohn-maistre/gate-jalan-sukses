
import { useState, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  content: string;
  description?: string;
  type: "text" | "options";
  options?: Option[];
}

export const useOnboardingQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initial question setup
  useEffect(() => {
    if (questions.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setQuestions([
          {
            id: "goal",
            content: "Apa mimpimu dalam 5 tahun ke depan?",
            description: "Ceritakan tujuan atau impian yang ingin kamu capai",
            type: "text"
          },
          {
            id: "education",
            content: "Apakah kamu sudah SMA atau kuliah?",
            description: "Ini akan membantu kami menyesuaikan roadmap untukmu",
            type: "options",
            options: [
              { label: "SMA", value: "sma" },
              { label: "Kuliah", value: "kuliah" }
            ]
          },
          {
            id: "focus",
            content: "Ingin fokus ke pendidikan atau langsung cari pengalaman?",
            description: "Pilih jalur yang paling sesuai dengan tujuanmu",
            type: "options",
            options: [
              { label: "Pendidikan", value: "pendidikan" },
              { label: "Pengalaman", value: "pengalaman" }
            ]
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [questions.length]);

  return { questions, isTyping, setIsTyping, setQuestions };
};
