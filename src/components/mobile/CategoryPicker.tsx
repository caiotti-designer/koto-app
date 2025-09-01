"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Folder, FolderPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import type { CategoryRow, SubcategoryRow } from '../../lib/data';

interface CategoryPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string, subcategoryId?: string) => void;
  categories: CategoryRow[];
  subcategories: SubcategoryRow[];
  currentCategoryId?: string;
  currentSubcategoryId?: string;
  itemType: 'prompt' | 'tool';
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  categories,
  subcategories,
  currentCategoryId,
  currentSubcategoryId,
  itemType
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get subcategories for the selected category
  const availableSubcategories = selectedCategoryId
    ? subcategories.filter(sub => sub.category_id === selectedCategoryId)
    : [];

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryId(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      // If clicking the same category, select it directly
      onSelectCategory(categoryId);
    } else {
      // Show subcategories for this category
      setSelectedCategoryId(categoryId);
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (selectedCategoryId) {
      onSelectCategory(selectedCategoryId, subcategoryId);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Category Picker Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-20 bottom-20 z-50 flex items-center justify-center"
          >
            <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl w-full max-w-md h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div>
                  <h3 className="text-white font-semibold text-xl">
                    {selectedCategoryId ? 'Select Subcategory' : 'Move to Category'}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {selectedCategoryId 
                      ? 'Choose a subcategory or select the main category'
                      : `Choose where to move this ${itemType}`
                    }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full p-2 h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Search */}
              {!selectedCategoryId && (
                <div className="p-4 border-b border-slate-700/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-slate-500"
                    />
                  </div>
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {!selectedCategoryId ? (
                  /* Categories List */
                  <div className="space-y-2">
                    {filteredCategories.map((category, index) => {
                      const isCurrentCategory = category.id === currentCategoryId;
                      return (
                        <motion.button
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 text-left ${
                            isCurrentCategory
                              ? 'bg-blue-900/30 border border-blue-700/50 text-blue-300'
                              : 'bg-slate-700/30 hover:bg-slate-700/50 text-white'
                          }`}
                        >
                          <Folder className="h-5 w-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate block">{category.name}</span>
                          </div>
                          {isCurrentCategory && (
                            <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700">
                              Current
                            </Badge>
                          )}
                        </motion.button>
                      );
                    })}
                    
                    {filteredCategories.length === 0 && (
                      <div className="text-center py-8">
                        <FolderPlus className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400">No categories found</p>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your search</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Subcategories List */
                  <div className="space-y-2">
                    {/* Back button and main category option */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleBackToCategories}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-white transition-all duration-200 text-left mb-4"
                    >
                      <span className="text-slate-400">← Back to categories</span>
                    </motion.button>
                    
                    {/* Main category option */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => selectedCategoryId && onSelectCategory(selectedCategoryId)}
                      className="w-full flex items-center space-x-3 p-4 rounded-xl bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 hover:bg-indigo-900/50 transition-all duration-200 text-left"
                    >
                      <Folder className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium">
                          {categories.find(c => c.id === selectedCategoryId)?.name} (Main)
                        </span>
                        <span className="text-sm text-indigo-400 block mt-1">
                          Move to main category
                        </span>
                      </div>
                    </motion.button>
                    
                    {/* Subcategories */}
                    {availableSubcategories.map((subcategory, index) => {
                      const isCurrentSubcategory = subcategory.id === currentSubcategoryId;
                      return (
                        <motion.button
                          key={subcategory.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (index + 2) * 0.05 }}
                          onClick={() => handleSubcategorySelect(subcategory.id)}
                          className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 text-left ${
                            isCurrentSubcategory
                              ? 'bg-blue-900/30 border border-blue-700/50 text-blue-300'
                              : 'bg-slate-700/30 hover:bg-slate-700/50 text-white'
                          }`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-slate-500 rounded-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate block">{subcategory.name}</span>
                            {'description' in subcategory && typeof subcategory.description === 'string' && (
                              <span className="text-sm text-slate-400 truncate block mt-1">
                                {subcategory.description}
                              </span>
                            )}
                          </div>
                          {isCurrentSubcategory && (
                            <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700">
                              Current
                            </Badge>
                          )}
                        </motion.button>
                      );
                    })}
                    
                    {availableSubcategories.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-slate-400">No subcategories available</p>
                        <p className="text-slate-500 text-sm mt-1">Select the main category above</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryPicker;