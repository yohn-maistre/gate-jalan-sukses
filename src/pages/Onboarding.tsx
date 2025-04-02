
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface Question {
  id: string;
  content: string;
  description?: string;
  type: "text" | "options";
  options?: { label: string; value: string }[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRoadmap, isLoading } = useRoadmap();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm();
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
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
  }, []);
  
  // Auto-scroll to current question
  useEffect(() => {
    if (mainContainerRef.current && currentQuestionIndex > 0) {
      const questionHeight = window.innerHeight;
      mainContainerRef.current.scrollTo({
        top: questionHeight * currentQuestionIndex,
        behavior: "smooth"
      });
    }
  }, [currentQuestionIndex]);
  
  const handleTextAnswer = (value: string) => {
    if (!questions[currentQuestionIndex]) return;
    
    const questionId = questions[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      handleSubmitAllAnswers();
    }
  };
  
  const handleOptionSelect = (value: string) => {
    if (!questions[currentQuestionIndex]) return;
    
    const questionId = questions[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
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
      .catch(() => {
        toast({
          title: "Error",
          description: "Gagal membuat peta jalan. Silakan coba lagi.",
          variant: "destructive"
        });
        setIsTyping(false);
      });
  };
  
  return (
    <div 
      ref={mainContainerRef}
      className="min-h-screen bg-jalan-background flex flex-col overflow-y-auto snap-y snap-mandatory"
    >
      {questions.map((question, index) => (
        <div 
          key={question.id}
          className={`min-h-screen flex flex-col justify-center items-center p-8 snap-start ${index > currentQuestionIndex ? 'opacity-0' : 'animate-fade-in'}`}
          style={{ 
            animationDelay: `${index * 0.2}s`,
            pointerEvents: index === currentQuestionIndex ? 'auto' : 'none'
          }}
        >
          <div className="max-w-md w-full">
            <div className="mb-6 flex items-center text-jalan-secondary">
              <span className="question-index">{index + 1}</span>
              <span className="mr-2">→</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-jalan-text">
              {index <= currentQuestionIndex ? (
                <TypedText 
                  text={question.content} 
                  speed={25} 
                  delay={index === 0 ? 500 : 200}
                />
              ) : (
                question.content
              )}
            </h2>
            
            {question.description && (
              <p className="text-jalan-secondary mb-8 text-sm">
                {question.description}
              </p>
            )}
            
            {question.type === "text" && index === currentQuestionIndex && (
              <div className="mt-8">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name={question.id}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="form-control-typeform">
                            <Input
                              className="border-none bg-transparent focus:outline-none focus:ring-0 pl-0 typeform-input"
                              placeholder="Ketik di sini..."
                              value={answers[question.id] || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && field.value && field.value.trim()) {
                                  handleTextAnswer(field.value);
                                }
                              }}
                              disabled={isLoading || isTyping}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Form>
                <button
                  onClick={() => {
                    const value = form.getValues(question.id);
                    if (value && value.trim()) {
                      handleTextAnswer(value);
                    }
                  }}
                  disabled={isLoading || isTyping}
                  className="mt-6 typeform-button"
                >
                  Lanjutkan
                </button>
              </div>
            )}
            
            {question.type === "options" && index === currentQuestionIndex && question.options && (
              <div className="mt-8 space-y-3 w-full">
                <RadioGroup 
                  defaultValue={answers[question.id] || ""}
                  onValueChange={handleOptionSelect}
                >
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={option.value}
                      className="typeform-appear"
                      style={{ animationDelay: `${optionIndex * 0.1 + 0.5}s` }}
                    >
                      <label
                        className="option-button-typeform"
                        htmlFor={`option-${option.value}`}
                      >
                        <span className="question-index mr-3">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        {option.label}
                        <RadioGroupItem
                          value={option.value}
                          id={`option-${option.value}`}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Typing indicator at bottom */}
      {isTyping && (
        <div className="fixed bottom-8 left-8 flex space-x-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
