"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Globe, MessageSquare, Wrench, User as UserIcon, ExternalLink, Plus, FolderPlus, Folder, X, Edit2, Share2, Trash2, Check, ChevronDown, Settings, Sun, Moon, Monitor, Upload, Copy, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import Logo from './Logo';
import supabase from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import {
  fetchPrompts,
  fetchTools,
  onAuthChange,
  fetchUserProfile,
  updatePrompt,
  deletePrompt,
  sharePrompt,
  updateTool,
  deleteTool,
  shareTool,
  createPrompt,
  createTool,
  uploadCover,
  signOut,
  fetchCategories,
  fetchSubcategories,
  createCategory,
  createSubcategory,
  subscribeToCategories,
  subscribeToSubcategories,
  unsubscribeFromChannel,
} from '../lib/data';
import type { PromptRow, ToolRow, CategoryRow, SubcategoryRow } from '../lib/data';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { useNavigate } from 'react-router-dom';
import PromptDetailsModal, { Prompt as PromptModal } from './generated/PromptDetailsModal';
import NewPromptDialog from './generated/NewPromptDialog';
import NewToolDialog from './generated/NewToolDialog';
import NewProjectDialog from './generated/NewProjectDialog';
import ProjectsDrawer from './mobile/ProjectsDrawer';
import { updateCategory, updateSubcategory, deleteCategory, deleteSubcategory, createSubcategory as dbCreateSubcategory } from '../lib/data';

import { toast } from 'sonner';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useLongPress } from '../hooks/useLongPress';
import FloatingActionMenu from './mobile/FloatingActionMenu';
import CategorySelectionModal from './mobile/CategorySelectionModal';

interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  email?: string;
}

// Add Tool interface for mobile ToolDetailsModal
interface Tool {
  id: string;
  name: string;
  category: string;
  url: string;
  description?: string;
  favicon?: string;
  subcategory?: string;
  isPublic?: boolean;
}

