
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  options?: { label: string; value: string }[];
}

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roadmap } = useRoadmap();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm();
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!roadmap) {
      navigate("/onboarding");
      return;
    }
  }, [user, roadmap, navigate]);
  
  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0 && roadmap) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            content: `Halo! Aku siap membantumu mencapai tujuanmu: "${roadmap.goal}". Ada yang bisa aku bantu hari ini?`,
            isUser: false
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [messages.length, roadmap]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const generateResponse = (userMessage: string) => {
    // In a real app, this would call an LLM API like Google Gemini
    const responses = [
      `Untuk mencapai tujuanmu "${roadmap?.goal}", kamu perlu fokus pada langkah berikutnya. Teruslah berlatih dan belajar!`,
      "Jika kamu merasa kesulitan, ingatlah bahwa setiap orang sukses pernah mengalami kegagalan. Yang penting adalah terus bangkit.",
      "Bagus sekali progresmu sejauh ini! Teruslah konsisten dengan jadwal belajarmu.",
      "Mungkin kamu bisa mencari mentor atau komunitas yang bisa membantumu dalam perjalanan ini.",
      "Kamu bisa menggunakan resource yang sudah aku sediakan di roadmap untuk belajar lebih dalam."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
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
    
    // Simulate response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot_${messages.length + 1}`,
        content: generateResponse(input),
        isUser: false,
        options: Math.random() > 0.5 ? [
          { label: "Beri contoh konkret", value: "Beri contoh konkret" },
          { label: "Bagaimana cara memulai?", value: "Bagaimana cara memulai?" }
        ] : undefined
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleOptionClick = (value: string) => {
    const userMessage: Message = {
      id: `user_${messages.length}`,
      content: value,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot_${messages.length + 1}`,
        content: generateResponse(value),
        isUser: false
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jalan-background">
        <p className="text-jalan-text animate-pulse">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-jalan-background">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-jalan-text">Chat Mentor</h1>
        <p className="text-jalan-secondary text-sm mt-1">Diskusikan langkahmu menuju "{roadmap.goal}"</p>
      </div>
      
      {/* Chat messages - Typeform style */}
      <div 
        ref={chatContainerRef}
        className="flex-1 flex flex-col px-6 pb-24 space-y-10"
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[90%] animate-text-appear opacity-0 my-6",
              message.isUser ? "self-end" : "self-start"
            )}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {!message.isUser && (
              <div className="mb-2 text-jalan-secondary text-xs uppercase tracking-wider">
                Mentor
              </div>
            )}
            
            <div className={cn(
              "p-4 rounded-lg",
              message.isUser 
                ? "bg-jalan-accent text-black font-medium" 
                : "bg-black/20 text-jalan-text border border-white/10"
            )}>
              {message.isUser ? (
                message.content
              ) : (
                <TypedText text={message.content} speed={20} />
              )}
            </div>
            
            {/* Options buttons - Typeform style */}
            {!message.isUser && message.options && message.options.length > 0 && (
              <div className="mt-4 space-y-3">
                {message.options.map((option, optIndex) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className="option-button-typeform w-full block text-left"
                    style={{ animationDelay: `${optIndex * 0.1 + (message.content.length * 0.02)}s` }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="self-start animate-fade-in my-6">
            <div className="mb-2 text-jalan-secondary text-xs uppercase tracking-wider">
              Mentor
            </div>
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-jalan-secondary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area - Typeform style */}
      <div className="fixed bottom-16 left-0 right-0 bg-black/80 backdrop-blur-md p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ketik pesanmu di sini..."
            className="typeform-input flex-1 bg-transparent border-b border-jalan-secondary/50 focus:border-jalan-accent rounded-none px-0"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className={cn(
              "ml-4 p-2 rounded-full",
              !input.trim() || isTyping 
                ? "opacity-50 cursor-not-allowed" 
                : "text-jalan-accent hover:bg-jalan-accent/10"
            )}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
      
      {/* Bottom navigation - Seamless style */}
      <NavigationBar />
    </div>
  );
};

export default Chat;
