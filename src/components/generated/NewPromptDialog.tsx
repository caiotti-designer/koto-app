import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Tag, ChevronDown } from 'lucide-react';
interface Prompt {
  title: string;
  content: string;
  tags: string[];
  model: string;
  category: string;
  coverImage?: string;
  mpid?: string;
}
interface NewPromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
  mpid?: string;
}
const NewPromptDialog: React.FC<NewPromptDialogProps> = ({
  open,
  onClose,
  onSave
}) => {
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
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
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
  return <AnimatePresence data-magicpath-id="0" data-magicpath-path="NewPromptDialog.tsx">
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-magicpath-id="1" data-magicpath-path="NewPromptDialog.tsx">
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} data-magicpath-id="2" data-magicpath-path="NewPromptDialog.tsx" />

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
      }} className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" data-magicpath-id="3" data-magicpath-path="NewPromptDialog.tsx">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200" data-magicpath-id="4" data-magicpath-path="NewPromptDialog.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-magicpath-id="5" data-magicpath-path="NewPromptDialog.tsx">Create New Prompt</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="6" data-magicpath-path="NewPromptDialog.tsx">
                <X className="w-5 h-5 text-gray-500" data-magicpath-id="7" data-magicpath-path="NewPromptDialog.tsx" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]" data-magicpath-id="8" data-magicpath-path="NewPromptDialog.tsx">
              <div className="space-y-6" data-magicpath-id="9" data-magicpath-path="NewPromptDialog.tsx">
                {/* Cover Image */}
                <div data-magicpath-id="10" data-magicpath-path="NewPromptDialog.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="11" data-magicpath-path="NewPromptDialog.tsx">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()} data-magicpath-id="12" data-magicpath-path="NewPromptDialog.tsx">
                    {formData.coverImage ? <img src={formData.coverImage} alt="Cover preview" className="w-full h-32 object-cover rounded-lg" data-magicpath-id="13" data-magicpath-path="NewPromptDialog.tsx" /> : <div data-magicpath-id="14" data-magicpath-path="NewPromptDialog.tsx">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" data-magicpath-id="15" data-magicpath-path="NewPromptDialog.tsx" />
                        <p className="text-gray-500" data-magicpath-id="16" data-magicpath-path="NewPromptDialog.tsx">Click to upload cover image</p>
                      </div>}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" data-magicpath-id="17" data-magicpath-path="NewPromptDialog.tsx" />
                </div>

                {/* Title */}
                <div data-magicpath-id="18" data-magicpath-path="NewPromptDialog.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="19" data-magicpath-path="NewPromptDialog.tsx">
                    Title *
                  </label>
                  <input type="text" value={formData.title} onChange={e => setFormData(prev => ({
                ...prev,
                title: e.target.value
              }))} placeholder="Enter prompt title..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" data-magicpath-id="20" data-magicpath-path="NewPromptDialog.tsx" />
                </div>

                {/* Content */}
                <div data-magicpath-id="21" data-magicpath-path="NewPromptDialog.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="22" data-magicpath-path="NewPromptDialog.tsx">
                    Prompt Content *
                  </label>
                  <textarea ref={textareaRef} value={formData.content} onChange={e => setFormData(prev => ({
                ...prev,
                content: e.target.value
              }))} placeholder="Write your prompt here..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none min-h-[120px]" rows={4} data-magicpath-id="23" data-magicpath-path="NewPromptDialog.tsx" />
                </div>

                {/* Model and Category */}
                <div className="grid grid-cols-2 gap-4" data-magicpath-id="24" data-magicpath-path="NewPromptDialog.tsx">
                  <div className="relative" data-magicpath-id="25" data-magicpath-path="NewPromptDialog.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="26" data-magicpath-path="NewPromptDialog.tsx">
                      Model
                    </label>
                    <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors flex items-center justify-between" data-magicpath-id="27" data-magicpath-path="NewPromptDialog.tsx">
                      <span data-magicpath-id="28" data-magicpath-path="NewPromptDialog.tsx">{formData.model}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" data-magicpath-id="29" data-magicpath-path="NewPromptDialog.tsx" />
                    </button>
                    {showModelDropdown && <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10" data-magicpath-id="30" data-magicpath-path="NewPromptDialog.tsx">
                        {models.map(model => <button key={model} onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      model
                    }));
                    setShowModelDropdown(false);
                  }} className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg" data-magicpath-uuid={(model as any)["mpid"] ?? "unsafe"} data-magicpath-id="31" data-magicpath-path="NewPromptDialog.tsx">
                            {model}
                          </button>)}
                      </div>}
                  </div>

                  <div className="relative" data-magicpath-id="32" data-magicpath-path="NewPromptDialog.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="33" data-magicpath-path="NewPromptDialog.tsx">
                      Category
                    </label>
                    <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors flex items-center justify-between" data-magicpath-id="34" data-magicpath-path="NewPromptDialog.tsx">
                      <span data-magicpath-id="35" data-magicpath-path="NewPromptDialog.tsx">{formData.category}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" data-magicpath-id="36" data-magicpath-path="NewPromptDialog.tsx" />
                    </button>
                    {showCategoryDropdown && <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10" data-magicpath-id="37" data-magicpath-path="NewPromptDialog.tsx">
                        {categories.map(category => <button key={category} onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      category
                    }));
                    setShowCategoryDropdown(false);
                  }} className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="NewPromptDialog.tsx">
                            {category}
                          </button>)}
                      </div>}
                  </div>
                </div>

                {/* Tags */}
                <div data-magicpath-id="39" data-magicpath-path="NewPromptDialog.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="40" data-magicpath-path="NewPromptDialog.tsx">
                    Tags
                  </label>
                  <div className="space-y-2" data-magicpath-id="41" data-magicpath-path="NewPromptDialog.tsx">
                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type a tag and press Enter..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" data-magicpath-id="42" data-magicpath-path="NewPromptDialog.tsx" />
                    {formData.tags.length > 0 && <div className="flex flex-wrap gap-2" data-magicpath-id="43" data-magicpath-path="NewPromptDialog.tsx">
                        {formData.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full" data-magicpath-id="44" data-magicpath-path="NewPromptDialog.tsx">
                            <Tag className="w-3 h-3 mr-1" data-magicpath-id="45" data-magicpath-path="NewPromptDialog.tsx" />
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-indigo-500 hover:text-indigo-700" data-magicpath-id="46" data-magicpath-path="NewPromptDialog.tsx">
                              <X className="w-3 h-3" data-magicpath-id="47" data-magicpath-path="NewPromptDialog.tsx" />
                            </button>
                          </span>)}
                      </div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200" data-magicpath-id="48" data-magicpath-path="NewPromptDialog.tsx">
              <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="49" data-magicpath-path="NewPromptDialog.tsx">
                Cancel
              </button>
              <motion.button onClick={handleSave} disabled={!isValid || isSaving} className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${isValid && !isSaving ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} whileTap={{
            scale: 0.98
          }} data-magicpath-id="50" data-magicpath-path="NewPromptDialog.tsx">
                <Save className="w-4 h-4" data-magicpath-id="51" data-magicpath-path="NewPromptDialog.tsx" />
                <span data-magicpath-id="52" data-magicpath-path="NewPromptDialog.tsx">{isSaving ? 'Saving...' : 'Save Prompt'}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>}
    </AnimatePresence>;
};
export default NewPromptDialog;