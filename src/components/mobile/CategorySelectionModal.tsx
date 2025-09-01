"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, ChevronRight, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { fetchCategories, fetchSubcategories } from '../../lib/data';
import type { CategoryRow, SubcategoryRow } from '../../lib/data';

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string, subcategoryId?: string) => void;
  itemType: 'prompt' | 'tool';
  currentCategoryId?: string;
  currentSubcategoryId?: string;
  userId: string;
}

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  itemType,
  currentCategoryId,
  currentSubcategoryId,
  userId
}) => {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryRow[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories(userId, itemType);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    try {
      const data = await fetchSubcategories(categoryId);
      setSubcategories(data);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      // If clicking the same category, select it directly
      onSelectCategory(categoryId);
      onClose();
    } else {
      // Otherwise, show subcategories
      setSelectedCategoryId(categoryId);
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (selectedCategoryId) {
      onSelectCategory(selectedCategoryId, subcategoryId);
      onClose();
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
  };

  const isCurrentSelection = (categoryId: string, subcategoryId?: string) => {
    return currentCategoryId === categoryId && 
           (subcategoryId ? currentSubcategoryId === subcategoryId : !currentSubcategoryId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[70vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                {selectedCategoryId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToCategories}
                    className="h-8 w-8 p-0 mr-2"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                )}
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {selectedCategoryId ? 'Select Stack' : 'Select Project/Stack'}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-slate-500 dark:text-slate-400">Loading...</div>
                </div>
              ) : selectedCategoryId ? (
                // Subcategories view
                <div className="space-y-3">
                  {/* Option to select category without subcategory */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isCurrentSelection(selectedCategoryId)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => handleCategorySelect(selectedCategoryId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Folder className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {categories.find(c => c.id === selectedCategoryId)?.name} (No Subcategory)
                        </span>
                      </div>
                      {isCurrentSelection(selectedCategoryId) && (
                        <Check className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Subcategories */}
                  {subcategories.map((subcategory) => (
                    <motion.div
                      key={subcategory.id}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isCurrentSelection(selectedCategoryId, subcategory.id)
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                      onClick={() => handleSubcategorySelect(subcategory.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {subcategory.name}
                          </span>
                        </div>
                        {isCurrentSelection(selectedCategoryId, subcategory.id) && (
                          <Check className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                      {'description' in subcategory && typeof subcategory.description === 'string' && subcategory.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 ml-8">
{String(subcategory.description)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                  
                  {subcategories.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No subcategories available
                    </div>
                  )}
                </div>
              ) : (
                // Categories view
                <div className="space-y-3">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        currentCategoryId === category.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Folder className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {category.name}
                            </span>
                            {'description' in category && typeof category.description === 'string' && category.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {currentCategoryId === category.id && (
                            <Check className="h-5 w-5 text-indigo-600" />
                          )}
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {categories.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No categories available
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategorySelectionModal;