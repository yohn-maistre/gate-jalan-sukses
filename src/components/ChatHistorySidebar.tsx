import { useState, useEffect } from "react";
import { X, MessageCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedMessage {
  id: string;
  content: string;
  timestamp: string;
}

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedMessages: SavedMessage[];
  onClearSavedMessages: () => void;
}

const ChatHistorySidebar = ({ 
  isOpen, 
  onClose, 
  savedMessages,
  onClearSavedMessages
}: ChatHistorySidebarProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  const [confirmClear, setConfirmClear] = useState(false);
  
  // Reset state when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
    }
  }, [isOpen]);
  
  // Mock chat history data - would be replaced with actual data from context/storage
  const chatHistory = [
    { id: "1", title: "Tentang persiapan UTBK", date: "2023-06-15T10:30:00Z" },
    { id: "2", title: "Strategi belajar efektif", date: "2023-06-10T14:20:00Z" },
    { id: "3", title: "Tips manajemen waktu", date: "2023-06-05T09:15:00Z" },
  ];
  
  const handleClearSavedMessages = () => {
    if (confirmClear) {
      onClearSavedMessages();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
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
          <h2 className="text-xl font-bold text-jalan-text">Chat</h2>
          <button
            onClick={onClose}
            className="text-jalan-secondary hover:text-jalan-text transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === 'history' 
                ? "text-jalan-accent border-b-2 border-jalan-accent" 
                : "text-jalan-secondary hover:text-jalan-text"
            )}
          >
            <div className="flex items-center justify-center">
              <MessageCircle size={16} className="mr-2" />
              Riwayat Chat
            </div>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === 'saved' 
                ? "text-jalan-accent border-b-2 border-jalan-accent" 
                : "text-jalan-secondary hover:text-jalan-text"
            )}
          >
            <div className="flex items-center justify-center">
              <Bookmark size={16} className="mr-2" />
              Pesan Tersimpan
            </div>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-4">
          {activeTab === 'history' ? (
            <div className="space-y-3">
              {chatHistory.length > 0 ? (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/20 cursor-pointer transition-all"
                  >
                    <h3 className="font-medium text-jalan-text">{chat.title}</h3>
                    <p className="text-xs text-jalan-secondary mt-2">
                      {new Date(chat.date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-jalan-secondary">
                  <p>Belum ada riwayat chat</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {savedMessages.length > 0 ? (
                <>
                  {savedMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/20 transition-all"
                    >
                      <p className="text-jalan-text">{message.content}</p>
                      <p className="text-xs text-jalan-secondary mt-2">
                        {new Date(message.timestamp).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleClearSavedMessages}
                    className={cn(
                      "w-full mt-4 p-2 text-sm rounded-lg border transition-colors",
                      confirmClear
                        ? "bg-red-500/20 border-red-500/30 text-red-400"
                        : "bg-black/20 border-white/10 text-jalan-secondary hover:text-jalan-text hover:border-white/20"
                    )}
                  >
                    {confirmClear ? "Yakin hapus semua pesan?" : "Hapus semua pesan tersimpan"}
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-jalan-secondary">
                  <p>Belum ada pesan tersimpan</p>
                  <p className="text-xs mt-2">Tekan lama pada pesan untuk menyimpannya</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistorySidebar;