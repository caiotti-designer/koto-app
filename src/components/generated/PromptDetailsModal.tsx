"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Copy, Share2, Trash2, Camera, Tag, Plus, Check, ExternalLink, Download, Heart, Star, Bookmark, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  model: string;
  category: string;
  subcategory?: string; // Add subcategory field
  coverImage?: string;
  createdAt: Date;
}
export interface PromptDetailsModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
  onCopy?: (content: string) => void;
  onShare?: (prompt: Prompt) => void;
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
  const [customModel, setCustomModel] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  React.useEffect(() => {
    if (prompt) {
      setEditedPrompt({
        ...prompt
      });
    }
    // Reset edit-related states when the selected prompt changes
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setCopySuccess(false);
  }, [prompt]);
  // Ensure clean state whenever the modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      setShowDeleteConfirm(false);
      setCopySuccess(false);
    }
  }, [isOpen]);
  if (!prompt || !isOpen) return null;
  const handleEdit = () => {
    setEditedPrompt({
      ...prompt
    });
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
  return <AnimatePresence>
      {isOpen && <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} onClick={onClose}>
          <motion.div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" initial={{
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
      }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="relative">
              {/* Cover Image */}
              {(editedPrompt?.coverImage || prompt.coverImage) && <div className="relative h-64 overflow-hidden">
                  <img src={editedPrompt?.coverImage || prompt.coverImage} alt={prompt.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Edit Cover Image Button */}
                  {isEditing && <div className="absolute top-4 left-4">
                      <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" id="edit-cover-upload" />
                      <label htmlFor="edit-cover-upload" className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg cursor-pointer transition-colors">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm font-medium">Change Cover</span>
                      </label>
                    </div>}
                </div>}

              {/* Header Actions: only Close button (adaptive) */}
              {(() => {
                const hasCover = Boolean(editedPrompt?.coverImage || prompt.coverImage);
                return (
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute top-4 right-4 rounded-xl transition-colors ${hasCover ? 'p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' : 'p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600'}`}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                );
              })()}
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Title
                  </Label>
                  {isEditing ? <Input type="text" value={editedPrompt?.title || ''} onChange={e => setEditedPrompt(prev => prev ? {
                ...prev,
                title: e.target.value
              } : null)} className="w-full px-4 py-3 text-2xl font-bold" /> : <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                      {prompt.title}
                    </h1>}
                </div>

                {/* Model, Category & Tags - Inline Layout */}
                <div className="flex flex-wrap gap-4">
                  {/* Model */}
                  <div className="flex-shrink-0 min-w-fit">
                    <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Model
                    </Label>
                    {isEditing ? <div className="space-y-2">
                         <div className="relative">
                           <select value={!['GPT-4', 'Claude', 'Midjourney', 'DALL-E', 'Writing', 'Coding'].includes(editedPrompt?.model || '') ? 'custom' : editedPrompt?.model || ''} onChange={e => {
                              if (e.target.value === 'custom') {
                                setCustomModel(editedPrompt?.model || '');
                              } else {
                                setEditedPrompt(prev => prev ? {
                                  ...prev,
                                  model: e.target.value
                                } : null);
                                setCustomModel('');
                              }
                            }} className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white appearance-none">
                             <option value="GPT-4">GPT-4</option>
                             <option value="Claude">Claude</option>
                             <option value="Midjourney">Midjourney</option>
                             <option value="DALL-E">DALL-E</option>
                             <option value="Writing">Writing</option>
                             <option value="Coding">Coding</option>
                             <option value="custom">Custom Model...</option>
                           </select>
                           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                         </div>
                         {(!['GPT-4', 'Claude', 'Midjourney', 'DALL-E', 'Writing', 'Coding'].includes(editedPrompt?.model || '') || customModel) && (
                           <Input
                             type="text"
                             value={customModel || editedPrompt?.model || ''}
                             onChange={e => {
                               const value = e.target.value;
                               setCustomModel(value);
                               setEditedPrompt(prev => prev ? {
                                 ...prev,
                                 model: value
                               } : null);
                             }}
                             placeholder="Enter custom model name"
                             className="w-full px-3 py-2 text-sm"
                           />
                         )}
                       </div> : <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                        {prompt.model}
                      </span>}
                  </div>
                  
                  {/* Category */}
                  <div className="flex-shrink-0 min-w-fit">
                    <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </Label>
                    <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium">
                      {prompt.category}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex-1 min-w-[250px]">
                    <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tags
                    </Label>
                    
                    {isEditing && <div className="flex space-x-2 mb-3">
                        <Input type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddTag()} placeholder="Add new tag" className="flex-1 px-3 py-2 text-sm" />
                        <Button onClick={handleAddTag} className="px-3 py-2">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>}
                    
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? editedPrompt?.tags : prompt.tags)?.map((tag, index) => <Badge key={tag} variant="outline" className={`rounded-full transition-colors ${index % 3 === 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : index % 3 === 1 ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800'}`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          {isEditing && <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-500 transition-colors">
                              <X className="w-3 h-3" />
                            </button>}
                        </Badge>)}
                    </div>
                  </div>
                </div>

                {/* Content - Taller with more space */}
                <div className="mt-8">
                  <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                    Prompt Content
                  </Label>
                  {isEditing ? <Textarea value={editedPrompt?.content || ''} onChange={e => setEditedPrompt(prev => prev ? {
                ...prev,
                content: e.target.value
              } : null)} rows={12} className="w-full px-6 py-4 resize-none text-base leading-relaxed" /> : <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600 min-h-[300px]">
                      <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-base leading-relaxed font-mono">
                        {prompt.content}
                      </pre>
                    </div>}
                </div>

                {/* Cover Image Management: show uploader only when no cover exists */}
                {isEditing && !(editedPrompt?.coverImage || prompt.coverImage) && <div>
                    <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Cover Image
                    </Label>
                    <div className="space-y-3">
                      <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" id="edit-cover-image-upload" />
                      <label htmlFor="edit-cover-image-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors">
                        <div className="text-center">
                          <Camera className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          <div className="text-sm text-slate-600 dark:text-slate-400">Add cover image</div>
                        </div>
                      </label>
                    </div>
                  </div>}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                {/* Left Actions */}
                <div className="flex items-center space-x-3">
                  {!isEditing && <>
                      <motion.button onClick={handleCopy} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="text-sm font-medium">
                          {copySuccess ? 'Copied!' : 'Copy'}
                        </span>
                      </motion.button>
                      
                      <motion.button onClick={handleShare} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Share</span>
                      </motion.button>
                    </>}
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-3">
                  {!isEditing ? <>
                      <motion.button onClick={handleEdit} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors">
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </motion.button>
                      
                      <motion.button onClick={() => setShowDeleteConfirm(true)} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </motion.button>
                     </> : <>
                      <motion.button onClick={handleCancel} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
                        <span className="text-sm font-medium">Cancel</span>
                      </motion.button>
                      
                      <motion.button onClick={handleSave} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors">
                        <span className="text-sm font-medium">Save Changes</span>
                      </motion.button>
                    </>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={() => setShowDeleteConfirm(false)}>
                <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} exit={{
            scale: 0.9,
            opacity: 0
          }} onClick={e => e.stopPropagation()}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Delete Prompt
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Are you sure you want to delete "{prompt.title}"? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <motion.button 
                        onClick={() => setShowDeleteConfirm(false)} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button 
                        onClick={handleDelete} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>}
          </AnimatePresence>
        </motion.div>}
    </AnimatePresence>;
}