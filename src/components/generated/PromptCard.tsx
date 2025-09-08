"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLongPress } from '../../hooks/useLongPress';
import FloatingActionMenu from '../mobile/FloatingActionMenu';
import CategorySelectionModal from '../mobile/CategorySelectionModal';
export interface PromptCardProps {
  title?: string;
  description?: string;
  tags?: string[];
  model?: string;
  coverImage?: string;
  onClick?: () => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  // Mobile long press props
  onMoveToCategory?: (categoryId: string, subcategoryId?: string) => void;
  currentCategoryId?: string;
  currentSubcategoryId?: string;
  promptId?: string;
  userId?: string;
  readOnly?: boolean;
}
export default function PromptCard({
  title = "Woman and Tiger",
  description = "A woman in an oversized sweater and trousers walks with her pet...",
  tags = ["sref", "fashion", "photography", "Midjourney"],
  model = "Writing",
  coverImage,
  onClick,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onMoveToCategory,
  currentCategoryId,
  currentSubcategoryId,
  promptId,
  userId
  , readOnly = false
}: PromptCardProps) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleLongPress = () => {
    if (isDragging) return;
    
    setIsSelected(true);
    setShowActionMenu(true);
    
    // Calculate menu position (center of screen for mobile)
    const x = window.innerWidth / 2 - 100; // Offset for menu width
    const y = window.innerHeight / 2 - 60; // Offset for menu height
    setMenuPosition({ x, y });
  };

  const handleCloseActionMenu = () => {
    setShowActionMenu(false);
    setIsSelected(false);
  };

  const handleMoveToCategory = () => {
    setShowActionMenu(false);
    setShowCategoryModal(true);
  };

  const handleCategorySelect = (categoryId: string, subcategoryId?: string) => {
    if (onMoveToCategory && promptId) {
      onMoveToCategory(categoryId, subcategoryId);
    }
    setShowCategoryModal(false);
    setIsSelected(false);
  };

  const longPressHandlers = useLongPress({
    onLongPress: handleLongPress,
    onClick,
    threshold: 500
  });
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click during drag operations or when action menu is open
    if (isDragging || showActionMenu) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // onClick is now handled by longPressHandlers
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent motion.div from interfering with drag
    if (e.button === 0) { // Left mouse button
      e.stopPropagation();
    }
  };

  return (
    <div
      draggable={!readOnly}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`${isDragging ? 'cursor-grabbing' : 'cursor-pointer'} transition-all duration-200 group`}
      style={{ fontFamily: 'Space Grotesk, sans-serif', breakInside: 'avoid' }}
    >
    <motion.div 
      onClick={handleClick}
      {...(readOnly ? {} : longPressHandlers.handlers)}
      whileHover={!isDragging && !isSelected ? { scale: 1.02, y: -4 } : {}} 
      whileTap={!isDragging && !isSelected ? { scale: 0.98 } : {}} 
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
    >
    <Card className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 h-full flex flex-col p-0 transition-all duration-200 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600' : ''}`}>
      {/* Cover Image - Only show if provided */}
      {coverImage && <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
          <img src={coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>}

      <CardHeader className={`${!coverImage ? 'pt-6' : 'pt-5'} pb-0 px-6`}>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white leading-tight truncate" title={title}>
          {truncateText(title || '', 30)}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2" title={description}>
          {truncateText(description || '', 80)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pt-4 px-6">

        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag, index) => <Badge key={tag} variant="outline" className={`rounded-full transition-colors truncate max-w-28 ${index === 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : index === 1 ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800'}`} title={tag}>
              {truncateText(tag, 12)}
            </Badge>)}
          {tags.length > 3 && <Badge variant="outline" className="rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600">
              +{tags.length - 3}
            </Badge>}
        </div>
      </CardContent>

      <CardFooter className="relative !pt-4 pb-4 mt-auto px-6 before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-slate-100 dark:before:bg-slate-700">
        <div className="flex justify-end w-full">
          <Badge variant="outline" className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 rounded-full truncate max-w-32" title={model}>
            {truncateText(model || '', 15)}
          </Badge>
        </div>
      </CardFooter>
    </Card>
    </motion.div>
    
    {/* Mobile Action Menu */}
    <FloatingActionMenu
      isVisible={showActionMenu}
      onClose={handleCloseActionMenu}
      onMoveToCategory={handleMoveToCategory}
      position={menuPosition}
    />
    
    {/* Category Selection Modal */}
    <CategorySelectionModal
      isOpen={showCategoryModal}
      onClose={() => {
        setShowCategoryModal(false);
        setIsSelected(false);
      }}
      onSelectCategory={handleCategorySelect}
      itemType="prompt"
      currentCategoryId={currentCategoryId}
      currentSubcategoryId={currentSubcategoryId}
      userId={userId || ''}
    />
    </div>
  );
}
