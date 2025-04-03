
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, Menu, BookmarkIcon } from "lucide-react";
import { generateChatResponse } from "@/lib/llm";
import ChatMessageContextMenu from "@/components/ChatMessageContextMenu";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import MainSidebar from "@/components/MainSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  options?: { label: string; value: string }[];
  timestamp?: string;
}

interface SavedMessage {
  id: string;
  content: string;
  timestamp: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roadmap, roadmaps } = useRoadmap();
  const isMobile = useIsMobile();
  
  // State for messages and input
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // State for sidebars
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);
  const [isChatHistorySidebarOpen, setIsChatHistorySidebarOpen] = useState(false);
  
  // State for context menu
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    x: number;
    y: number;
    messageId: string;
  }>({ isVisible: false, x: 0, y: 0, messageId: "" });
  
  // State for saved messages
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Load saved messages from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem("jalanSuksesSavedMessages");
    if (storedMessages) {
      setSavedMessages(JSON.parse(storedMessages));
    }
  }, []);
  
  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0 && roadmap) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            content: `Halo! Aku siap membantumu mencapai tujuanmu: "${roadmap.goal}". Ada yang bisa aku bantu hari ini?`,
            isUser: false,
            timestamp: new Date().toISOString()
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
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.isVisible) {
        setContextMenu(prev => ({ ...prev, isVisible: false }));
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu.isVisible]);
  
  // Generate response using LLM
  const generateResponse = async (userMessage: string) => {
    // In a real app, this would call the LLM API via the generateChatResponse function
    // For now, we'll use the mock implementation in llm.ts
    try {
      // Convert messages to the format expected by the LLM API
      const messageHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      // Add the new user message
      messageHistory.push({
        role: 'user' as const,
        content: userMessage
      });
      
      // Call the LLM API
      return await generateChatResponse(messageHistory, roadmap?.goal);
    } catch (error) {
      console.error("Error generating response:", error);
      return "Maaf, aku mengalami kesulitan. Bisa coba tanyakan dengan cara lain?";
    }
  };
  
  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      const responseText = await generateResponse(input);
      
      // Randomly decide whether to include options
      const includeOptions = Math.random() > 0.5;
      const options = includeOptions ? [
        { label: "Beri contoh konkret", value: "Beri contoh konkret" },
        { label: "Bagaimana cara memulai?", value: "Bagaimana cara memulai?" }
      ] : undefined;
      
      const botResponse: Message = {
        id: `bot_${Date.now()}`,
        content: responseText,
        isUser: false,
        options,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in chat:", error);
      
      // Fallback response in case of error
      const errorResponse: Message = {
        id: `bot_${Date.now()}`,
        content: "Maaf, aku mengalami kesulitan. Bisa coba tanyakan dengan cara lain?",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleOptionClick = async (value: string) => {
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: value,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      const responseText = await generateResponse(value);
      
      const botResponse: Message = {
        id: `bot_${Date.now()}`,
        content: responseText,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in chat:", error);
      
      // Fallback response in case of error
      const errorResponse: Message = {
        id: `bot_${Date.now()}`,
        content: "Maaf, aku mengalami kesulitan. Bisa coba tanyakan dengan cara lain?",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle right-click on message to save
  const handleMessageContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    
    // Only allow context menu on bot messages
    const message = messages.find(m => m.id === messageId);
    if (!message || message.isUser) return;
    
    setContextMenu({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
      messageId
    });
  };
  
  // Save message to localStorage
  const handleSaveMessage = () => {
    const messageToSave = messages.find(m => m.id === contextMenu.messageId);
    if (!messageToSave) return;
    
    const newSavedMessage: SavedMessage = {
      id: `saved_${Date.now()}`,
      content: messageToSave.content,
      timestamp: messageToSave.timestamp || new Date().toISOString()
    };
    
    const updatedSavedMessages = [...savedMessages, newSavedMessage];
    setSavedMessages(updatedSavedMessages);
    localStorage.setItem("jalanSuksesSavedMessages", JSON.stringify(updatedSavedMessages));
  };
  
  // Clear all saved messages
  const handleClearSavedMessages = () => {
    setSavedMessages([]);
    localStorage.removeItem("jalanSuksesSavedMessages");
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
      {/* Header with menu button and bookmark button */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button
            onClick={() => setIsMainSidebarOpen(true)}
            className="mr-4 p-2 text-jalan-secondary hover:text-jalan-text transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-jalan-text">Chat Mentor</h1>
            <p className="text-jalan-secondary text-xs">Diskusikan langkahmu menuju "{roadmap.goal}"</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsChatHistorySidebarOpen(true)}
            className="p-2 text-jalan-secondary hover:text-jalan-text transition-colors"
            aria-label="Chat history"
          >
            <BookmarkIcon size={20} />
          </button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 flex flex-col px-6 pb-24 space-y-6 overflow-y-auto"
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[90%] animate-text-appear opacity-0",
              message.isUser ? "self-end" : "self-start"
            )}
            style={{ animationDelay: `${index * 0.2}s` }}
            onContextMenu={(e) => handleMessageContextMenu(e, message.id)}
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
                : "bg-black/20 text-jalan-text"
            )}>
              {message.isUser ? (
                message.content
              ) : (
                <TypedText text={message.content} speed={20} />
              )}
            </div>
            
            {/* Options buttons */}
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
          <div className="self-start animate-fade-in">
            <div className="mb-2 text-jalan-secondary text-xs uppercase tracking-wider">
              Mentor
            </div>
            <div className="bg-black/20 p-4 rounded-lg">
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
      
      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4">
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
      
      {/* Context menu for saving messages */}
      <ChatMessageContextMenu
        isVisible={contextMenu.isVisible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu(prev => ({ ...prev, isVisible: false }))}
        onSave={handleSaveMessage}
      />
      
      {/* Chat history sidebar */}
      <ChatHistorySidebar
        isOpen={isChatHistorySidebarOpen}
        onClose={() => setIsChatHistorySidebarOpen(false)}
        savedMessages={savedMessages}
        onClearSavedMessages={handleClearSavedMessages}
      />
      
      {/* Main sidebar */}
      <MainSidebar
        isOpen={isMainSidebarOpen}
        onClose={() => setIsMainSidebarOpen(false)}
      />
    </div>
  );
};

export default Chat;
