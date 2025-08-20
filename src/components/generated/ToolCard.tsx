"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';

export interface ToolCardProps {
  name?: string;
  description?: string;
  category?: string;
  stack?: string;
  substack?: string;
  url?: string;
  favicon?: string;
  onClick?: () => void;
}

export default function ToolCard({
  name = "Tool Name",
  description,
  category = "General",
  stack,
  substack,
  url = "",
  favicon,
  onClick
}: ToolCardProps) {
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <motion.div 
      onClick={onClick} 
      whileHover={{
        scale: 1.02,
        y: -4
      }} 
      whileTap={{
        scale: 0.98
      }} 
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }} 
      className="cursor-pointer transition-all duration-200 group" 
      style={{
        fontFamily: 'Space Grotesk, sans-serif'
      }}
    >
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
        <CardHeader style={{paddingBottom: '2px'}} className="flex items-center justify-center">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {favicon && (
              <img 
                src={favicon} 
                alt={`${name} favicon`} 
                className="w-10 h-10 rounded-lg flex-shrink-0" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} 
              />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white truncate" title={name}>
                {truncateText(name || '', 25)}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-0" style={{paddingBottom: '2px'}}>
          {description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2" title={description}>
              {truncateText(description, 100)}
            </p>
          )}
        </CardContent>

        <CardFooter className="relative mt-auto px-6 before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-slate-100 dark:before:bg-slate-700 flex items-center justify-center" style={{paddingTop: '16px', paddingBottom: '4px'}}>
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1" title={url}>
                {truncateText(url, 30)}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
            </div>
            {(stack || substack) && (
              <div className="flex items-center space-x-2 justify-start mt-4">
                {stack && (
                  <Badge variant="outline" className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 rounded-full text-xs" title={stack}>
                    {truncateText(stack, 15)}
                  </Badge>
                )}
                {substack && (
                  <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 rounded-full text-xs" title={substack}>
                    {truncateText(substack, 15)}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}