import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Tag, ChevronDown, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useTheme } from '../../contexts/ThemeContext';
interface Prompt {
  title: string;
  content: string;
  tags: string[];
  model: string;
  category: string;
  coverImage?: string;
}
interface NewPromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
}
const NewPromptDialog: React.FC<NewPromptDialogProps> = ({
  open,
  onClose,
  onSave
}) => {
  const { actualTheme } = useTheme();
  const [formData, setFormData] = useState<Prompt>({
    title: '',
    content: '',
    tags: [],
    model: 'GPT-4',
    category: 'General',
    coverImage: undefined
  });
  const [tagInput, setTagInput] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const models = ['GPT-4', 'GPT-3.5', 'Claude-3', 'Claude-2', 'Gemini Pro'];
  const categories = ['General', 'Writing', 'Development', 'Analysis', 'Creative', 'Business'];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.content]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        title: '',
        content: '',
        tags: [],
        model: 'GPT-4',
        category: 'General',
        coverImage: undefined
      });
      setTagInput('');
    }
  }, [open]);
  const handleAddTag = (e?: React.KeyboardEvent) => {
    if ((e?.key === 'Enter' || !e) && tagInput.trim()) {
      e?.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          setFormData(prev => ({
            ...prev,
            coverImage: e.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    setIsSaving(true);

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSaving(false);
  };
  const isValid = formData.title.trim() && formData.content.trim();
  return <AnimatePresence>
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          {/* Dialog */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Prompt</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {formData.coverImage ? <img src={formData.coverImage} alt="Cover preview" className="w-full h-32 object-cover rounded-lg" /> : <div>
                        <Upload className="w-8 h-8 text-gray-400 dark:text-slate-500 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-slate-400">Click to upload cover image</p>
                      </div>}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Title *
                  </label>
                  <input type="text" value={formData.title} onChange={e => setFormData(prev => ({
                ...prev,
                title: e.target.value
              }))} placeholder="Enter prompt title..." className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Prompt Content *
                  </label>
                  <textarea ref={textareaRef} value={formData.content} onChange={e => setFormData(prev => ({
                ...prev,
                content: e.target.value
              }))} placeholder="Write your prompt here..." className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none min-h-[120px]" rows={4} />
                </div>

                {/* Model and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Model
                    </label>
                    <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors flex items-center justify-between">
                      <span>{formData.model}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    </button>
                    {showModelDropdown && <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        {models.map(model => <button key={model} onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      model
                    }));
                    setShowModelDropdown(false);
                  }} className="w-full px-3 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg transition-colors">
                            {model}
                          </button>)}
                      </div>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors flex items-center justify-between">
                      <span>{formData.category}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    </button>
                    {showCategoryDropdown && <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        {categories.map(category => <button key={category} onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      category
                    }));
                    setShowCategoryDropdown(false);
                  }} className="w-full px-3 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg transition-colors">
                            {category}
                          </button>)}
                      </div>}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type a tag and press Enter..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                      <button onClick={() => handleAddTag()} className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {formData.tags.length > 0 && <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => <Badge key={index} variant="outline" className="bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700 rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-indigo-500 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-100">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>)}
                      </div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
              <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cancel
              </button>
              <motion.button onClick={handleSave} disabled={!isValid || isSaving} className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${isValid && !isSaving ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} whileTap={{
            scale: 0.98
          }}>
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Prompt'}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>}
    </AnimatePresence>;
};
export default NewPromptDialog;