const MobileDashboard: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('koto_mobile_active_tab') : null;
      return saved === 'toolbox' ? 'toolbox' : 'prompts';
    } catch { return 'prompts'; }
  });
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    try {
      const savedTab = typeof window !== 'undefined' ? localStorage.getItem('koto_mobile_active_tab') : null;
      const key = savedTab === 'toolbox' ? 'koto_mobile_active_category_tools' : 'koto_mobile_active_category_prompts';
      const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      return saved || 'all';
    } catch { return 'all'; }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Settings dialog state
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('koto_background_image') || '/koto-background-image-default.webp';
    }
    return '/koto-background-image-default.webp';
  });
  const [backgroundOption, setBackgroundOption] = useState<'default' | 'custom' | 'none'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koto_background_option');
      if (saved) return saved as 'default' | 'custom' | 'none';
      const image = localStorage.getItem('koto_background_image');
      if (!image || image === '/koto-background-image-default.webp') return 'default';
      if (image === 'none') return 'none';
      return 'custom';
    }
    return 'default';
  });
  // Modal state
  const [selectedPrompt, setSelectedPrompt] = useState<PromptModal | null>(null);
  const [showPromptDetailsDialog, setShowPromptDetailsDialog] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showToolDetailsDialog, setShowToolDetailsDialog] = useState(false);
  // Creation dialog state
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [showNewToolDialog, setShowNewToolDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  // Projects drawer state
  const [showProjectsDrawer, setShowProjectsDrawer] = useState(false);
  
  // Categories and subcategories state
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryRow[]>([]);

  // Category/subcategory helpers (sync with desktop behavior)
  const handleAddSubcategory = async (parentId: string) => {
    if (!user?.id) return;
    try {
      const created = await dbCreateSubcategory({ name: activeTab === 'prompts' ? 'New subproject' : 'New substack', category_id: parentId, user_id: user.id }, user.id);
      if (created) {
        setSubcategories(prev => [...prev, created]);
      }
    } catch (e) {
      console.error('Failed to create subcategory', e);
      toast.error('Failed to create subcategory');
    }
  };

  const handleRenameCategory = async (id: string, name: string) => {
    try {
      const updated = await updateCategory(id, { name });
      setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
    } catch (e) {
      console.error('Failed to rename category', e);
      toast.error('Failed to rename');
    }
  };

  const handleRenameSubcategory = async (id: string, name: string) => {
    try {
      const updated = await updateSubcategory(id, { name });
      setSubcategories(prev => prev.map(s => (s.id === id ? updated : s)));
    } catch (e) {
      console.error('Failed to rename subcategory', e);
      toast.error('Failed to rename');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user?.id) return;
    try {
      const children = subcategories.filter(s => s.category_id === id);
      if (children.length > 0) {
        await Promise.all(children.map(s => deleteSubcategory(s.id)));
      }
      await deleteCategory(id);
      setSubcategories(prev => prev.filter(s => s.category_id !== id));
      setCategories(prev => prev.filter(c => c.id !== id));
      if (activeCategory === id) setActiveCategory('all');
    } catch (e) {
      console.error('Failed to delete category', e);
      toast.error('Failed to delete');
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    try {
      await deleteSubcategory(id);
      setSubcategories(prev => prev.filter(s => s.id !== id));
      if (activeCategory === id) setActiveCategory('all');
    } catch (e) {
      console.error('Failed to delete subcategory', e);
      toast.error('Failed to delete');
    }
  };

  // Mobile move functions
  const handleMovePromptToCategory = async (promptId: string, categoryId: string, subcategoryId?: string) => {
    if (!user?.id) return;
    try {
      const updated = await updatePrompt(promptId, {
        category: categoryId,
        subcategory: subcategoryId || null
      });
      setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, ...updated } : p));
      toast.success('Prompt moved successfully');
    } catch (e) {
      console.error('Failed to move prompt', e);
      toast.error('Failed to move prompt');
    }
  };

  const handleMoveToolToCategory = async (toolId: string, categoryId: string, subcategoryId?: string) => {
    if (!user?.id) return;
    try {
      const updated = await updateTool(toolId, {
        category: categoryId,
        subcategory: subcategoryId || null
      });
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, ...updated } : t));
      toast.success('Tool moved successfully');
    } catch (e) {
      console.error('Failed to move tool', e);
      toast.error('Failed to move tool');
    }
  };

  useEffect(() => {
    const subscription = onAuthChange(async (user) => {
      setUser(user);
      if (user) {
        try {
          const profile = await fetchUserProfile(user.id);
          setUserProfile(profile);
          
          const [promptsData, toolsData, categoriesData, subcategoriesData] = await Promise.all([
            fetchPrompts(user.id),
            fetchTools(user.id),
            fetchCategories(user.id),
            fetchSubcategories(user.id)
          ]);
          
          setPrompts(promptsData);
          setTools(toolsData);
          setCategories(categoriesData);
          setSubcategories(subcategoriesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      setLoading(false);
    });

    return () => {
      // Clean up subscription properly
      try {
        subscription?.data?.subscription?.unsubscribe?.();
      } catch (error) {
        console.warn('Error cleaning up auth subscription:', error);
      }
    };
  }, []);

  // Persist active tab/category
  useEffect(() => {
    try { localStorage.setItem('koto_mobile_active_tab', activeTab); } catch {}
  }, [activeTab]);
  // Persist the category for the current tab when the category actually changes
  useEffect(() => {
    try {
      const key = activeTab === 'toolbox' ? 'koto_mobile_active_category_tools' : 'koto_mobile_active_category_prompts';
      localStorage.setItem(key, activeCategory);
    } catch {}
  }, [activeCategory]);
  useEffect(() => {
    // restore per-tab category on tab switch
    try {
      const key = activeTab === 'toolbox' ? 'koto_mobile_active_category_tools' : 'koto_mobile_active_category_prompts';
      const saved = localStorage.getItem(key);
      setActiveCategory(saved || 'all');
    } catch { setActiveCategory('all'); }
  }, [activeTab]);

  // Real-time subscriptions for categories and subcategories
  useEffect(() => {
    if (!user) return;

    const categoriesChannel = subscribeToCategories(user.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        setCategories(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setCategories(prev => prev.map(cat => cat.id === payload.new.id ? payload.new : cat));
      } else if (payload.eventType === 'DELETE') {
        setCategories(prev => prev.filter(cat => cat.id !== payload.old.id));
      }
    });

    const subcategoriesChannel = subscribeToSubcategories(user.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        setSubcategories(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setSubcategories(prev => prev.map(sub => sub.id === payload.new.id ? payload.new : sub));
      } else if (payload.eventType === 'DELETE') {
        setSubcategories(prev => prev.filter(sub => sub.id !== payload.old.id));
      }
    });

    return () => {
      unsubscribeFromChannel(categoriesChannel);
      unsubscribeFromChannel(subcategoriesChannel);
    };
  }, [user]);

  // Mapping helpers for modals
  const mapPromptRowToPrompt = (row: PromptRow): PromptModal => ({
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags || [],
    model: row.model,
    category: row.category,
    subcategory: row.subcategory || undefined,
    coverImage: row.cover_image,
    createdAt: new Date(row.created_at),
    isPublic: row.is_public || false,
  });

  const mapToolRowToTool = (row: ToolRow): Tool => ({
    id: row.id,
    name: row.name,
    category: row.category || '',
    url: row.url,
    description: row.description,
    favicon: row.favicon,
    subcategory: row.subcategory || undefined,
    isPublic: row.is_public || false,
  });

  // Background handling functions
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const imageData = e.target?.result as string;
        setBackgroundImage(imageData);
        setBackgroundOption('custom');
        localStorage.setItem('koto_background_image', imageData);
        localStorage.setItem('koto_background_option', 'custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundOptionChange = (option: 'default' | 'custom' | 'none') => {
    setBackgroundOption(option);
    localStorage.setItem('koto_background_option', option);
    
    if (option === 'default') {
      setBackgroundImage('/koto-background-image-default.webp');
      localStorage.setItem('koto_background_image', '/koto-background-image-default.webp');
    } else if (option === 'none') {
      setBackgroundImage('none');
      localStorage.setItem('koto_background_image', 'none');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center transition-colors duration-300 px-4" style={{
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Logo size="lg" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Koto</h1>
            <p className="text-white/80">Sign in to access your personal workspace</p>
          </div>
          
          <div className="space-y-4">
            <motion.button
              onClick={async () => {
                try {
                  const { signInWithGitHub } = await import('../lib/data');
                  await signInWithGitHub();
                } catch (error) {
                  console.error('GitHub sign in error:', error);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span>Continue with GitHub</span>
            </motion.button>
            
            <motion.button
              onClick={async () => {
                try {
                  const { signInWithGoogle } = await import('../lib/data');
                  await signInWithGoogle();
                } catch (error) {
                  console.error('Google sign in error:', error);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </motion.button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Create your account to save prompts, organize tools, and share your workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Mobile Dashboard Frame - 375x780 */}
      <div className="w-full min-h-[780px] mx-auto bg-slate-900 relative">
        
        {/* Header Section - 375x258 with background image */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[258px] overflow-hidden"
          style={{
            backgroundImage: backgroundImage !== 'none' ? `url('${backgroundImage}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: backgroundImage === 'none' ? '#1e293b' : 'transparent'
          }}
        >

          {/* Header Container - 16px padding, column layout with 10px gap */}
          <div className="relative z-10 flex flex-col gap-[10px] p-4 h-full w-full">
            
            {/* Container - 343px width, centered */}
            <div className="w-full mx-auto flex flex-col gap-[102px] h-full">
              
              {/* Header Row - Space between profile and menu, 48px height */}
              <div className="flex items-center justify-between w-full h-12">
                
                {/* Profile Picture - 48x48 with blur effect */}
                <motion.button 
                  onClick={() => navigate('/settings/profile')}
                  aria-label="Open profile settings"
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>

                {/* Menu Button - 48x48 with blur effect */}
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle menu"
                >
                  <Menu className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Content Section */}
              <div className="flex items-end justify-between w-full">
                
                {/* Prompt Info Section */}
                <div 
                  className="flex-none w-fit max-w-full rounded-[10px] p-4 flex flex-col gap-1 bg-white/10 backdrop-blur-sm text-white"
                >
                  {/* Prompt Title Container */}
                  <div className="flex items-center gap-2 w-full">
                    {activeTab === 'prompts' ? (
                      <Globe className="w-5 h-5 text-white" strokeWidth={2} />
                    ) : (
                      <Wrench className="w-5 h-5 text-white" strokeWidth={2} />
                    )}
                    <h2 className="text-white font-bold text-lg leading-tight">
                      {(() => {
                        const isAll = activeCategory === 'all';
                        const sub = subcategories.find(s => s.id === activeCategory);
                        if (activeTab === 'prompts') {
                          if (isAll) return 'All Prompts';
                          if (sub) {
                            const parent = categories.find(c => c.id === sub.category_id);
                            return parent ? `${parent.name} / ${sub.name}` : sub.name;
                          }
                          const cat = categories.find(c => c.id === activeCategory);
                          return cat ? cat.name : 'All Prompts';
                        } else {
                          if (isAll) return 'All Tools';
                          if (sub) {
                            const parent = categories.find(c => c.id === sub.category_id);
                            return parent ? `${parent.name} / ${sub.name}` : sub.name;
                          }
                          const cat = categories.find(c => c.id === activeCategory);
                          return cat ? cat.name : 'All Tools';
                        }
                      })()}
                    </h2>
                  </div>
                  
                  {/* Prompt Count */}
                  <p className="text-white/90 text-xs leading-relaxed">
                    {(() => {
                      const isAll = activeCategory === 'all';
                      if (activeTab === 'prompts') {
                        if (isAll) return `${prompts.length} prompts available`;
                        const sub = subcategories.find(s => s.id === activeCategory);
                        if (sub) return `${prompts.filter(p => p.subcategory === sub.id).length} prompts available`;
                        const direct = prompts.filter(p => p.category === activeCategory && !p.subcategory).length;
                        const subCount = subcategories.filter(s => s.category_id === activeCategory).reduce((acc, s) => acc + prompts.filter(p => p.subcategory === s.id).length, 0);
                        return `${direct + subCount} prompts available`;
                      } else {
                        if (isAll) return `${tools.length} tools available`;
                        const sub = subcategories.find(s => s.id === activeCategory);
                        if (sub) return `${tools.filter(t => t.subcategory === sub.id).length} tools available`;
                        const direct = tools.filter(t => t.category === activeCategory && !t.subcategory).length;
                        const subCount = subcategories.filter(s => s.category_id === activeCategory).reduce((acc, s) => acc + tools.filter(t => t.subcategory === s.id).length, 0);
                        return `${direct + subCount} tools available`;
                      }
                    })()}
                  </p>
                </div>

                {/* Action Buttons Section */}
                <div 
                  className="rounded-[10px] p-2 flex items-center gap-2 bg-white/10 backdrop-blur-sm flex-shrink-0"
                >
                  {/* Prompt Button - Active */}
                  <motion.button
                      onClick={() => {
                        setActiveTab('prompts');
                        setActiveCategory('all');
                        try {
                          localStorage.setItem('koto_mobile_active_tab', 'prompts');
                          localStorage.setItem('koto_mobile_active_category_prompts', 'all');
                        } catch {}
                      }}
                    className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all ${
                      activeTab === 'prompts' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Show prompts"
                  >
                    <MessageSquare className="w-4 h-4 text-white" strokeWidth={2} />
                  </motion.button>

                  {/* Toolbox Button */}
                  <motion.button
                      onClick={() => {
                        setActiveTab('toolbox');
                        setActiveCategory('all');
                        try {
                          localStorage.setItem('koto_mobile_active_tab', 'toolbox');
                          localStorage.setItem('koto_mobile_active_category_tools', 'all');
                        } catch {}
                      }}
                    className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all ${
                      activeTab === 'toolbox' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Show tools"
                  >
                    <Wrench className="w-4 h-4 text-white" strokeWidth={2} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Cards Grid, positioned at y:274 with 16px padding */}
        <div className="absolute top-[274px] left-0 w-full px-4">
          <div className="w-full mx-auto flex flex-col gap-2">
            {activeTab === 'prompts' ? (
              (activeCategory === 'all' ? prompts : prompts.filter(p => p.subcategory ? (subcategories.find(s => s.id === p.subcategory)?.category_id === activeCategory) : (p.category === activeCategory))).length > 0 ? (
                (activeCategory === 'all' ? prompts : prompts.filter(p => p.subcategory ? (subcategories.find(s => s.id === p.subcategory)?.category_id === activeCategory) : (p.category === activeCategory))).slice(0, 6).map((prompt) => (
                  <MobilePromptCard
                    key={prompt.id}
                    title={prompt.title}
                    description={prompt.content}
                    tags={prompt.tags}
                    model={prompt.model}
                    coverImage={prompt.cover_image}
                    onClick={() => {
                      const mapped = mapPromptRowToPrompt(prompt);
                      setSelectedPrompt(mapped);
                      setShowPromptDetailsDialog(true);
                    }}
                    onMoveToCategory={(categoryId, subcategoryId) => handleMovePromptToCategory(prompt.id, categoryId, subcategoryId)}
                    currentCategoryId={prompt.category}
                    currentSubcategoryId={prompt.subcategory || undefined}
                    promptId={prompt.id}
                    userId={user?.id || ''}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No prompts yet
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Create your first prompt to get started
                  </p>
                </div>
              )
            ) : (
              (activeCategory === 'all' ? tools : tools.filter(t => t.subcategory ? (subcategories.find(s => s.id === t.subcategory)?.category_id === activeCategory) : (t.category === activeCategory))).length > 0 ? (
                (activeCategory === 'all' ? tools : tools.filter(t => t.subcategory ? (subcategories.find(s => s.id === t.subcategory)?.category_id === activeCategory) : (t.category === activeCategory))).slice(0, 6).map((tool) => (
                  <MobileToolCard
                    key={tool.id}
                    name={tool.name}
                    description={tool.description}
                    category={tool.category}
                    url={tool.url}
                    favicon={tool.favicon}
                    onClick={() => {
                      const mapped = mapToolRowToTool(tool);
                      setSelectedTool(mapped);
                      setShowToolDetailsDialog(true);
                    }}
                    onMoveToCategory={(categoryId, subcategoryId) => handleMoveToolToCategory(tool.id, categoryId, subcategoryId)}
                    currentCategoryId={tool.category}
                    currentSubcategoryId={tool.subcategory || undefined}
                    toolId={tool.id}
                    userId={user?.id || ''}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No tools yet
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Add your first tool to get started
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Prompt Details Modal for mobile */}
        <PromptDetailsModal
          prompt={selectedPrompt}
          isOpen={showPromptDetailsDialog}
          onClose={() => {
            setShowPromptDetailsDialog(false);
            setSelectedPrompt(null);
          }}
          onEdit={async (edited) => {
            try {
              const updated = await updatePrompt(edited.id, {
                title: edited.title,
                content: edited.content,
                tags: edited.tags,
                model: edited.model,
                category: edited.category,
                subcategory: edited.subcategory,
                cover_image: edited.coverImage,
              });
              setPrompts(prev => prev.map(p => p.id === edited.id ? { ...p, ...updated } : p));
              toast.success('Prompt updated');
            } catch (e) {
              console.error('Failed to update prompt', e);
              toast.error('Failed to update prompt');
            }
          }}
          onDelete={async (id) => {
            try {
              await deletePrompt(id);
              setPrompts(prev => prev.filter(p => p.id !== id));
              setShowPromptDetailsDialog(false);
              setSelectedPrompt(null);
              toast.success('Prompt deleted');
            } catch (e) {
              console.error('Failed to delete prompt', e);
              toast.error('Failed to delete prompt');
            }
          }}
          onCopy={() => { /* handled by modal as well */ }}
          onShare={async (prompt) => {
            try {
              const shareToken = await sharePrompt(prompt.id);
              if (shareToken) {
                const shareUrl = `${window.location.origin}/shared/prompt?token=${shareToken}`;
                
                // Try native Web Share API first (mobile-friendly)
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: prompt.title,
                      text: `Check out this prompt: ${prompt.title}`,
                      url: shareUrl,
                    });
                    // Native share succeeded, no need for toast
                    return;
                  } catch (shareError) {
                    // Fall back to clipboard if native share fails
                  }
                }
                
                // Fallback to clipboard API
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success('Share link copied to clipboard!', {
                    description: 'Anyone with this link can view your prompt',
                    duration: 3000,
                  });
                } catch (clipboardError) {
                  // Final fallback: create a temporary text area for older browsers
                  const textArea = document.createElement('textarea');
                  textArea.value = shareUrl;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-999999px';
                  textArea.style.top = '-999999px';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  try {
                    document.execCommand('copy');
                    toast.success('Share link copied to clipboard!', {
                      description: 'Anyone with this link can view your prompt',
                      duration: 3000,
                    });
                  } catch (execError) {
                    // Show the URL in a prompt as last resort
                    window.prompt(`Copy this link to share: ${shareUrl}`);
                  } finally {
                    document.body.removeChild(textArea);
                  }
                }
              }
            } catch (error) {
              console.error('Failed to share prompt', error);
              toast.error('Failed to share prompt', {
                description: 'Please try again later',
                duration: 3000,
              });
            }
          }}
        />

        {/* Tool Details Modal for mobile */}
        <ToolDetailsModal
          tool={selectedTool}
          isOpen={showToolDetailsDialog}
          onClose={() => {
            setShowToolDetailsDialog(false);
            setSelectedTool(null);
          }}
          onEdit={async (edited) => {
            try {
              const updated = await updateTool(edited.id, {
                name: edited.name,
                url: edited.url,
                description: edited.description,
                category: edited.category,
                subcategory: edited.subcategory,
                favicon: edited.favicon,
                is_public: edited.isPublic,
              });
              setTools(prev => prev.map(t => t.id === edited.id ? { ...t, ...updated, isPublic: updated.is_public } : t));
              toast.success('Tool updated');
            } catch (e) {
              console.error('Failed to update tool', e);
              toast.error('Failed to update tool');
            }
          }}
          onDelete={async (id) => {
            try {
              await deleteTool(id);
              setTools(prev => prev.filter(t => t.id !== id));
              setShowToolDetailsDialog(false);
              setSelectedTool(null);
              toast.success('Tool deleted');
            } catch (e) {
              console.error('Failed to delete tool', e);
              toast.error('Failed to delete tool');
            }
          }}
          onShare={async (tool) => {
            try {
              const shareToken = await shareTool(tool.id);
              if (shareToken) {
                const shareUrl = `${window.location.origin}/shared/tool?token=${shareToken}`;
                
                // Try native Web Share API first (mobile-friendly)
                if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                  try {
                    await navigator.share({
                      title: tool.name,
                      text: `Check out this tool: ${tool.name}`,
                      url: shareUrl,
                    });
                    return;
                  } catch (shareError) {
                    // Fall back to clipboard if native share fails
                  }
                }
                
                // Fallback to clipboard API
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success('Share link copied to clipboard!', {
                    description: 'Anyone with this link can view your tool',
                    duration: 3000,
                  });
                } catch (clipboardError) {
                  // Final fallback: create a temporary text area for older browsers
                  const textArea = document.createElement('textarea');
                  textArea.value = shareUrl;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-999999px';
                  textArea.style.top = '-999999px';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  try {
                    document.execCommand('copy');
                    toast.success('Share link copied to clipboard!', {
                      description: 'Anyone with this link can view your tool',
                      duration: 3000,
                    });
                  } catch (execError) {
                    // Show the URL in a prompt as last resort
                    prompt(`Copy this link to share: ${shareUrl}`);
                  } finally {
                    document.body.removeChild(textArea);
                  }
                }
              }
            } catch (error) {
              console.error('Failed to share tool', error);
              toast.error('Failed to share tool', {
                description: 'Please try again later',
                duration: 3000,
              });
            }
          }}
        />

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                className="fixed top-0 right-0 h-full w-80 bg-slate-800 shadow-xl z-60 flex flex-col"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                {/* Menu Header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Menu</h2>
                    <motion.button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-6">
                  <nav className="space-y-2">
                    <motion.button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileMenuOpen(false);
                        navigate('/settings/profile');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Profile Settings</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setActiveTab('prompts');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>All Prompts</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setActiveTab('toolbox');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <Wrench className="w-5 h-5" />
                      <span>Toolbox</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setShowSettingsDialog(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </motion.button>
                  </nav>
                </div>

                {/* Menu Footer */}
                <div className="p-6 border-t border-slate-700">
                  <motion.button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      try {
                        await signOut();
                        toast.success('Signed out successfully');
                      } catch (error) {
                        toast.error('Failed to sign out');
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors text-left"
                    whileHover={{ x: 4 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Action Buttons - Positioned in header area according to Figma design */}
        {/* Removed to match Figma: keep primary actions accessible elsewhere without cluttering header */}
        
        {/* Projects/Stacks FAB - Bottom Left */}
        <div className="fixed bottom-5 left-5 z-50">
          <motion.button
            onClick={() => setShowProjectsDrawer(true)}
            className="w-12 h-12 rounded-[10px] bg-white/10 backdrop-blur-sm text-white shadow-lg flex items-center justify-center hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`View ${activeTab === 'prompts' ? 'Projects' : 'Stacks'}`}
          >
            <Folder className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Floating Action Buttons - context aware (adds Prompt or Tool based on active tab) */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3">
          {/* Primary FAB - Add Prompt/Tool */}
          <motion.button
            onClick={() => {
              if (activeTab === 'prompts') {
                setShowNewPromptDialog(true);
              } else {
                setShowNewToolDialog(true);
              }
            }}
            className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={activeTab === 'prompts' ? 'Add prompt' : 'Add tool'}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          
          {/* Secondary FAB - Add Project/Stack */}
          <motion.button
            onClick={() => {
              setShowNewProjectDialog(true);
            }}
            className="w-12 h-12 rounded-full bg-gray-600 dark:bg-slate-600 text-white shadow-lg flex items-center justify-center hover:bg-gray-500 dark:hover:bg-slate-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={activeTab === 'prompts' ? 'New Project' : 'New Stack'}
          >
            <FolderPlus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Create Prompt Dialog */}
        <NewPromptDialog
          open={showNewPromptDialog}
          onClose={() => setShowNewPromptDialog(false)}
          categories={categories}
          onSave={async (data) => {
            if (!user?.id) {
              toast.error('Please sign in to continue', {
                description: 'You must be signed in to perform this action',
              });
              setShowNewPromptDialog(false);
              return;
            }
            try {
              let coverUrl: string | undefined = undefined;
              if (data.coverImage) {
                if (data.coverImage.startsWith('data:')) {
                  // Convert data URL to File and upload to storage to get public URL
                  const file = dataURLtoFile(data.coverImage, `cover_${Date.now()}.png`);
                  coverUrl = await uploadCover(file, user.id);
                } else {
                  // If a URL was provided already, use it directly
                  coverUrl = data.coverImage;
                }
              }
    
              // Map selectedProject name to category id
              const selectedCategoryId = data.selectedProject
                ? (categories.find(c => c.name === data.selectedProject && c.type === 'prompt')?.id || '')
                : '';
              const created = await createPrompt(
                {
                  title: data.title,
                  content: data.content,
                  tags: data.tags,
                  model: data.model,
                  category: selectedCategoryId || 'uncategorized',
                  cover_image: coverUrl,
                },
                user.id
              );
              if (created) {
                setPrompts((prev) => [created, ...prev]);
                toast.success('Prompt created');
              }
            } catch (e) {
              console.error('Failed to create prompt', e);
              toast.error('Failed to create prompt');
            } finally {
              setShowNewPromptDialog(false);
            }
          }}
        />

        {/* Create Tool Dialog */}
        <NewToolDialog
          open={showNewToolDialog}
          onClose={() => setShowNewToolDialog(false)}
          availableStacks={categories.filter(cat => cat.id !== 'all')}
          onAddStack={() => {
            setShowNewToolDialog(false);
            setShowNewProjectDialog(true);
          }}
          onSave={async (toolData) => {
            if (!user?.id) {
              toast.error('Please sign in to continue', {
                description: 'You must be signed in to perform this action',
              });
              setShowNewToolDialog(false);
              return;
            }
            try {
              const created = await createTool({
                name: toolData.name,
                url: toolData.url,
                description: toolData.description || undefined,
                favicon: toolData.logo,
                category: toolData.category,
              }, user.id);
              if (created) {
                setTools(prev => [created, ...prev]);
                toast.success('Tool added');
              }
            } catch (e) {
              console.error('Failed to create tool', e);
              toast.error('Failed to create tool');
            } finally {
              setShowNewToolDialog(false);
            }
          }}
        />

        {/* Create Project/Stack Dialog */}
        <NewProjectDialog
          open={showNewProjectDialog}
          onClose={() => setShowNewProjectDialog(false)}
          onSave={async (projectData) => {
            if (!user?.id) {
              toast.error('Please sign in to continue');
              setShowNewProjectDialog(false);
              return;
            }

            try {
              // Create new category (project/stack)
              const categoryData = {
                name: projectData.name,
                type: activeTab === 'prompts' ? 'prompt' as const : 'tool' as const,
                icon: projectData.iconName || 'Globe',
                user_id: user.id
              };

              const createdCategory = await createCategory(categoryData, user.id);
              if (!createdCategory) {
                throw new Error('Failed to create category');
              }

              // Add subcategories if it's a project (prompts tab)
              if (activeTab === 'prompts' && projectData.subcategories && projectData.subcategories.length > 0) {
                for (const subcatName of projectData.subcategories) {
                  await createSubcategory({
                    name: subcatName,
                    category_id: createdCategory.id,
                    user_id: user.id
                  }, user.id);
                }
              }
              
              toast.success(`${activeTab === 'prompts' ? 'Project' : 'Stack'} added successfully!`);
            } catch (error) {
              console.error('Error creating project:', error);
              toast.error('Failed to create project. Please try again.');
            } finally {
              setShowNewProjectDialog(false);
            }
          }}
          type={activeTab === 'prompts' ? 'project' : 'stack'}
        />

        {/* Projects/Stacks Drawer */}
        <ProjectsDrawer
          selectedCategory={activeCategory}
          prompts={prompts}
          tools={tools}
          onCategorySelect={(id) => {
            setActiveCategory(id);
            try {
              const key = activeTab === 'toolbox' ? 'koto_mobile_active_category_tools' : 'koto_mobile_active_category_prompts';
              localStorage.setItem(key, id);
            } catch {}
            setShowProjectsDrawer(false);
          }}
          isOpen={showProjectsDrawer}
          onClose={() => setShowProjectsDrawer(false)}
          activeTab={activeTab === 'toolbox' ? 'tools' : activeTab}
          onNewProject={() => {
            setShowProjectsDrawer(false);
            setShowNewProjectDialog(true);
          }}
          categories={categories}
          subcategories={subcategories}
          onAddSubcategory={handleAddSubcategory}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
          onRenameSubcategory={handleRenameSubcategory}
          onDeleteSubcategory={handleDeleteSubcategory}
        />



        {/* Settings Dialog */}
        <AnimatePresence>
          {showSettingsDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSettingsDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                    <button
                      onClick={() => setShowSettingsDialog(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Theme Selection */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Default Theme</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Sun className="h-5 w-5 mx-auto mb-1 text-gray-700 dark:text-gray-300" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Light</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Moon className="h-5 w-5 mx-auto mb-1 text-gray-700 dark:text-gray-300" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Dark</span>
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          theme === 'system'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Monitor className="h-5 w-5 mx-auto mb-1 text-gray-700 dark:text-gray-300" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">System</span>
                      </button>
                    </div>
                  </div>

                  {/* Background Options */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Header Background</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Choose background option:</p>
                    
                    <div className="space-y-3">
                      {/* Default Background */}
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="backgroundOption"
                          value="default"
                          checked={backgroundOption === 'default'}
                          onChange={() => handleBackgroundOptionChange('default')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-700 dark:text-gray-300">Default Background</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Use the default Koto background image</div>
                        </div>
                        <div className="w-12 h-8 rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
                          <img src="/koto-background-image-default.webp" alt="Default" className="w-full h-full object-cover" />
                        </div>
                      </label>

                      {/* Custom Background */}
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="backgroundOption"
                          value="custom"
                          checked={backgroundOption === 'custom'}
                          onChange={() => handleBackgroundOptionChange('custom')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-700 dark:text-gray-300">Custom Background</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Upload your own background image</div>
                        </div>
                        {backgroundOption === 'custom' && backgroundImage !== 'none' && backgroundImage !== '/koto-background-image-default.webp' && (
                          <div className="w-12 h-8 rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <img src={backgroundImage} alt="Custom" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </label>

                      {/* Upload Section for Custom Background */}
                      {backgroundOption === 'custom' && (
                        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center relative cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                           <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                           <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                             Click to upload custom photo
                           </div>
                           <div className="text-xs text-gray-500 dark:text-gray-500">
                             Recommended: 1920x1080px, WebP or JPEG
                           </div>
                           <input
                             type="file"
                             accept="image/*"
                             onChange={handleBackgroundUpload}
                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           />
                          {backgroundImage && backgroundImage !== 'none' && backgroundImage !== '/koto-background-image-default.webp' && (
                            <div className="mt-4 relative">
                              <img
                                src={backgroundImage}
                                alt="Custom background preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => {
                                  setBackgroundImage('none');
                                  setBackgroundOption('none');
                                  localStorage.setItem('koto_background_image', 'none');
                                  localStorage.setItem('koto_background_option', 'none');
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* No Background */}
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="backgroundOption"
                          value="none"
                          checked={backgroundOption === 'none'}
                          onChange={() => handleBackgroundOptionChange('none')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-700 dark:text-gray-300">No Background</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Transparent background with bottom border</div>
                        </div>
                      </label>
                    </div>


                  </div>



                  {/* Close Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowSettingsDialog(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
};

// Mobile Prompt Card Component
interface MobilePromptCardProps {
  title?: string;
  description?: string;
  tags?: string[];
  model?: string;
  coverImage?: string;
  onClick?: () => void;
  // Mobile long press props
  onMoveToCategory?: (categoryId: string, subcategoryId?: string) => void;
  currentCategoryId?: string;
  currentSubcategoryId?: string;
  promptId?: string;
  userId?: string;
}

const MobilePromptCard: React.FC<MobilePromptCardProps> = ({
  title = "Untitled Prompt",
  description = "No description available",
  tags = [],
  model = "General",
  coverImage,
  onClick,
  onMoveToCategory,
  currentCategoryId,
  currentSubcategoryId,
  promptId,
  userId
}) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleLongPress = () => {
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
    onClick: onClick,
    threshold: 500
  });

  return (
    <div className="relative">
    <motion.div
      {...longPressHandlers.handlers}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`cursor-pointer transition-all duration-200 group w-full ${
        isSelected ? 'ring-2 ring-indigo-500 ring-opacity-75' : ''
      }`}
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
    >
      <Card className={`bg-slate-800/90 backdrop-blur-sm border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex-col p-0 ${
        isSelected 
          ? 'border-indigo-500/70 bg-indigo-900/20 shadow-indigo-500/25' 
          : 'border-slate-700/50 hover:border-slate-600/70'
      }`}>
        {/* Cover Image - Only show if provided */}
        {coverImage && (
          <div className="relative w-full h-32 overflow-hidden">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <CardHeader className={`${!coverImage ? 'pt-5' : 'pt-4'} pb-2 px-5`}>
          <CardTitle className="text-lg font-semibold text-white leading-tight truncate group-hover:text-indigo-300 transition-colors duration-200" title={title}>
            {truncateText(title || '', 30)}
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm leading-relaxed line-clamp-2 mt-1" title={description}>
            {truncateText(description || '', 80)}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pt-2 px-5 pb-3">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={`rounded-full text-xs transition-all duration-200 truncate max-w-24 hover:scale-105 ${
                  index === 0 
                    ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50 hover:bg-indigo-900/50' 
                    : index === 1
                    ? 'bg-purple-900/30 text-purple-300 border-purple-700/50 hover:bg-purple-900/50'
                    : 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/50'
                }`}
              >
                {truncateText(tag, 10)}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="rounded-full bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs hover:bg-slate-700 transition-colors duration-200"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="relative pt-3 pb-4 mt-auto px-5 before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-slate-700/50">
          <div className="flex justify-end w-full">
            <Badge 
              variant="outline" 
              className="bg-slate-700/30 text-slate-300 border-slate-600/50 rounded-full truncate max-w-28 text-xs hover:bg-slate-700/50 transition-colors duration-200" 
              title={model}
            >
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
};

// Mobile Tool Card Component
interface MobileToolCardProps {
  name?: string;
  description?: string;
  category?: string;
  url?: string;
  favicon?: string;
  onClick?: () => void;
  // Mobile long press props
  onMoveToCategory?: (categoryId: string, subcategoryId?: string) => void;
  currentCategoryId?: string;
  currentSubcategoryId?: string;
  toolId?: string;
  userId?: string;
}

const MobileToolCard: React.FC<MobileToolCardProps> = ({
  name = "Tool Name",
  description,
  category = "General",
  url = "",
  favicon,
  onClick,
  onMoveToCategory,
  currentCategoryId,
  currentSubcategoryId,
  toolId,
  userId
}) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleLongPress = () => {
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
    if (onMoveToCategory && toolId) {
      onMoveToCategory(categoryId, subcategoryId);
    }
    setShowCategoryModal(false);
    setIsSelected(false);
  };

  const longPressHandlers = useLongPress({
    onLongPress: handleLongPress,
    onClick: onClick,
    threshold: 500
  });

  return (
    <div className="relative">
    <motion.div
      {...longPressHandlers.handlers}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`cursor-pointer w-full min-h-[202px] rounded-[10px] bg-slate-800 overflow-hidden ${
        isSelected ? 'ring-2 ring-indigo-500 ring-opacity-75' : ''
      }`}
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
    >
      <Card className={`min-h-full flex flex-col rounded-[10px] ${
        isSelected 
          ? 'bg-indigo-900/20 border-indigo-500/70 shadow-indigo-500/25' 
          : 'bg-slate-800 border-slate-700'
      }`}>
        <CardHeader className="flex items-center justify-center pt-4 pb-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {favicon && (
              <img 
                src={favicon} 
                alt={`${name} favicon`} 
                className="w-8 h-8 rounded-lg flex-shrink-0" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} 
              />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-white truncate" title={name}>
                {truncateText(name || '', 20)}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-0 px-4 pb-2">
          {description && (
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3" title={description}>
              {truncateText(description, 80)}
            </p>
          )}
        </CardContent>

        <CardFooter className="relative mt-auto px-4 before:content-[''] before:absolute before:top-0 before:left-3 before:right-3 before:h-px before:bg-slate-700 flex items-center justify-center pt-3 pb-3">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 truncate flex-1" title={url}>
                {truncateText(url, 25)}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-2 flex-shrink-0" />
            </div>
            {category && (
              <div className="flex items-center justify-start mt-2">
                <Badge 
                  variant="outline" 
                  className="bg-slate-700/50 text-slate-400 border-slate-600 rounded-full text-xs" 
                  title={category}
                >
                  {truncateText(category, 12)}
                </Badge>
              </div>
            )}
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
      itemType="tool"
      currentCategoryId={currentCategoryId}
      currentSubcategoryId={currentSubcategoryId}
      userId={userId || ''}
    />
    </div>
  );
};

// Tool Details Modal (mobile)
interface ToolDetailsModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (tool: Tool) => void;
  onDelete?: (toolId: string) => void;
  onShare?: (tool: Tool) => void;
}

const ToolDetailsModal: React.FC<ToolDetailsModalProps> = ({ tool, isOpen, onClose, onEdit, onDelete, onShare }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTool, setEditedTool] = useState<Tool | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (tool) {
      setEditedTool({ ...tool });
    }
    setIsEditing(false);
  }, [tool]);

  if (!tool || !isOpen) return null;

  const handleEdit = () => {
    setEditedTool({ ...tool });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTool && onEdit) {
      onEdit(editedTool);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTool({ ...tool });
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tool.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  const handleShare = () => {
    onShare?.(tool);
  };

  const handleDelete = () => {
    onDelete?.(tool.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
              <div className="flex items-center space-x-4">
                {tool.favicon && <img src={tool.favicon} alt={`${tool.name} favicon`} className="w-12 h-12 rounded-xl bg-white p-2" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} />}
                <div className="flex-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editedTool?.name || ''} 
                      onChange={(e) => setEditedTool(prev => prev ? {
                        ...prev,
                        name: e.target.value
                      } : null)} 
                      className="text-2xl font-bold bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border-0 rounded-lg px-3 py-2 w-full" 
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
                  )}
                  <p className="text-white/80 text-sm mt-1">{tool.category}</p>
                </div>
              </div>

              {/* Header Actions - Only Close Button */}
              <div className="absolute top-4 right-4">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)] space-y-6">
              {/* URL */}
              <div>
                <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editedTool?.url || ''}
                    onChange={(e) => setEditedTool((prev) => (prev ? { ...prev, url: e.target.value } : null))}
                  />
                ) : (
                  <a href={tool.url} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline break-all">
                    {tool.url}
                  </a>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editedTool?.description || ''}
                    onChange={(e) => setEditedTool((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                    rows={3}
                  />
                ) : (
                  <p className="text-slate-700 dark:text-slate-300">{tool.description || 'No description'}</p>
                )}
              </div>

              {/* Public/Private Toggle */}
              {isEditing && (
                <div>
                  <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Visibility
                  </Label>
                  <div className="flex flex-col space-y-2">
                    <motion.button
                      type="button"
                      onClick={() => setEditedTool(prev => prev ? { ...prev, isPublic: false } : null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        !editedTool?.isPublic
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <Lock className={`w-5 h-5 ${
                        !editedTool?.isPublic ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }`} />
                      <div className="text-left">
                        <div className={`font-medium ${
                          !editedTool?.isPublic ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          Private
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Only visible to you
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => setEditedTool(prev => prev ? { ...prev, isPublic: true } : null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        editedTool?.isPublic
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <Globe className={`w-5 h-5 ${
                        editedTool?.isPublic ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }`} />
                      <div className="text-left">
                        <div className={`font-medium ${
                          editedTool?.isPublic ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          Public
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Visible on your profile
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="flex flex-col gap-2">
                <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</Label>
                {isEditing ? (
                  <div className="relative">
                    <select
                      value={editedTool?.category || ''}
                      onChange={(e) => setEditedTool((prev) => (prev ? { ...prev, category: e.target.value } : null))}
                      className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="General">General</option>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Productivity">Productivity</option>
                      <option value="AI">AI</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                ) : (
                  <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600 rounded-full w-fit">
                    {tool.category || 'General'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-slate-800" style={{marginTop: '16px'}}>
              <div className="flex items-center justify-end space-x-3 flex-wrap gap-2">
                {!isEditing ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleCopy} variant="outline" size="sm" className="h-9 px-4">
                          {copySuccess ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                          {copySuccess ? 'Copied!' : 'Copy URL'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy tool URL to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleShare} variant="outline" size="sm" className="h-9 px-4">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share tool with others</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <motion.button onClick={handleEdit} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors">
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </motion.button>
                    
                    <motion.button onClick={handleDelete} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </motion.button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileDashboard;

// Helper to convert a data URL (base64) to a File for uploading covers
function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}
