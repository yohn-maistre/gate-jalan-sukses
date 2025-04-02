
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import QuestionScreen from "@/components/onboarding/QuestionScreen";
import TypingIndicator from "@/components/onboarding/TypingIndicator";
import { useOnboardingQuestions, Question } from "@/components/onboarding/useOnboardingQuestions";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRoadmap, isLoading } = useRoadmap();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  
  const { questions, isTyping, setIsTyping } = useOnboardingQuestions();
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Track text input changes for the current question
  const textInputValue = watch(questions[currentQuestionIndex]?.id || '');
  
  const handleTextAnswer = () => {
    if (!questions[currentQuestionIndex]) return;
    
    const questionId = questions[currentQuestionIndex].id;
    const value = textInputValue;
    
    if (!value || value.trim() === '') return;
    
    // Update answers state
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        reset(); // Clear form for next question
      }, 500);
    } else {
      handleSubmitAllAnswers();
    }
  };
  
  const handleOptionSelect = (value: string) => {
    if (!questions[currentQuestionIndex]) return;
    
    const questionId = questions[currentQuestionIndex].id;
    
    // Update answers state
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }, 500);
    } else {
      handleSubmitAllAnswers();
    }
  };
  
  const handleSubmitAllAnswers = () => {
    setIsTyping(true);
    
    // Show a generating message
    toast({
      title: "Memproses",
      description: "Membuat peta jalan berdasarkan informasi yang kamu berikan...",
    });
    
    // Ensure all answers are collected
    console.log("Submitting answers:", answers);
    
    // Generate roadmap with all collected answers
    createRoadmap(answers.goal, { 
      educationLevel: answers.education, 
      focusArea: answers.focus 
    })
      .then(() => {
        toast({
          title: "Sukses",
          description: "Peta jalanmu siap! Mari kita tinjau bersama.",
        });
        
        // Navigate to roadmap review page after a short delay
        setTimeout(() => {
          navigate("/roadmap-review");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creating roadmap:", error);
        toast({
          title: "Error",
          description: "Gagal membuat peta jalan. Silakan coba lagi.",
          variant: "destructive"
        });
        setIsTyping(false);
      });
  };
  
  return (
    <div className="min-h-screen bg-jalan-background flex flex-col overflow-hidden relative">
      {questions.map((question, index) => (
        <QuestionScreen
          key={question.id}
          questionIndex={index}
          currentIndex={currentQuestionIndex}
          question={question}
          textInputValue={textInputValue}
          isLoading={isLoading}
          isTyping={isTyping}
          onTextSubmit={handleTextAnswer}
          onOptionSelect={handleOptionSelect}
          register={register}
        />
      ))}
      
      {/* Typing indicator at bottom */}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default Onboarding;
