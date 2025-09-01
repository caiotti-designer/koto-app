"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, X } from 'lucide-react';
import { Button } from '../ui/button';

interface FloatingActionMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onMoveToCategory: () => void;
  position?: { x: number; y: number };
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  isVisible,
  onClose,
  onMoveToCategory,
  position = { x: 0, y: 0 }
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          
          {/* Floating Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[200px]"
            style={{
              left: Math.min(position.x, window.innerWidth - 220),
              top: Math.min(position.y, window.innerHeight - 120),
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Card Actions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveToCategory}
                className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <FolderOpen className="h-4 w-4 mr-2 text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Move to Category
                </span>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionMenu;
