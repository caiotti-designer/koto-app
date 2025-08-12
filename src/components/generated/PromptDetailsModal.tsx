"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Copy, Share2, Trash2, Camera, Tag, Plus, Check, ExternalLink, Download, Heart, Star, Bookmark } from 'lucide-react';
export interface Prompt {
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
export interface PromptDetailsModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
  onCopy?: (content: string) => void;
  onShare?: (prompt: Prompt) => void;
  mpid?: string;
}
export default function PromptDetailsModal({
  prompt,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onCopy,
  onShare
}: PromptDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<Prompt | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  React.useEffect(() => {
    if (prompt) {
      setEditedPrompt({
        ...prompt
      });
    }
  }, [prompt]);
  if (!prompt || !isOpen) return null;
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = () => {
    if (editedPrompt && onEdit) {
      onEdit(editedPrompt);
    }
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedPrompt({
      ...prompt
    });
    setIsEditing(false);
  };
  const handleCopy = async () => {
    if (onCopy) {
      onCopy(prompt.content);
    }
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  const handleShare = () => {
    if (onShare) {
      onShare(prompt);
    }
  };
  const handleDelete = () => {
    if (onDelete) {
      onDelete(prompt.id);
    }
    setShowDeleteConfirm(false);
    onClose();
  };
  const handleAddTag = () => {
    if (!newTagInput.trim() || !editedPrompt) return;
    if (editedPrompt.tags.includes(newTagInput.trim())) return;
    setEditedPrompt({
      ...editedPrompt,
      tags: [...editedPrompt.tags, newTagInput.trim()]
    });
    setNewTagInput('');
  };
  const handleRemoveTag = (tagToRemove: string) => {
    if (!editedPrompt) return;
    setEditedPrompt({
      ...editedPrompt,
      tags: editedPrompt.tags.filter(tag => tag !== tagToRemove)
    });
  };
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editedPrompt) {
      const reader = new FileReader();
      reader.onload = e => {
        setEditedPrompt({
          ...editedPrompt,
          coverImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return <AnimatePresence data-magicpath-id="0" data-magicpath-path="PromptDetailsModal.tsx">
      {isOpen && <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} onClick={onClose} data-magicpath-id="1" data-magicpath-path="PromptDetailsModal.tsx">
          <motion.div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" initial={{
        scale: 0.9,
        opacity: 0,
        y: 20
      }} animate={{
        scale: 1,
        opacity: 1,
        y: 0
      }} exit={{
        scale: 0.9,
        opacity: 0,
        y: 20
      }} onClick={e => e.stopPropagation()} data-magicpath-id="2" data-magicpath-path="PromptDetailsModal.tsx">
            {/* Header */}
            <div className="relative" data-magicpath-id="3" data-magicpath-path="PromptDetailsModal.tsx">
              {/* Cover Image */}
              {(editedPrompt?.coverImage || prompt.coverImage) && <div className="relative h-64 overflow-hidden" data-magicpath-id="4" data-magicpath-path="PromptDetailsModal.tsx">
                  <img src={editedPrompt?.coverImage || prompt.coverImage} alt={prompt.title} className="w-full h-full object-cover" data-magicpath-id="5" data-magicpath-path="PromptDetailsModal.tsx" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" data-magicpath-id="6" data-magicpath-path="PromptDetailsModal.tsx" />
                  
                  {/* Edit Cover Image Button */}
                  {isEditing && <div className="absolute top-4 left-4" data-magicpath-id="7" data-magicpath-path="PromptDetailsModal.tsx">
                      <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" id="edit-cover-upload" data-magicpath-id="8" data-magicpath-path="PromptDetailsModal.tsx" />
                      <label htmlFor="edit-cover-upload" className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg cursor-pointer transition-colors" data-magicpath-id="9" data-magicpath-path="PromptDetailsModal.tsx">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm font-medium" data-magicpath-id="10" data-magicpath-path="PromptDetailsModal.tsx">Change Cover</span>
                      </label>
                    </div>}
                </div>}

              {/* Header Actions */}
              <div className="absolute top-4 right-4 flex items-center space-x-2" data-magicpath-id="11" data-magicpath-path="PromptDetailsModal.tsx">
                {!isEditing ? <>
                    {/* Quick Actions */}
                    <motion.button onClick={handleCopy} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors" data-magicpath-id="12" data-magicpath-path="PromptDetailsModal.tsx">
                      {copySuccess ? <Check className="w-5 h-5" data-magicpath-id="13" data-magicpath-path="PromptDetailsModal.tsx" /> : <Copy className="w-5 h-5" data-magicpath-id="14" data-magicpath-path="PromptDetailsModal.tsx" />}
                    </motion.button>
                    
                    <motion.button onClick={handleShare} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors" data-magicpath-id="15" data-magicpath-path="PromptDetailsModal.tsx">
                      <Share2 className="w-5 h-5" data-magicpath-id="16" data-magicpath-path="PromptDetailsModal.tsx" />
                    </motion.button>
                    
                    <motion.button onClick={handleEdit} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors" data-magicpath-id="17" data-magicpath-path="PromptDetailsModal.tsx">
                      <Edit2 className="w-5 h-5" data-magicpath-id="18" data-magicpath-path="PromptDetailsModal.tsx" />
                    </motion.button>
                  </> : <>
                    <motion.button onClick={handleCancel} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors" data-magicpath-id="19" data-magicpath-path="PromptDetailsModal.tsx">
                      Cancel
                    </motion.button>
                    
                    <motion.button onClick={handleSave} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors" data-magicpath-id="20" data-magicpath-path="PromptDetailsModal.tsx">
                      Save
                    </motion.button>
                  </>}
                
                <motion.button onClick={onClose} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors" data-magicpath-id="21" data-magicpath-path="PromptDetailsModal.tsx">
                  <X className="w-5 h-5" data-magicpath-id="22" data-magicpath-path="PromptDetailsModal.tsx" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]" data-magicpath-id="23" data-magicpath-path="PromptDetailsModal.tsx">
              <div className="space-y-6" data-magicpath-id="24" data-magicpath-path="PromptDetailsModal.tsx">
                {/* Title */}
                <div data-magicpath-id="25" data-magicpath-path="PromptDetailsModal.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="26" data-magicpath-path="PromptDetailsModal.tsx">
                    Title
                  </label>
                  {isEditing ? <input type="text" value={editedPrompt?.title || ''} onChange={e => setEditedPrompt(prev => prev ? {
                ...prev,
                title: e.target.value
              } : null)} className="w-full px-4 py-3 text-2xl font-bold border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="27" data-magicpath-path="PromptDetailsModal.tsx" /> : <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight" data-magicpath-id="28" data-magicpath-path="PromptDetailsModal.tsx">
                      {prompt.title}
                    </h1>}
                </div>

                {/* Model & Category */}
                <div className="flex items-center space-x-4" data-magicpath-id="29" data-magicpath-path="PromptDetailsModal.tsx">
                  <div className="flex-1" data-magicpath-id="30" data-magicpath-path="PromptDetailsModal.tsx">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="31" data-magicpath-path="PromptDetailsModal.tsx">
                      Model
                    </label>
                    {isEditing ? <select value={editedPrompt?.model || ''} onChange={e => setEditedPrompt(prev => prev ? {
                  ...prev,
                  model: e.target.value
                } : null)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="32" data-magicpath-path="PromptDetailsModal.tsx">
                        <option value="GPT-4" data-magicpath-id="33" data-magicpath-path="PromptDetailsModal.tsx">GPT-4</option>
                        <option value="Claude" data-magicpath-id="34" data-magicpath-path="PromptDetailsModal.tsx">Claude</option>
                        <option value="Midjourney" data-magicpath-id="35" data-magicpath-path="PromptDetailsModal.tsx">Midjourney</option>
                        <option value="DALL-E" data-magicpath-id="36" data-magicpath-path="PromptDetailsModal.tsx">DALL-E</option>
                        <option value="Writing" data-magicpath-id="37" data-magicpath-path="PromptDetailsModal.tsx">Writing</option>
                        <option value="Coding" data-magicpath-id="38" data-magicpath-path="PromptDetailsModal.tsx">Coding</option>
                      </select> : <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium" data-magicpath-id="39" data-magicpath-path="PromptDetailsModal.tsx">
                        {prompt.model}
                      </span>}
                  </div>
                  
                  <div className="flex-1" data-magicpath-id="40" data-magicpath-path="PromptDetailsModal.tsx">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="41" data-magicpath-path="PromptDetailsModal.tsx">
                      Category
                    </label>
                    <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium" data-magicpath-id="42" data-magicpath-path="PromptDetailsModal.tsx">
                      {prompt.category}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div data-magicpath-id="43" data-magicpath-path="PromptDetailsModal.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="44" data-magicpath-path="PromptDetailsModal.tsx">
                    Tags
                  </label>
                  
                  {isEditing && <div className="flex space-x-2 mb-3" data-magicpath-id="45" data-magicpath-path="PromptDetailsModal.tsx">
                      <input type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddTag()} placeholder="Add new tag" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="46" data-magicpath-path="PromptDetailsModal.tsx" />
                      <button onClick={handleAddTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="47" data-magicpath-path="PromptDetailsModal.tsx">
                        <Plus className="w-4 h-4" data-magicpath-id="48" data-magicpath-path="PromptDetailsModal.tsx" />
                      </button>
                    </div>}
                  
                  <div className="flex flex-wrap gap-2" data-magicpath-id="49" data-magicpath-path="PromptDetailsModal.tsx">
                    {(isEditing ? editedPrompt?.tags : prompt.tags)?.map((tag, index) => <span key={tag} className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${index % 3 === 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : index % 3 === 1 ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'}`} data-magicpath-id="50" data-magicpath-path="PromptDetailsModal.tsx">
                        <Tag className="w-3 h-3 mr-1" data-magicpath-id="51" data-magicpath-path="PromptDetailsModal.tsx" />
                        {tag}
                        {isEditing && <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-500 transition-colors" data-magicpath-id="52" data-magicpath-path="PromptDetailsModal.tsx">
                            <X className="w-3 h-3" data-magicpath-id="53" data-magicpath-path="PromptDetailsModal.tsx" />
                          </button>}
                      </span>)}
                  </div>
                </div>

                {/* Content */}
                <div data-magicpath-id="54" data-magicpath-path="PromptDetailsModal.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="55" data-magicpath-path="PromptDetailsModal.tsx">
                    Prompt Content
                  </label>
                  {isEditing ? <textarea value={editedPrompt?.content || ''} onChange={e => setEditedPrompt(prev => prev ? {
                ...prev,
                content: e.target.value
              } : null)} rows={8} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none" data-magicpath-id="56" data-magicpath-path="PromptDetailsModal.tsx" /> : <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600" data-magicpath-id="57" data-magicpath-path="PromptDetailsModal.tsx">
                      <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-mono" data-magicpath-id="58" data-magicpath-path="PromptDetailsModal.tsx">
                        {prompt.content}
                      </pre>
                    </div>}
                </div>

                {/* Cover Image Management */}
                {isEditing && <div data-magicpath-id="59" data-magicpath-path="PromptDetailsModal.tsx">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="60" data-magicpath-path="PromptDetailsModal.tsx">
                      Cover Image
                    </label>
                    <div className="space-y-3" data-magicpath-id="61" data-magicpath-path="PromptDetailsModal.tsx">
                      <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" id="edit-cover-image-upload" data-magicpath-id="62" data-magicpath-path="PromptDetailsModal.tsx" />
                      <label htmlFor="edit-cover-image-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors" data-magicpath-id="63" data-magicpath-path="PromptDetailsModal.tsx">
                        <div className="text-center" data-magicpath-id="64" data-magicpath-path="PromptDetailsModal.tsx">
                          <Camera className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          <div className="text-sm text-slate-600 dark:text-slate-400" data-magicpath-id="65" data-magicpath-path="PromptDetailsModal.tsx">
                            {editedPrompt?.coverImage ? 'Change cover image' : 'Add cover image'}
                          </div>
                        </div>
                      </label>
                      
                      {editedPrompt?.coverImage && <div className="relative" data-magicpath-id="66" data-magicpath-path="PromptDetailsModal.tsx">
                          <img src={editedPrompt.coverImage} alt="Cover preview" className="w-full h-32 object-cover rounded-xl" data-magicpath-id="67" data-magicpath-path="PromptDetailsModal.tsx" />
                          <button onClick={() => setEditedPrompt(prev => prev ? {
                    ...prev,
                    coverImage: undefined
                  } : null)} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors" data-magicpath-id="68" data-magicpath-path="PromptDetailsModal.tsx">
                            <X className="w-3 h-3" data-magicpath-id="69" data-magicpath-path="PromptDetailsModal.tsx" />
                          </button>
                        </div>}
                    </div>
                  </div>}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-6" data-magicpath-id="70" data-magicpath-path="PromptDetailsModal.tsx">
              <div className="flex items-center justify-between" data-magicpath-id="71" data-magicpath-path="PromptDetailsModal.tsx">
                {/* Left Actions */}
                <div className="flex items-center space-x-3" data-magicpath-id="72" data-magicpath-path="PromptDetailsModal.tsx">
                  {!isEditing && <>
                      <motion.button onClick={handleCopy} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors" data-magicpath-id="73" data-magicpath-path="PromptDetailsModal.tsx">
                        {copySuccess ? <Check className="w-4 h-4" data-magicpath-id="74" data-magicpath-path="PromptDetailsModal.tsx" /> : <Copy className="w-4 h-4" data-magicpath-id="75" data-magicpath-path="PromptDetailsModal.tsx" />}
                        <span className="text-sm font-medium" data-magicpath-id="76" data-magicpath-path="PromptDetailsModal.tsx">
                          {copySuccess ? 'Copied!' : 'Copy'}
                        </span>
                      </motion.button>
                      
                      <motion.button onClick={handleShare} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors" data-magicpath-id="77" data-magicpath-path="PromptDetailsModal.tsx">
                        <Share2 className="w-4 h-4" data-magicpath-id="78" data-magicpath-path="PromptDetailsModal.tsx" />
                        <span className="text-sm font-medium" data-magicpath-id="79" data-magicpath-path="PromptDetailsModal.tsx">Share</span>
                      </motion.button>
                    </>}
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-3" data-magicpath-id="80" data-magicpath-path="PromptDetailsModal.tsx">
                  {!isEditing ? <>
                      <motion.button onClick={handleEdit} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors" data-magicpath-id="81" data-magicpath-path="PromptDetailsModal.tsx">
                        <Edit2 className="w-4 h-4" data-magicpath-id="82" data-magicpath-path="PromptDetailsModal.tsx" />
                        <span className="text-sm font-medium" data-magicpath-id="83" data-magicpath-path="PromptDetailsModal.tsx">Edit</span>
                      </motion.button>
                      
                      <motion.button onClick={() => setShowDeleteConfirm(true)} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors" data-magicpath-id="84" data-magicpath-path="PromptDetailsModal.tsx">
                        <Trash2 className="w-4 h-4" data-magicpath-id="85" data-magicpath-path="PromptDetailsModal.tsx" />
                        <span className="text-sm font-medium" data-magicpath-id="86" data-magicpath-path="PromptDetailsModal.tsx">Delete</span>
                      </motion.button>
                    </> : <>
                      <motion.button onClick={handleCancel} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="px-6 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="87" data-magicpath-path="PromptDetailsModal.tsx">
                        Cancel
                      </motion.button>
                      
                      <motion.button onClick={handleSave} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors" data-magicpath-id="88" data-magicpath-path="PromptDetailsModal.tsx">
                        Save Changes
                      </motion.button>
                    </>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence data-magicpath-id="89" data-magicpath-path="PromptDetailsModal.tsx">
            {showDeleteConfirm && <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={() => setShowDeleteConfirm(false)} data-magicpath-id="90" data-magicpath-path="PromptDetailsModal.tsx">
                <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} exit={{
            scale: 0.9,
            opacity: 0
          }} onClick={e => e.stopPropagation()} data-magicpath-id="91" data-magicpath-path="PromptDetailsModal.tsx">
                  <div className="text-center" data-magicpath-id="92" data-magicpath-path="PromptDetailsModal.tsx">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4" data-magicpath-id="93" data-magicpath-path="PromptDetailsModal.tsx">
                      <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" data-magicpath-id="94" data-magicpath-path="PromptDetailsModal.tsx" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" data-magicpath-id="95" data-magicpath-path="PromptDetailsModal.tsx">
                      Delete Prompt
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6" data-magicpath-id="96" data-magicpath-path="PromptDetailsModal.tsx">
                      Are you sure you want to delete "{prompt.title}"? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3" data-magicpath-id="97" data-magicpath-path="PromptDetailsModal.tsx">
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="98" data-magicpath-path="PromptDetailsModal.tsx">
                        Cancel
                      </button>
                      <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" data-magicpath-id="99" data-magicpath-path="PromptDetailsModal.tsx">
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>}
          </AnimatePresence>
        </motion.div>}
    </AnimatePresence>;
}