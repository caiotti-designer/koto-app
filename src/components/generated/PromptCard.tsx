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
  coverImage,
  onClick
}: PromptCardProps) {
  return <motion.div onClick={onClick} whileHover={{
    scale: 1.02,
    y: -4
  }} whileTap={{
    scale: 0.98
  }} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-300 group" style={{
    fontFamily: 'Space Grotesk, sans-serif'
  }} data-magicpath-id="0" data-magicpath-path="PromptCard.tsx">
      {/* Cover Image - Only show if provided */}
      {coverImage && <div className="relative w-full h-48 overflow-hidden" data-magicpath-id="1" data-magicpath-path="PromptCard.tsx">
          <img src={coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-magicpath-id="2" data-magicpath-path="PromptCard.tsx" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" data-magicpath-id="3" data-magicpath-path="PromptCard.tsx" />
        </div>}

      {/* Content */}
      <div className={`p-5 space-y-4 ${!coverImage ? 'pt-6' : ''}`} data-magicpath-id="4" data-magicpath-path="PromptCard.tsx">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight" data-magicpath-id="5" data-magicpath-path="PromptCard.tsx">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2" data-magicpath-id="6" data-magicpath-path="PromptCard.tsx">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5" data-magicpath-id="7" data-magicpath-path="PromptCard.tsx">
          {tags.slice(0, 3).map((tag, index) => <span key={tag} className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${index === 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : index === 1 ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'}`} data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="8" data-magicpath-path="PromptCard.tsx">
              {tag}
            </span>)}
          {tags.length > 3 && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600" data-magicpath-id="9" data-magicpath-path="PromptCard.tsx">
              +{tags.length - 3}
            </span>}
        </div>

        {/* Model Badge */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4" data-magicpath-id="10" data-magicpath-path="PromptCard.tsx">
          <div className="flex justify-end" data-magicpath-id="11" data-magicpath-path="PromptCard.tsx">
            <span className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600" data-magicpath-id="12" data-magicpath-path="PromptCard.tsx">
              {model}
            </span>
          </div>
        </div>
      </div>
    </motion.div>;
}