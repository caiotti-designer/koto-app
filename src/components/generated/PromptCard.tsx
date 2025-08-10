"use client";

import React from 'react';
import { motion } from 'framer-motion';
export interface PromptCardProps {
  title?: string;
  description?: string;
  tags?: string[];
  model?: string;
  coverImage?: string;
  onClick?: () => void;
  mpid?: string;
}
export default function PromptCard({
  title = "Woman and Tiger",
  description = "A woman in an oversized sweater and trousers walks with her pet...",
  tags = ["sref", "fashion", "photography", "Midjourney"],
  model = "Writing",
  coverImage = "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop&crop=face",
  onClick
}: PromptCardProps) {
  return <motion.div onClick={onClick} whileHover={{
    scale: 1.02,
    y: -8,
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
  }} whileTap={{
    scale: 0.98
  }} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-300 max-w-sm mx-auto" style={{
    fontFamily: 'Space Grotesk, sans-serif'
  }} data-magicpath-id="0" data-magicpath-path="PromptCard.tsx">
      {/* Cover Image */}
      <div className="relative w-full h-48 overflow-hidden" data-magicpath-id="1" data-magicpath-path="PromptCard.tsx">
        <img src={coverImage} alt={title} className="w-full h-full object-cover" data-magicpath-id="2" data-magicpath-path="PromptCard.tsx" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" data-magicpath-id="3" data-magicpath-path="PromptCard.tsx" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4" data-magicpath-id="4" data-magicpath-path="PromptCard.tsx">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight" data-magicpath-id="5" data-magicpath-path="PromptCard.tsx">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2" data-magicpath-id="6" data-magicpath-path="PromptCard.tsx">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2" data-magicpath-id="7" data-magicpath-path="PromptCard.tsx">
          {tags.slice(0, 3).map((tag, index) => <span key={tag} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${index === 0 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : index === 1 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : index === 2 ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`} data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="8" data-magicpath-path="PromptCard.tsx">
              {tag}
            </span>)}
          {tags.length > 3 && <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400" data-magicpath-id="9" data-magicpath-path="PromptCard.tsx">
              +{tags.length - 3}
            </span>}
        </div>

        {/* Model Badge */}
        <div className="flex items-center justify-between pt-2" data-magicpath-id="10" data-magicpath-path="PromptCard.tsx">
          <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 rounded-full" data-magicpath-id="11" data-magicpath-path="PromptCard.tsx">
            {model}
          </span>
          
          {/* Interaction hint */}
          <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-60" data-magicpath-id="12" data-magicpath-path="PromptCard.tsx" />
        </div>
      </div>
    </motion.div>;
}