
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roadmap } = useRoadmap();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-jalan-text">Chat Mentor</h1>
      </div>
      
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
      <div className="fixed bottom-16 left-0 right-0 bg-black/90 border-t border-white/10 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Tanya mentormu..."
            className="flex-1 bg-transparent border-b border-jalan-secondary focus:border-jalan-accent text-jalan-text outline-none py-2 px-0"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className={`ml-2 text-jalan-accent p-2 ${!input.trim() || isTyping ? "opacity-50" : "hover:brightness-110"}`}
          >
            →
          </button>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <NavigationBar />
    </div>
  );
};

export default Chat;
