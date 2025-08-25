"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search, Code, Database, Globe, Palette, Settings, Star, Heart, Zap, Shield, Camera, Target, Users, BarChart3, Figma, Cpu, Tag, Server, Terminal, Route, Boxes, Workflow, FileCode, Code2, Coffee, Hash, Activity, Gem, Smartphone, Leaf, MemoryStick, Archive, Flame, Cloud, CloudSnow, CloudRain, Triangle, Container, GitBranch, Building, Tablet, Phone, Paintbrush, Image, Pen, Brush, Circle, Layout, CheckSquare, Eye, Monitor, Bug, Sparkles, Book, Calculator, Diamond, Link, Wrench, Package, CreditCard, Gamepad2, Gamepad, Box, ShoppingBag, TrendingUp, Stethoscope, GraduationCap, Music, Plane, Car, Wifi, Truck, Briefcase, FileText, Lock, Key, Layers, Calendar, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

// Icon options for projects/stacks - matching desktop version
const iconOptions = [
  // Frontend Frameworks & Libraries
  { name: 'React', icon: Code },
  { name: 'Vue', icon: Zap },
  { name: 'Angular', icon: Target },
  { name: 'Svelte', icon: Zap },
  { name: 'Next.js', icon: Globe },
  
  // Backend & Runtime
  { name: 'Node.js', icon: Server },
  { name: 'Deno', icon: Terminal },
  { name: 'Express', icon: Route },
  { name: 'NestJS', icon: Boxes },
  { name: 'Koa', icon: Workflow },
  
  // Programming Languages
  { name: 'JavaScript', icon: FileCode },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Python', icon: FileCode },
  { name: 'Java', icon: Coffee },
  { name: 'C#', icon: Hash },
  { name: 'Go', icon: Activity },
  { name: 'Rust', icon: Cpu },
  { name: 'Ruby', icon: Gem },
  { name: 'Swift', icon: Smartphone },
  { name: 'Kotlin', icon: Smartphone },
  { name: 'Dart', icon: Target },
  
  // Databases
  { name: 'PostgreSQL', icon: Database },
  { name: 'MySQL', icon: Database },
  { name: 'MongoDB', icon: Leaf },
  { name: 'Redis', icon: MemoryStick },
  { name: 'SQLite', icon: Archive },
  { name: 'Firebase', icon: Flame },
  
  // Cloud & DevOps
  { name: 'AWS', icon: Cloud },
  { name: 'Azure', icon: CloudSnow },
  { name: 'GCP', icon: CloudRain },
  { name: 'Vercel', icon: Triangle },
  { name: 'Netlify', icon: Globe },
  { name: 'Docker', icon: Container },
  { name: 'Kubernetes', icon: Boxes },
  { name: 'GitHub Actions', icon: GitBranch },
  { name: 'Terraform', icon: Building },
  
  // Mobile Development
  { name: 'React Native', icon: Smartphone },
  { name: 'Flutter', icon: Tablet },
  { name: 'Ionic', icon: Phone },
  { name: 'iOS', icon: Smartphone },
  { name: 'Android', icon: Smartphone },
  
  // Design & UI
  { name: 'Figma', icon: Figma },
  { name: 'Adobe XD', icon: Palette },
  { name: 'Sketch', icon: Paintbrush },
  { name: 'Photoshop', icon: Image },
  { name: 'Illustrator', icon: Pen },
  { name: 'Tailwind CSS', icon: Brush },
  { name: 'Material UI', icon: Circle },
  { name: 'Chakra UI', icon: Circle },
  { name: 'Ant Design', icon: Layout },
  
  // Testing & Quality
  { name: 'Jest', icon: CheckSquare },
  { name: 'Cypress', icon: Eye },
  { name: 'Playwright', icon: Monitor },
  { name: 'Selenium', icon: Bug },
  { name: 'Vitest', icon: Zap },
  
  // AI & Machine Learning
  { name: 'TensorFlow', icon: Cpu },
  { name: 'PyTorch', icon: Flame },
  { name: 'OpenAI', icon: Sparkles },
  { name: 'Jupyter', icon: Book },
  { name: 'Pandas', icon: BarChart3 },
  { name: 'NumPy', icon: Calculator },
  
  // Blockchain & Web3
  { name: 'Ethereum', icon: Diamond },
  { name: 'Solidity', icon: FileCode },
  { name: 'Web3.js', icon: Link },
  { name: 'Hardhat', icon: Wrench },
  { name: 'MetaMask', icon: CreditCard },
  
  // Gaming
  { name: 'Unity', icon: Gamepad2 },
  { name: 'Unreal Engine', icon: Gamepad },
  { name: 'Three.js', icon: Box },
  
  // Industry Categories
  { name: 'E-commerce', icon: ShoppingBag },
  { name: 'Finance', icon: CreditCard },
  { name: 'FinTech', icon: TrendingUp },
  { name: 'Healthcare', icon: Heart },
  { name: 'MedTech', icon: Stethoscope },
  { name: 'Education', icon: Book },
  { name: 'EdTech', icon: GraduationCap },
  { name: 'Social Media', icon: Users },
  { name: 'Entertainment', icon: Music },
  { name: 'Travel', icon: Plane },
  { name: 'Automotive', icon: Car },
  { name: 'IoT', icon: Wifi },
  { name: 'Logistics', icon: Truck },
  
  // Project Types
  { name: 'Web App', icon: Globe },
  { name: 'Mobile App', icon: Smartphone },
  { name: 'Desktop App', icon: Monitor },
  { name: 'API Service', icon: Server },
  { name: 'Library', icon: Package },
  { name: 'CLI Tool', icon: Terminal },
  
  // Tools & Utilities
  { name: 'Webpack', icon: Package },
  { name: 'Vite', icon: Zap },
  
  // Security
  { name: 'Security', icon: Shield },
  { name: 'Authentication', icon: Key },
  { name: 'Authorization', icon: Lock },
  
  // Generic/Fallback
  { name: 'Frontend', icon: Monitor },
  { name: 'Backend', icon: Server },
  { name: 'Full Stack', icon: Layers },
  { name: 'DevOps', icon: Wrench },
  { name: 'Design', icon: Palette },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Productivity', icon: Calendar },
  { name: 'Time Tracking', icon: Clock },
  { name: 'Project Management', icon: Briefcase },
  { name: 'Documentation', icon: FileText },
  { name: 'Other', icon: Package }
];

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (projectData: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    iconName: string;
    tags: string[];
    subcategories: string[];
  }) => void;
  type: 'project' | 'stack';
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  open,
  onClose,
  onSave,
  type
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [subcategoryInput, setSubcategoryInput] = useState('');
  const [iconSearchQuery, setIconSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        icon: selectedIcon.icon,
        iconName: selectedIcon.name,
        tags: [],
        subcategories
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedIcon(iconOptions[0]);

    setSubcategories([]);
    setSubcategoryInput('');
    setIconSearchQuery('');
    onClose();
  };



  const handleAddSubcategory = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (!subcategoryInput.trim() || subcategories.includes(subcategoryInput.trim())) return;
    setSubcategories(prev => [...prev, subcategoryInput.trim()]);
    setSubcategoryInput('');
  };

  const handleRemoveSubcategory = (subcatToRemove: string) => {
    setSubcategories(prev => prev.filter(subcat => subcat !== subcatToRemove));
  };

  const filteredIcons = iconOptions.filter(option =>
    option.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Add New {type === 'stack' ? 'Stack' : 'Project'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {type === 'stack' ? 'Stack' : 'Project'} Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter ${type === 'stack' ? 'stack' : 'project'} name`}
                  className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Icon Selection */}
              <div>
                <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {type === 'stack' ? 'Stack' : 'Project'} Icon
                </Label>
                
                {/* Icon Search */}
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      value={iconSearchQuery}
                      onChange={(e) => setIconSearchQuery(e.target.value)}
                      placeholder="Search icons..."
                      className="pl-10 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                
                {/* Icon Grid */}
                <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800">
                  {filteredIcons.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setSelectedIcon(option)}
                        className={`p-2 rounded-lg border-2 transition-all hover:scale-105 aspect-square flex items-center justify-center ${
                          selectedIcon.name === option.name
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                        title={option.name}
                      >
                        <IconComponent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>



              {/* Subcategories */}
              <div>
                <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sub{type === 'stack' ? 'stacks' : 'projects'}
                </Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    onKeyDown={handleAddSubcategory}
                    placeholder={`Add sub${type === 'stack' ? 'stacks' : 'projects'}...`}
                    className="flex-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddSubcategory()}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((subcat) => (
                      <Badge
                        key={subcat}
                        variant="secondary"
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      >
                        {subcat}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(subcat)}
                          className="ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="ghost"
                  className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={!name.trim()}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Add {type === 'stack' ? 'Stack' : 'Project'}
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewProjectDialog;