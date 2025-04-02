
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  options?: { label: string; value: string }[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRoadmap, isLoading } = useRoadmap();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userGoal, setUserGoal] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            content: "Halo! Aku mentor virtualmu. Apa mimpimu dalam 5 tahun ke depan?",
            isUser: false,
            options: []
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [messages.length]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: `user_${messages.length}`,
      content: input,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Process the user's message based on the current step
    switch (currentStep) {
      case 0: // Initial goal setting
        setUserGoal(input);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `bot_${messages.length + 1}`,
            content: "Terima kasih telah berbagi mimpimu. Apakah kamu sudah SMA atau kuliah?",
            isUser: false,
            options: [
              { label: "SMA", value: "sma" },
              { label: "Kuliah", value: "kuliah" }
            ]
          }]);
          setIsTyping(false);
          setCurrentStep(1);
        }, 1500);
        break;
        
      case 1: // Education level
        setAdditionalInfo(prev => ({ ...prev, educationLevel: input }));
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `bot_${messages.length + 1}`,
            content: "Ingin fokus ke pendidikan atau langsung cari pengalaman?",
            isUser: false,
            options: [
              { label: "Pendidikan", value: "pendidikan" },
              { label: "Pengalaman", value: "pengalaman" }
            ]
          }]);
          setIsTyping(false);
          setCurrentStep(2);
        }, 1500);
        break;
        
      case 2: // Focus area
        setAdditionalInfo(prev => ({ ...prev, focusArea: input }));
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `bot_${messages.length + 1}`,
            content: "Bagus! Aku akan membuat peta jalan untukmu berdasarkan informasi yang kamu berikan. Tunggu sebentar ya...",
            isUser: false
          }]);
          setIsTyping(false);
          
          // Generate roadmap
          createRoadmap(userGoal, { ...additionalInfo, focusArea: input })
            .then(() => {
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: `bot_${messages.length + 2}`,
                  content: "Peta jalanmu siap! Mari kita tinjau bersama.",
                  isUser: false
                }]);
                
                // Navigate to roadmap review page after a short delay
                setTimeout(() => {
                  navigate("/roadmap-review");
                }, 2000);
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
        }, 1500);
        break;
        
      default:
        setIsTyping(false);
        break;
    }
  };
  
  const handleOptionClick = (value: string) => {
    setInput(value);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-jalan-background">
      {/* Chat messages */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-20">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`my-2 max-w-[85%] ${message.isUser ? "self-end" : "self-start"} animate-text-appear opacity-0`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className={`p-2 ${message.isUser ? "text-jalan-secondary" : "text-jalan-text"}`}>
              {message.isUser ? (
                message.content
              ) : (
                <TypedText text={message.content} speed={20} />
              )}
            </div>
            
            {/* Options buttons */}
            {!message.isUser && message.options && message.options.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className="block text-jalan-accent hover:brightness-110 transition-all duration-200"
                  >
                    &gt; {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="self-start my-2 p-2">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ketik di sini..."
            className="flex-1 bg-transparent border-b border-jalan-secondary focus:border-jalan-accent text-jalan-text outline-none py-2 px-0"
            disabled={isTyping || isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping || isLoading}
            className={`ml-2 text-jalan-accent p-2 ${!input.trim() || isTyping || isLoading ? "opacity-50" : "hover:brightness-110"}`}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
