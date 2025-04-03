import React, { useState, useRef, useEffect } from 'react';
import { Check, X, BookmarkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageContextMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ChatMessageContextMenu: React.FC<ChatMessageContextMenuProps> = ({
  x,
  y,
  isVisible,
  onClose,
  onSave,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  
  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isVisible, onClose]);
  
  // Auto-hide confirmation after 2 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSaveConfirmation) {
      timer = setTimeout(() => {
        setShowSaveConfirmation(false);
        onClose();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSaveConfirmation, onClose]);
  
  const handleSave = () => {
    onSave();
    setShowSaveConfirmation(true);
  };
  
  if (!isVisible) return null;
  
  // Adjust position to ensure menu stays within viewport
  const menuStyle = {
    top: `${y}px`,
    left: `${x}px`,
  };
  
  return (
    <div 
      ref={menuRef}
      className="fixed z-50 min-w-[160px] bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl animate-fade-in"
      style={menuStyle}
    >
      {showSaveConfirmation ? (
        <div className="p-3 flex items-center text-green-400">
          <Check size={16} className="mr-2" />
          <span className="text-sm">Pesan disimpan</span>
        </div>
      ) : (
        <button
          onClick={handleSave}
          className="w-full p-3 flex items-center text-jalan-text hover:bg-white/5 rounded-lg transition-colors"
        >
          <BookmarkIcon size={16} className="mr-2" />
          <span className="text-sm">Simpan pesan</span>
        </button>
      )}
    </div>
  );
};

export default ChatMessageContextMenu;