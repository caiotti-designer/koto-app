import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Calendar, Tag, Copy, MoreHorizontal } from 'lucide-react';
interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  model: string;
  category: string;
  coverImage?: string;
  createdAt: Date;
  mpid?: string;
}
interface PromptCardProps {
  prompt: Prompt;
  onUpdateCover: (coverImage: string) => void;
  mpid?: string;
}
const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onUpdateCover
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          onUpdateCover(e.target.result as string);
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          onUpdateCover(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.content);
    // In a real app, you'd show a toast notification here
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  return <motion.div layout initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} whileHover={{
    y: -4
  }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group" data-magicpath-id="0" data-magicpath-path="PromptCard.tsx">
      {/* Cover Image Area */}
      <div className={`relative h-32 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-gray-100 ${isDragOver ? 'bg-indigo-100' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} data-magicpath-id="1" data-magicpath-path="PromptCard.tsx">
        {prompt.coverImage ? <img src={prompt.coverImage} alt={prompt.title} className="w-full h-full object-cover" data-magicpath-id="2" data-magicpath-path="PromptCard.tsx" /> : <div className="flex items-center justify-center h-full" data-magicpath-id="3" data-magicpath-path="PromptCard.tsx">
            <div className="text-center" data-magicpath-id="4" data-magicpath-path="PromptCard.tsx">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2" data-magicpath-id="5" data-magicpath-path="PromptCard.tsx">
                <span className="text-indigo-600 text-xl font-bold" data-magicpath-id="6" data-magicpath-path="PromptCard.tsx">
                  {prompt.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500" data-magicpath-id="7" data-magicpath-path="PromptCard.tsx">Drop image or click to upload</p>
            </div>
          </div>}
        
        {/* Upload Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${isDragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} data-magicpath-id="8" data-magicpath-path="PromptCard.tsx">
          <button onClick={() => fileInputRef.current?.click()} className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all" data-magicpath-id="9" data-magicpath-path="PromptCard.tsx">
            <Upload className="w-4 h-4" data-magicpath-id="10" data-magicpath-path="PromptCard.tsx" />
            <span data-magicpath-id="11" data-magicpath-path="PromptCard.tsx">Upload Cover</span>
          </button>
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 right-3" data-magicpath-id="12" data-magicpath-path="PromptCard.tsx">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg transition-all opacity-0 group-hover:opacity-100" data-magicpath-id="13" data-magicpath-path="PromptCard.tsx">
            <MoreHorizontal className="w-4 h-4 text-gray-600" data-magicpath-id="14" data-magicpath-path="PromptCard.tsx" />
          </button>
          
          {showMenu && <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]" data-magicpath-id="15" data-magicpath-path="PromptCard.tsx">
              <button onClick={handleCopyPrompt} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2" data-magicpath-id="16" data-magicpath-path="PromptCard.tsx">
                <Copy className="w-4 h-4" data-magicpath-id="17" data-magicpath-path="PromptCard.tsx" />
                <span data-magicpath-id="18" data-magicpath-path="PromptCard.tsx">Copy</span>
              </button>
            </div>}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" data-magicpath-id="19" data-magicpath-path="PromptCard.tsx" />
      </div>

      {/* Content */}
      <div className="p-4" data-magicpath-id="20" data-magicpath-path="PromptCard.tsx">
        <div className="flex items-start justify-between mb-3" data-magicpath-id="21" data-magicpath-path="PromptCard.tsx">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight" data-magicpath-id="22" data-magicpath-path="PromptCard.tsx">
            {prompt.title}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 flex-shrink-0" data-magicpath-id="23" data-magicpath-path="PromptCard.tsx">
            {prompt.model}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3" data-magicpath-id="24" data-magicpath-path="PromptCard.tsx">
          {prompt.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4" data-magicpath-id="25" data-magicpath-path="PromptCard.tsx">
          {prompt.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full" data-magicpath-id="26" data-magicpath-path="PromptCard.tsx">
              <Tag className="w-3 h-3 mr-1" data-magicpath-id="27" data-magicpath-path="PromptCard.tsx" />
              {tag}
            </span>)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500" data-magicpath-id="28" data-magicpath-path="PromptCard.tsx">
          <div className="flex items-center space-x-1" data-magicpath-id="29" data-magicpath-path="PromptCard.tsx">
            <Calendar className="w-3 h-3" data-magicpath-id="30" data-magicpath-path="PromptCard.tsx" />
            <span data-magicpath-id="31" data-magicpath-path="PromptCard.tsx">{formatDate(prompt.createdAt)}</span>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded-full" data-magicpath-id="32" data-magicpath-path="PromptCard.tsx">
            {prompt.category}
          </span>
        </div>
      </div>
    </motion.div>;
};
export default PromptCard;