"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus, MessageSquare, Wrench, ChevronLeft, Menu, Bell, User, Settings, HelpCircle, Sun, Moon, ExternalLink, Share2, Trash2, Copy, Palette, Code, Briefcase, PenTool, Target, Users, BarChart3, Zap, Globe, Figma, Cpu, Tag, X, Upload, Camera, Smile, Heart, Star, Zap as ZapIcon, Coffee, Music, Book, Gamepad2, Laptop, Smartphone, Headphones, Car, Home, Plane, Gift, ShoppingBag, CreditCard, Mail, Phone, MapPin, Calendar, Clock, Eye, EyeOff, ChevronDown, ChevronRight, Edit2, LogOut, Check } from 'lucide-react';
import PromptCard from './PromptCard';
import PromptDetailsModal from './PromptDetailsModal';
import supabase from '../../lib/supabaseClient';
import {
  fetchPrompts,
  fetchTools,
  createPrompt,
  createTool,
  uploadCover,
  onAuthChange,
  signInWithGitHub,
  signInWithGoogle,
  signOut as supaSignOut,
} from '../../lib/data';
import type { PromptRow, ToolRow } from '../../lib/data';
interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  count: number;
}
interface Prompt {
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
interface Tool {
  id: string;
  name: string;
  category: string;
  url: string;
  description?: string;
  favicon?: string;
}
interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  expanded?: boolean;
}
interface Project {
  id: string;
  name: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  tags: string[];
  subcategories: string[];
  createdAt: Date;
}
const iconOptions = [{
  name: 'React',
  icon: Code
}, {
  name: 'Vue',
  icon: Zap
}, {
  name: 'Angular',
  icon: Target
}, {
  name: 'Node.js',
  icon: Cpu
}, {
  name: 'Python',
  icon: Code
}, {
  name: 'JavaScript',
  icon: Zap
}, {
  name: 'TypeScript',
  icon: Code
}, {
  name: 'Design',
  icon: Palette
}, {
  name: 'Mobile',
  icon: Smartphone
}, {
  name: 'Web',
  icon: Globe
}, {
  name: 'Database',
  icon: BarChart3
}, {
  name: 'DevOps',
  icon: Wrench
}, {
  name: 'AI/ML',
  icon: Cpu
}, {
  name: 'Blockchain',
  icon: Link
}, {
  name: 'Gaming',
  icon: Gamepad2
}, {
  name: 'E-commerce',
  icon: ShoppingBag
}, {
  name: 'Finance',
  icon: CreditCard
}, {
  name: 'Healthcare',
  icon: Heart
}, {
  name: 'Education',
  icon: Book
}, {
  name: 'Social',
  icon: Users
}, {
  name: 'Productivity',
  icon: Calendar
}, {
  name: 'Analytics',
  icon: BarChart3
}] as any[];
const KotoDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>('prompts');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [showNewToolDialog, setShowNewToolDialog] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showPromptDetailsDialog, setShowPromptDetailsDialog] = useState(false);
  const [showToolDetailsDialog, setShowToolDetailsDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [draggedItem, setDraggedItem] = useState<{
    type: 'prompt' | 'tool';
    item: Prompt | Tool;
  } | null>(null);
  const [user, setUser] = useState<any>(null);

  // New project form state
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const [newProjectTags, setNewProjectTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [newProjectSubcategories, setNewProjectSubcategories] = useState<string[]>([]);
  const [newSubcategoryInput, setNewSubcategoryInput] = useState('');

  // New prompt form state
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const [newPromptModel, setNewPromptModel] = useState('GPT-4');
  const [newPromptTags, setNewPromptTags] = useState<string[]>([]);
  const [newPromptTagInput, setNewPromptTagInput] = useState('');
  const [newPromptCoverImage, setNewPromptCoverImage] = useState('');
  const [newPromptCoverFile, setNewPromptCoverFile] = useState<File | null>(null);

  // New tool form state
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('');
  const [isLoadingToolData, setIsLoadingToolData] = useState(false);
  const [toolFavicon, setToolFavicon] = useState('');

  // Settings state
  const [defaultTheme, setDefaultTheme] = useState<'light' | 'dark'>('light');
  const [backgroundImage, setBackgroundImage] = useState(() => {
    // Load background image from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('koto_background_image') || '';
    }
    return '';
  });

  // Reset all data to defaults for new user
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([{
    id: 'all',
    name: 'All',
    count: 0,
    icon: Globe,
    expanded: false
  }]);

  // Missing state variables
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [toolCategories, setToolCategories] = useState<Category[]>([{
    id: 'all-tools',
    name: 'All Tools',
    count: 0,
    icon: Globe,
    expanded: false
  }]);

  // Update category counts dynamically
  const updatedCategories = categories.map(category => {
    if (category.id === 'all') {
      return {
        ...category,
        count: prompts.length
      };
    }

    // Count prompts in this category (including subcategories)
    const directPrompts = prompts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === category.id && !p.subcategory);
    const subcategoryPrompts = prompts.filter(p => {
      const subcategory = subcategories.find(sub => sub.id === p.subcategory);
      return subcategory && subcategory.parentId === category.id;
    });
    return {
      ...category,
      count: directPrompts.length + subcategoryPrompts.length
    };
  });
  const updatedToolCategories = toolCategories.map(category => {
    if (category.id === 'all-tools') {
      return {
        ...category,
        count: tools.length
      };
    }

    // Count tools in this category and its subcategories
    const directTools = tools.filter(t => t.category.toLowerCase().replace(/\s+/g, '-') === category.id);
    const subcategoryTools = subcategories.filter(sub => sub.parentId === category.id).reduce((count, sub) => {
      return count + tools.filter(t => t.category.toLowerCase().replace(/\s+/g, '-') === sub.parentId).length;
    }, 0);
    return {
      ...category,
      count: directTools.length + subcategoryTools
    };
  });
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeCategory === 'all') {
      return matchesSearch;
    }

    // Check if it's a subcategory
    const subcategory = subcategories.find(sub => sub.id === activeCategory);
    if (subcategory) {
      // For subcategories, check if the prompt's subcategory matches
      const matchesSubcategory = prompt.subcategory === activeCategory;
      return matchesSearch && matchesSubcategory;
    }

    // Regular category matching - show prompts that belong to this category but not to any subcategory
    const matchesCategory = prompt.category.toLowerCase().replace(/\s+/g, '-') === activeCategory && !prompt.subcategory;
    return matchesSearch && matchesCategory;
  });
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'all-tools') {
      return matchesSearch;
    }

    // Check if it's a subcategory
    const subcategory = subcategories.find(sub => sub.id === activeCategory);
    if (subcategory) {
      const matchesSubcategory = tool.category.toLowerCase().replace(/\s+/g, '-') === subcategory.parentId;
      return matchesSearch && matchesSubcategory;
    }

    // Regular category matching
    const matchesCategory = tool.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
    return matchesSearch && matchesCategory;
  });
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auth subscription and initial load
  useEffect(() => {
    const sub = onAuthChange((u) => setUser(u));
    return () => {
      // best-effort cleanup for supabase v2 subscription wrapper
      try { (sub as any)?.data?.subscription?.unsubscribe?.(); } catch {}
    };
  }, []);

  // Load data from Supabase
  useEffect(() => {
    const load = async () => {
      try {
        const [promptRows, toolRows] = await Promise.all([fetchPrompts(), fetchTools()]);
        const mapPrompt = (row: PromptRow): Prompt => ({
          id: row.id,
          title: row.title,
          content: row.content,
          model: row.model,
          tags: row.tags || [],
          category: row.category,
          subcategory: row.subcategory || undefined,
          coverImage: row.cover_image || undefined,
          createdAt: new Date(row.created_at),
        });
        const mapTool = (row: ToolRow): Tool => ({
          id: row.id,
          name: row.name,
          url: row.url,
          description: row.description || undefined,
          favicon: row.favicon || undefined,
          category: row.category || 'General',
        });
        setPrompts(promptRows.map(mapPrompt));
        setTools(toolRows.map(mapTool));
      } catch (e) {
        console.error('Failed to load data from Supabase', e);
      }
    };
    load();
  }, []);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, type: 'prompt' | 'tool', item: Prompt | Tool) => {
    setDraggedItem({
      type,
      item
    });
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    const targetCategory = activeTab === 'prompts' ? updatedCategories.find(cat => cat.id === targetCategoryId) : updatedToolCategories.find(cat => cat.id === targetCategoryId);
    if (!targetCategory || targetCategory.id === 'all' || targetCategory.id === 'all-tools') return;
    if (draggedItem.type === 'prompt' && activeTab === 'prompts') {
      setPrompts(prev => prev.map(p => p.id === draggedItem.item.id ? {
        ...p,
        category: targetCategory.name
      } : p));
    } else if (draggedItem.type === 'tool' && activeTab === 'toolbox') {
      setTools(prev => prev.map(t => t.id === draggedItem.item.id ? {
        ...t,
        category: targetCategory.name
      } : t));
    }
    setDraggedItem(null);
  };
  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName,
      icon: selectedIcon.icon,
      tags: newProjectTags,
      subcategories: newProjectSubcategories,
      createdAt: new Date()
    };

    // Add to categories
    const newCategory: Category = {
      id: newProjectName.toLowerCase().replace(/\s+/g, '-'),
      name: newProjectName,
      count: 0,
      icon: selectedIcon.icon,
      expanded: false,
    };
    if (activeTab === 'prompts') {
      setCategories(prev => [...prev, newCategory]);
    } else {
      setToolCategories(prev => [...prev, newCategory]);
    }

    // Add subcategories (only for prompts)
    if (activeTab === 'prompts') {
      const newSubcats = newProjectSubcategories.map(subcat => ({
        id: `${newCategory.id}-${subcat.toLowerCase().replace(/\s+/g, '-')}`,
        name: subcat,
        parentId: newCategory.id,
        count: 0,
      }));
      setSubcategories(prev => [...prev, ...newSubcats]);
    }

    // Set the new project as active category
    setActiveCategory(newCategory.id);

    // Reset form
    setNewProjectName('');
    setSelectedIcon(iconOptions[0]);
    setNewProjectTags([]);
    setNewProjectSubcategories([]);
    setShowAddProjectDialog(false);
  };
  const handleAddTag = () => {
    if (!newTagInput.trim() || newProjectTags.includes(newTagInput.trim())) return;
    setNewProjectTags(prev => [...prev, newTagInput.trim()]);
    setNewTagInput('');
  };
  const handleAddSubcategory = () => {
    if (!newSubcategoryInput.trim() || newProjectSubcategories.includes(newSubcategoryInput.trim())) return;
    setNewProjectSubcategories(prev => [...prev, newSubcategoryInput.trim()]);
    setNewSubcategoryInput('');
  };
  const removeTag = (tagToRemove: string) => {
    setNewProjectTags(prev => prev.filter(tag => tag !== tagToRemove));
  };
  const removeSubcategory = (subcatToRemove: string) => {
    setNewProjectSubcategories(prev => prev.filter(subcat => subcat !== subcatToRemove));
  };
  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowPromptDetailsDialog(true);
  };
  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setShowToolDetailsDialog(true);
  };
  const handleAddPrompt = () => {
    setShowNewPromptDialog(true);
  };
  const handleAddTool = () => {
    setShowNewToolDialog(true);
  };
  const handleCreatePrompt = async () => {
    if (!newPromptTitle.trim() || !newPromptContent.trim()) return;
    if (!user?.id) {
      console.warn('You must be signed in to create prompts.');
      setShowProfileMenu(true);
      return;
    }

    // Determine the correct category and subcategory for the new prompt
    let promptCategory = 'General';
    let promptSubcategory: string | undefined = undefined;
    if (activeCategory !== 'all') {
      // Check if it's a subcategory
      const subcategory = subcategories.find(sub => sub.id === activeCategory);
      if (subcategory) {
        // For subcategories, use the parent category name and store subcategory
        const parentCategory = updatedCategories.find(cat => cat.id === subcategory.parentId);
        promptCategory = parentCategory ? parentCategory.name : 'General';
        promptSubcategory = subcategory.id;
      } else {
        // For regular categories, use the category name
        const category = updatedCategories.find(cat => cat.id === activeCategory);
        promptCategory = category ? category.name : 'General';
      }
    }
    // Upload cover if a file is present
    let coverUrl = newPromptCoverImage || '';
    try {
      if (newPromptCoverFile) {
        coverUrl = await uploadCover(newPromptCoverFile, user.id);
      }
      const created = await createPrompt({
        title: newPromptTitle,
        content: newPromptContent,
        model: newPromptModel,
        tags: newPromptTags,
        category: promptCategory,
        subcategory: promptSubcategory ?? null,
        cover_image: coverUrl || null,
        user_id: user.id,
      });
      const mapped: Prompt = {
        id: created.id,
        title: created.title,
        content: created.content,
        model: created.model,
        tags: created.tags || [],
        category: created.category,
        subcategory: created.subcategory || undefined,
        coverImage: created.cover_image || undefined,
        createdAt: new Date(created.created_at),
      };
      setPrompts(prev => [mapped, ...prev]);
    } catch (e) {
      console.error('Failed to create prompt', e);
    }

    // Reset form
    setNewPromptTitle('');
    setNewPromptContent('');
    setNewPromptModel('GPT-4');
    setNewPromptTags([]);
    setNewPromptCoverImage('');
    setNewPromptCoverFile(null);
    setShowNewPromptDialog(false);
  };
  const handleCreateTool = async () => {
    if (!newToolName.trim() || !newToolUrl.trim()) return;
    if (!user?.id) {
      console.warn('You must be signed in to create tools.');
      setShowProfileMenu(true);
      return;
    }
    try {
      const created = await createTool({
        name: newToolName,
        url: newToolUrl,
        description: newToolDescription || null,
        favicon: toolFavicon || null,
        category: (newToolCategory || (activeCategory === 'all-tools' ? 'General' : getCurrentCategoryName())) || 'General',
        user_id: user.id,
      });
      const mapped: Tool = {
        id: created.id,
        name: created.name,
        url: created.url,
        description: created.description || undefined,
        favicon: created.favicon || undefined,
        category: created.category || 'General',
      };
      setTools(prev => [mapped, ...prev]);
    } catch (e) {
      console.error('Failed to create tool', e);
    }

    // Reset form
    setNewToolName('');
    setNewToolUrl('');
    setNewToolDescription('');
    setNewToolCategory('');
    setToolFavicon('');
    setIsLoadingToolData(false);
    setShowNewToolDialog(false);
  };
  const handleAddPromptTag = () => {
    if (!newPromptTagInput.trim() || newPromptTags.includes(newPromptTagInput.trim())) return;
    setNewPromptTags(prev => [...prev, newPromptTagInput.trim()]);
    setNewPromptTagInput('');
  };
  const removePromptTag = (tagToRemove: string) => {
    setNewPromptTags(prev => prev.filter(tag => tag !== tagToRemove));
  };
  const toggleCategoryExpansion = (categoryId: string) => {
    if (activeTab === 'prompts') {
      setCategories(prev => prev.map(cat => cat.id === categoryId ? {
        ...cat,
        expanded: !cat.expanded
      } : cat));
    } else {
      setToolCategories(prev => prev.map(cat => cat.id === categoryId ? {
        ...cat,
        expanded: !cat.expanded
      } : cat));
    }
  };
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const imageData = e.target?.result as string;
        setBackgroundImage(imageData);
        // Save to localStorage to persist across reloads
        localStorage.setItem('koto_background_image', imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewPromptCoverFile(file);
      // preview locally
      const reader = new FileReader();
      reader.onload = e => setNewPromptCoverImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleDoubleClick = (itemId: string, currentName: string) => {
    setEditingItem(itemId);
    setEditingName(currentName);
  };
  const handleRename = (itemId: string, type: 'category' | 'subcategory') => {
    if (!editingName.trim()) return;
    if (type === 'category') {
      if (activeTab === 'prompts') {
        setCategories(prev => prev.map(cat => cat.id === itemId ? {
          ...cat,
          name: editingName.trim()
        } : cat));
      } else {
        setToolCategories(prev => prev.map(cat => cat.id === itemId ? {
          ...cat,
          name: editingName.trim()
        } : cat));
      }
    } else {
      setSubcategories(prev => prev.map(sub => sub.id === itemId ? {
        ...sub,
        name: editingName.trim()
      } : sub));
    }
    setEditingItem(null);
    setEditingName('');
  };
  const handleAddSubcategoryToProject = (parentId: string) => {
    // Create a new subcategory with a default name based on active tab
    const subcatName = activeTab === 'prompts' ? 'New subproject' : 'New substack';
    const newSubcat: Subcategory = {
      id: `${parentId}-${subcatName.toLowerCase().replace(/\s+/g, '-')}`,
      name: subcatName,
      parentId: parentId,
      count: 0,
    };
    setSubcategories(prev => [...prev, newSubcat]);

    // Also expand the parent category to show the new subcategory
    if (activeTab === 'prompts') {
      setCategories(prev => prev.map(cat => cat.id === parentId ? {
        ...cat,
        expanded: true
      } : cat));
    } else {
      setToolCategories(prev => prev.map(cat => cat.id === parentId ? {
        ...cat,
        expanded: true
      } : cat));
    }
  };
  const getCurrentCategoryName = () => {
    if (activeCategory === 'all') {
      return activeTab === 'prompts' ? 'AI Prompts' : 'A.I Tools';
    }

    // Check if it's a subcategory
    const subcategory = subcategories.find(sub => sub.id === activeCategory);
    if (subcategory) {
      // Find the parent category
      const parentCategory = (activeTab === 'prompts' ? updatedCategories : updatedToolCategories).find(cat => cat.id === subcategory.parentId);
      if (parentCategory) {
        return `${parentCategory.name} / ${subcategory.name}`;
      }
      return subcategory.name;
    }

    // Check in the appropriate category list
    const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
    const category = categoryList.find(cat => cat.id === activeCategory);
    return category ? category.name : activeTab === 'prompts' ? 'AI Prompts' : 'A.I Tools';
  };
  const getCurrentCategoryCount = () => {
    if (activeCategory === 'all') {
      return activeTab === 'prompts' ? prompts.length : tools.length;
    }

    // Check if it's a subcategory
    const subcategory = subcategories.find(sub => sub.id === activeCategory);
    if (subcategory) {
      // Count items in this specific subcategory
      if (activeTab === 'prompts') {
        return prompts.filter(p => p.subcategory === subcategory.id).length;
      } else {
        return tools.filter(t => t.category.toLowerCase().replace(/\s+/g, '-') === subcategory.parentId).length;
      }
    }

    // Check in the appropriate category list
    const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
    const category = categoryList.find(cat => cat.id === activeCategory);
    return category ? category.count : activeTab === 'prompts' ? prompts.length : tools.length;
  };

  // Auto-fetch tool data when URL changes
  const fetchToolData = async (url: string) => {
    if (!url || !url.startsWith('http')) return;
    setIsLoadingToolData(true);
    try {
      // Extract domain for favicon
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

      // Auto-complete name from domain if not already set
      if (!newToolName) {
        const siteName = domain.replace('www.', '').split('.')[0];
        const formattedName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
        setNewToolName(formattedName);
      }

      // Set favicon
      setToolFavicon(faviconUrl);

      // Auto-complete description based on common domains
      if (!newToolDescription) {
        const url = newToolUrl.toLowerCase();
        let description = '';
        if (url.includes('openai.com') || url.includes('chatgpt')) {
          description = 'Advanced AI language model for conversations, writing, and problem-solving.';
        } else if (url.includes('claude.ai') || url.includes('anthropic')) {
          description = 'AI assistant by Anthropic for helpful, harmless, and honest conversations.';
        } else if (url.includes('figma.com')) {
          description = 'Collaborative interface design tool for creating user interfaces and prototypes.';
        } else if (url.includes('github.com')) {
          description = 'Version control and collaboration platform for software development.';
        } else if (url.includes('notion.so')) {
          description = 'All-in-one workspace for notes, docs, and project management.';
        } else if (url.includes('canva.com')) {
          description = 'Graphic design platform for creating visual content and presentations.';
        } else if (url.includes('linear.app')) {
          description = 'Modern issue tracking and project management for software teams.';
        } else if (url.includes('vercel.com')) {
          description = 'Platform for frontend frameworks and static sites deployment.';
        } else {
          description = `A useful tool for productivity and workflow enhancement.`;
        }
        setNewToolDescription(description);
      }
    } catch (error) {
      console.error('Error fetching tool data:', error);
    } finally {
      setIsLoadingToolData(false);
    }
  };

  // Debounced URL change handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (newToolUrl) {
        fetchToolData(newToolUrl);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [newToolUrl]);

  // Missing handler functions for PromptDetailsModal
  const handleEditPrompt = async (prompt: Prompt) => {
    try {
      // persist
      const patch: any = {
        title: prompt.title,
        content: prompt.content,
        model: prompt.model,
        tags: prompt.tags,
        category: prompt.category,
        subcategory: prompt.subcategory ?? null,
        cover_image: prompt.coverImage ?? null,
      };
      const { updatePrompt } = await import('../../lib/data');
      const updated = await updatePrompt(prompt.id, patch);
      const mapped: Prompt = {
        id: updated.id,
        title: updated.title,
        content: updated.content,
        model: updated.model,
        tags: updated.tags || [],
        category: updated.category,
        subcategory: updated.subcategory || undefined,
        coverImage: updated.cover_image || undefined,
        createdAt: new Date(updated.created_at),
      };
      // Update prompts list
      setPrompts(prev => prev.map(p => (p.id === prompt.id ? mapped : p)));
      // If the edited item is the one currently open in the modal, update it too
      setSelectedPrompt(prev => (prev && prev.id === prompt.id ? { ...mapped } : prev));
    } catch (e) {
      console.error('Failed to update prompt', e);
    }
  };
  const handleDeletePrompt = async (promptId: string) => {
    try {
      const { deletePrompt } = await import('../../lib/data');
      await deletePrompt(promptId);
      setPrompts(prev => prev.filter(p => p.id !== promptId));
    } catch (e) {
      console.error('Failed to delete prompt', e);
    }
  };
  const handleCopyPrompt = (content: string) => {
    // Copy to clipboard logic is handled in the modal
    console.log('Copying prompt content:', content);
  };
  const handleSharePrompt = (prompt: Prompt) => {
    // Share functionality placeholder
    console.log('Sharing prompt:', prompt.title);
  };

  // Tool Details Modal Component
  const ToolDetailsModal = ({
    tool,
    isOpen,
    onClose
  }: {
    tool: Tool | null;
    isOpen: boolean;
    onClose: () => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTool, setEditedTool] = useState<Tool | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    React.useEffect(() => {
      if (tool) {
        setEditedTool({
          ...tool
        });
      }
    }, [tool]);
    if (!tool || !isOpen) return null;
    const handleEdit = () => {
      setIsEditing(true);
    };
    const handleSave = async () => {
      if (!editedTool) return;
      try {
        const { updateTool } = await import('../../lib/data');
        const updated = await updateTool(tool.id, {
          name: editedTool.name,
          url: editedTool.url,
          description: editedTool.description ?? null,
          favicon: editedTool.favicon ?? null,
          category: editedTool.category,
        });
        setTools(prev => prev.map(t => t.id === tool.id ? {
          id: updated.id,
          name: updated.name,
          url: updated.url,
          description: updated.description || undefined,
          favicon: updated.favicon || undefined,
          category: updated.category || 'General',
        } : t));
      } catch (e) {
        console.error('Failed to update tool', e);
      }
      setIsEditing(false);
    };
    const handleCancel = () => {
      setEditedTool({
        ...tool
      });
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
      console.log('Sharing tool:', tool.name);
    };
    const handleDelete = async () => {
      try {
        const { deleteTool } = await import('../../lib/data');
        await deleteTool(tool.id);
        setTools(prev => prev.filter(t => t.id !== tool.id));
      } catch (e) {
        console.error('Failed to delete tool', e);
      }
      setShowDeleteConfirm(false);
      onClose();
    };
    const handleCheckTool = () => {
      window.open(tool.url, '_blank');
    };
    return <AnimatePresence>
        {isOpen && <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose}>
            <motion.div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl" initial={{
          scale: 0.9,
          opacity: 0,
          y: 20
        }} animate={{
          scale: 1,
          opacity: 1,
          y: 0
        }} exit={{
          scale: 0.8,
          opacity: 0,
          y: 20
        }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
                <div className="flex items-center space-x-4">
                  {tool.favicon && <img src={tool.favicon} alt={`${tool.name} favicon`} className="w-12 h-12 rounded-xl bg-white p-2" onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} />}
                  <div className="flex-1">
                    {isEditing ? <input type="text" value={editedTool?.name || ''} onChange={e => setEditedTool(prev => prev ? {
                  ...prev,
                  name: e.target.value
                } : null)} className="text-2xl font-bold bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border-0 rounded-lg px-3 py-2 w-full" /> : <h1 className="text-2xl font-bold text-white">{tool.name}</h1>}
                    <p className="text-white/80 text-sm mt-1">{tool.category}</p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  {!isEditing ? <>
                      <motion.button onClick={handleCopy} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors">
                        {copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </motion.button>
                      
                      <motion.button onClick={handleShare} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors">
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button onClick={handleEdit} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </motion.button>
                    </> : <>
                      <motion.button onClick={handleCancel} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors">
                        Cancel
                      </motion.button>
                      
                      <motion.button onClick={handleSave} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors">
                        Save
                      </motion.button>
                    </>}
                  
                  <motion.button onClick={onClose} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-color-color">
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
                <div className="space-y-6">
                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      URL
                    </label>
                    {isEditing ? <input type="url" value={editedTool?.url || ''} onChange={e => setEditedTool(prev => prev ? {
                  ...prev,
                  url: e.target.value
                } : null)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" /> : <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <Link className="w-5 h-5 text-slate-400" />
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex-1 truncate">
                          {tool.url}
                        </a>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </div>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    {isEditing ? <textarea value={editedTool?.description || ''} onChange={e => setEditedTool(prev => prev ? {
                  ...prev,
                  description: e.target.value
                } : null)} rows={4} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none" /> : <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {tool.description || 'No description available.'}
                      </p>}
                  </div>
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
                            {copySuccess ? 'Copied!' : 'Copy URL'}
                          </span>
                        </motion.button>
                        
                        <motion.button onClick={handleShare} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="flex items-center space-x-2 px-4 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Share</span>
                        </motion.button>

                        <motion.button onClick={handleCheckTool} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm font-medium">Check Tool</span>
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
                  }} className="flex items-center space-x-2 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </motion.button>
                        
                        <motion.button onClick={() => setShowDeleteConfirm(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="flex items-center space-x-2 px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </motion.button>
                      </> : <>
                        <motion.button onClick={handleCancel} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="px-6 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                          Cancel
                        </motion.button>
                        
                        <motion.button onClick={handleSave} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                          Save Changes
                        </motion.button>
                      </>}
                  </div>
                </div>
              </div>

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
                          Delete Tool
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                          Are you sure you want to delete "{tool.name}"? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                          <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            Cancel
                          </button>
                          <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>}
              </AnimatePresence>
            </motion.div>
          </motion.div>}
      </AnimatePresence>;
  };
  return <div className={`h-screen w-full ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-900 flex overflow-hidden transition-colors duration-300`} style={{
    fontFamily: 'Space Grotesk, sans-serif'
  }}>
      {/* Sidebar */}
      <motion.aside animate={{
      width: sidebarCollapsed ? 80 : 280
    }} transition={{
      duration: 0.3,
      ease: 'easeInOut'
    }} className="hidden md:block h-full flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && <motion.div initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -20
              }} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Koto</h1>
                  </motion.div>}
              </AnimatePresence>
              
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <ChevronLeft className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search */}
          {!sidebarCollapsed && <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search prompts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-sm placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-600 transition-colors" />
              </div>
            </div>}

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {!sidebarCollapsed && <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {activeTab === 'toolbox' ? 'STACKS' : 'PROJECTS'}
                  </h2>
                  <button onClick={() => setShowAddProjectDialog(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>}
              
              <div className="space-y-1">
                {/* All Button - Fixed on top with count */}
                <div className="mb-2">
                  <button onClick={() => setActiveCategory('all')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors max-w-[247px] ${activeCategory === 'all' ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
                    <Globe className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {!sidebarCollapsed && <motion.div initial={{
                      opacity: 0,
                      x: -10
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} exit={{
                      opacity: 0,
                      x: -10
                    }} className="flex items-center justify-between w-full min-w-0">
                          <span className="font-medium text-sm truncate min-w-0 flex-1 text-left">
                            All
                          </span>
                        </motion.div>}
                    </AnimatePresence>
                  </button>
                </div>

                {(activeTab === 'prompts' ? updatedCategories.filter(cat => cat.id !== 'all') : updatedToolCategories.filter(cat => cat.id !== 'all-tools')).map(category => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                const categorySubcategories = subcategories.filter(sub => sub.parentId === category.id);
                const hasSubcategories = categorySubcategories.length > 0;
                return <div key={category.id}>
                      <div className="flex items-center group">
                        <button onClick={() => setActiveCategory(category.id)} onDoubleClick={() => handleDoubleClick(category.id, category.name)} onDragOver={handleDragOver} onDrop={(e: React.DragEvent) => handleDrop(e, category.id)} className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors relative max-w-[247px] ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'} ${draggedItem ? 'border-2 border-dashed border-indigo-300 dark:border-indigo-600' : ''}`}>
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <AnimatePresence mode="wait">
                            {!sidebarCollapsed && <motion.div initial={{
                          opacity: 0,
                          x: -10
                        }} animate={{
                          opacity: 1,
                          x: 0
                        }} exit={{
                          opacity: 0,
                          x: -10
                        }} className="flex items-center justify-between w-full min-w-0">
                                {editingItem === category.id ? <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => handleRename(category.id, 'category')} onKeyPress={e => e.key === 'Enter' && handleRename(category.id, 'category')} className="bg-transparent border-none outline-none text-sm font-medium flex-1 min-w-0" autoFocus /> : <span className="font-medium text-sm truncate min-w-0 flex-1 text-left" title={category.name}>
                                    {category.name}
                                  </span>}
                                
                                {/* Inline action buttons */}
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {/* Delete button */}
                                  <button onClick={e => {
                              e.stopPropagation();
                              // Handle delete category
                              if (activeTab === 'prompts') {
                                setCategories(prev => prev.filter(cat => cat.id !== category.id));
                              } else {
                                setToolCategories(prev => prev.filter(cat => cat.id !== category.id));
                              }
                              // Reset to 'all' if deleting active category
                              if (activeCategory === category.id) {
                                setActiveCategory(activeTab === 'prompts' ? 'all' : 'all-tools');
                              }
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                  
                                  {/* Add subcategory button */}
                                  <button onClick={e => {
                              e.stopPropagation();
                              handleAddSubcategoryToProject(category.id);
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all">
                                    <Plus className="w-4 h-4 text-slate-400" />
                                  </button>
                                  
                                  {/* Expand/collapse button for subcategories - always show if has subcategories or on hover */}
                                  {(hasSubcategories || category.expanded) && <button onClick={e => {
                              e.stopPropagation();
                              toggleCategoryExpansion(category.id);
                            }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                                      {category.expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                    </button>}
                                </div>
                              </motion.div>}
                          </AnimatePresence>
                        </button>
                      </div>
                      
                      {/* Subcategories */}
                      <AnimatePresence>
                        {!sidebarCollapsed && category.expanded && categorySubcategories.length > 0 && <motion.div initial={{
                      opacity: 0,
                      height: 0
                    }} animate={{
                      opacity: 1,
                      height: 'auto'
                    }} exit={{
                      opacity: 0,
                      height: 0
                    }} className="ml-8 mt-1 space-y-1">
                            {categorySubcategories.map(subcategory => {
                        const subcategoryCount = prompts.filter(p => p.subcategory === subcategory.id).length;
                        return <button key={subcategory.id} onClick={() => setActiveCategory(subcategory.id)} onDoubleClick={() => handleDoubleClick(subcategory.id, subcategory.name)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group max-w-[247px] ${activeCategory === subcategory.id ? 'bg-slate-700 dark:bg-slate-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                          {editingItem === subcategory.id ? <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => handleRename(subcategory.id, 'subcategory')} onKeyPress={e => e.key === 'Enter' && handleRename(subcategory.id, 'subcategory')} className="bg-transparent border-none outline-none text-sm font-medium flex-1 min-w-0" autoFocus /> : <span className="font-medium truncate min-w-0 flex-1 text-left" title={subcategory.name}>
                              {subcategory.name}
                            </span>}
                          
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                activeCategory === subcategory.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              {subcategoryCount}
                            </span>
                            
                            {/* Delete subcategory button */}
                            <button onClick={e => {
                              e.stopPropagation();
                              setSubcategories(prev => prev.filter(sub => sub.id !== subcategory.id));
                              // Reset to parent category if deleting active subcategory
                              if (activeCategory === subcategory.id) {
                                setActiveCategory(subcategory.parentId);
                              }
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all">
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        </button>;
                      })}
                          </motion.div>}
                      </AnimatePresence>
                    </div>;
              })}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
              <button onClick={() => setShowSettingsDialog(true)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium text-sm">Settings</span>}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                {!sidebarCollapsed && <span className="font-medium text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium text-sm">Help</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 px-0">
        {/* Content Area */}
        <main className="flex-1 overflow-auto px-0">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden" style={{
          backgroundImage: backgroundImage ? `url('${backgroundImage}')` : `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50"></div>
            
            {/* Unified Header Row moved inside content container below */}

            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white flex flex-col items-center justify-center w-full max-w-4xl p-0" style={{
              display: "flex",
              width: "96%",
              maxWidth: "96%"
            }}>
                {/* Header Row inside container: Tabs (left) and Login (right) */}
                <div className="w-full flex items-stretch justify-between mb-6 h-14">
                  {/* Tabs */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex h-full" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="flex space-x-1" style={{ alignItems: 'center' }}>
                      <button onClick={() => setActiveTab('prompts')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all h-full ${activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                        <MessageSquare className="w-4 h-4" />
                        <span>Prompts</span>
                      </button>
                      <button onClick={() => setActiveTab('toolbox')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all h-full ${activeTab === 'toolbox' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                        <Wrench className="w-4 h-4" />
                        <span>Tool Box</span>
                      </button>
                    </div>
                  </div>

                  {/* Profile Menu */}
                  <div className="relative h-full">
                    <motion.button onClick={() => setShowProfileMenu(!showProfileMenu)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-3 pl-2 pr-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-colors h-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left text-white">
                        <div className="text-sm font-medium">{user ? (user.user_metadata?.name || user.email || 'Account') : 'Login'}</div>
                        <div className="text-xs text-white/80">{user ? 'Signed in' : 'Sign in to continue'}</div>
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1"
                        >
                          {!user && (
                            <>
                              <button onClick={async () => { await signInWithGitHub(); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>Sign in with GitHub</span>
                              </button>
                              <button onClick={async () => { await signInWithGoogle(); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>Sign in with Google</span>
                              </button>
                              <hr className="my-2 border-slate-200 dark:border-slate-700" />
                            </>
                          )}
                          <button onClick={() => setShowSettingsDialog(true)} className="w-full px-4 py-1 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          <hr className="my-2 border-slate-200 dark:border-slate-700" />
                          {user ? (
                            <button onClick={async () => { await supaSignOut(); setShowProfileMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                              <LogOut className="w-4 h-4" />
                              <span>Sign out</span>
                            </button>
                          ) : (
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                              <HelpCircle className="w-4 h-4" />
                              <span>Help & Support</span>
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {/* Header row handled above (tabs + login) */}

                {/* Second Row - Title and Actions */}
                <div className="flex items-center justify-between w-full" style={{
                alignItems: "end",
                width: "100%",
                maxWidth: "100%"
              }}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  paddingBottom: "24px",
                  paddingTop: "24px",
                  marginBottom: "0px",
                  rowGap: "8px",
                  paddingLeft: "32px",
                  paddingRight: "32px"
                }}>
                    <div className="flex items-center space-x-3">
                      {(() => {
                      // Get the current category's icon
                      if (activeCategory === 'all' || activeCategory === 'all-tools') {
                        return <Globe className="w-6 h-6" />;
                      }

                      // Check if it's a subcategory
                      const subcategory = subcategories.find(sub => sub.id === activeCategory);
                      if (subcategory) {
                        // Find the parent category to get its icon
                        const parentCategory = (activeTab === 'prompts' ? updatedCategories : updatedToolCategories).find(cat => cat.id === subcategory.parentId);
                        if (parentCategory) {
                          const Icon = parentCategory.icon;
                          return <Icon className="w-6 h-6" />;
                        }
                      }

                      // Regular category
                      const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
                      const category = categoryList.find(cat => cat.id === activeCategory);
                      if (category) {
                        const Icon = category.icon;
                        return <Icon className="w-6 h-6" />;
                      }

                      // Fallback to Palette icon
                      return <Palette className="w-6 h-6" />;
                    })()}
                      <h1 className="text-2xl font-bold">
                        {activeTab === 'prompts'
                          ? (activeCategory === 'all' ? 'All Prompts' : getCurrentCategoryName())
                          : (activeCategory === 'all-tools' ? 'All Tools' : getCurrentCategoryName())}
                      </h1>
                    </div>
                    <p className="text-white/80">
                      {getCurrentCategoryCount()} {activeTab === 'prompts' ? 'prompts' : 'tools'} available
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>{activeTab === 'prompts' ? 'Add Prompt' : 'Add Tool'}</span>
                    </motion.button>
                    
                    <motion.button onClick={() => setShowAddProjectDialog(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 backdrop-blur-sm transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>{activeTab === 'toolbox' ? 'Add Stack' : 'Add Project'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="py-6 px-0">
            <div className="w-[96%] mx-auto">
              {/* Show prompts/tools if they exist, otherwise show empty state */}
              {(activeTab === 'prompts' ? filteredPrompts.length > 0 : filteredTools.length > 0) ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full justify-items-stretch auto-rows-fr">
                  {activeTab === 'prompts' ? filteredPrompts.map(prompt => <div key={prompt.id} className="justify-self-start w-full h-full" draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, 'prompt', prompt)}>
                          <PromptCard title={prompt.title} description={prompt.content} tags={prompt.tags} model={prompt.model} coverImage={prompt.coverImage} onClick={() => handlePromptClick(prompt)} />
                        </div>) : filteredTools.map(tool => <div key={tool.id} className="justify-self-start w-full h-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200 hover:scale-102 hover:-translate-y-1" draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, 'tool', tool)} onClick={() => handleToolClick(tool)}>
                          <div className="flex items-center space-x-4 mb-4">
                            {tool.favicon && <img src={tool.favicon} alt={`${tool.name} favicon`} className="w-10 h-10 rounded-lg" onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />}
                            <div className="flex-1">
                              <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                                {tool.name}
                              </h1>
                              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                {tool.category}
                              </p>
                            </div>
                          </div>
                          
                          {tool.description && <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                              {tool.description}
                            </p>}
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">
                              {tool.url}
                            </span>
                            <ExternalLink className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
                          </div>
                        </div>)}
                </div> : (/* Empty State for New User */
            <div className="text-center py-12 w-full">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'prompts' ? <MessageSquare className="w-8 h-8 text-slate-400" /> : <Wrench className="w-8 h-8 text-slate-400" />}
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Welcome to Koto!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Get started by creating your first {activeTab === 'prompts' ? 'prompt' : 'tool'} or project
                  </p>
                  <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add {activeTab === 'prompts' ? 'Prompt' : 'Tool'}</span>
                  </motion.button>
                </div>)}
            </div>
          </div>
        </main>
      </div>

      {/* Add Project Dialog */}
      <AnimatePresence>
        {showAddProjectDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowAddProjectDialog(false)}>
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.1,
          opacity: 0
        }} onClick={e => e.stopPropagation()}>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Add New {activeTab === 'toolbox' ? 'Stack' : 'Project'}
              </h1>
              
              <div className="space-y-6">
                {/* Stack/Project Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Name
                  </label>
                  <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder={`Enter ${activeTab === 'toolbox' ? 'stack' : 'project'} name`} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>

                {/* Stack/Project Icon */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                    {iconOptions.map(option => {
                  const IconComponent = option.icon;
                  return <button key={option.name} onClick={() => setSelectedIcon(option)} className={`p-2 rounded-lg border-2 transition-colors ${selectedIcon.name === option.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}>
                          <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>;
                })}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setShowAddProjectDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleAddProject} disabled={!newProjectName.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors">
                    Add {activeTab === 'toolbox' ? 'Stack' : 'Project'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Prompt Dialog */}
      <AnimatePresence>
        {showNewPromptDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewPromptDialog(false)}>
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Prompt</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Title
                  </label>
                  <input type="text" value={newPromptTitle} onChange={e => setNewPromptTitle(e.target.value)} placeholder="Enter prompt title" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Content
                  </label>
                  <textarea value={newPromptContent} onChange={e => setNewPromptContent(e.target.value)} placeholder="Enter prompt content" rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Model
                  </label>
                  <select value={newPromptModel} onChange={e => setNewPromptModel(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="GPT-4">GPT-4</option>
                    <option value="Claude">Claude</option>
                    <option value="Midjourney">Midjourney</option>
                    <option value="DALL-E">DALL-E</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input type="text" value={newPromptTagInput} onChange={e => setNewPromptTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddPromptTag()} placeholder="Enter tag" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" />
                    <button onClick={handleAddPromptTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Tags Display */}
                  {newPromptTags.length > 0 && <div className="flex flex-wrap gap-1.5">
                      {newPromptTags.map(tag => <span key={tag} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                          {tag}
                          <button onClick={() => removePromptTag(tag)} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100">
                            <X className="w-3 h-3" />
                          </button>
                        </span>)}
                    </div>}
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Cover Image (optional)
                  </label>
                  <div className="space-y-3">
                    <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" id="cover-image-upload" />
                    <label htmlFor="cover-image-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors">
                      <div className="text-center">
                        <Camera className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Click to upload cover image
                        </div>
                      </div>
                    </label>
                    
                    {newPromptCoverImage && <div className="relative">
                        <img src={newPromptCoverImage} alt="Cover preview" className="w-full h-32 object-cover rounded-lg" />
                        <button onClick={() => setNewPromptCoverImage('')} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setShowNewPromptDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleCreatePrompt} disabled={!newPromptTitle.trim() || !newPromptContent.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors">
                    Create Prompt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Tool Dialog */}
      <AnimatePresence>
        {showNewToolDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewToolDialog(false)}>
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Tool</h2>
              
              <div className="space-y-6">
                {/* URL - First field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    URL
                  </label>
                  <div className="relative">
                    <input type="url" value={newToolUrl} onChange={e => setNewToolUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                    {isLoadingToolData && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>}
                  </div>
                </div>

                {/* Name - Auto-completed */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tool Name
                    {newToolName && !isLoadingToolData && <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Auto-completed</span>}
                  </label>
                  <div className="relative">
                    <input type="text" value={newToolName} onChange={e => setNewToolName(e.target.value)} placeholder="Enter tool name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                    {toolFavicon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <img src={toolFavicon} alt="Site favicon" className="w-5 h-5 rounded-sm" onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />
                      </div>}
                  </div>
                </div>

                {/* Description - Auto-completed */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                    {newToolDescription && !isLoadingToolData && <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Auto-completed</span>}
                  </label>
                  <textarea value={newToolDescription} onChange={e => setNewToolDescription(e.target.value)} placeholder="Enter tool description (will auto-complete based on URL)" rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Stacks
                  </label>
                  <div className="space-y-3">
                    <select value={newToolCategory} onChange={e => setNewToolCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                      <option value="">Select a stack</option>
                      {updatedToolCategories.filter(cat => cat.id !== 'all-tools').map(category => <option key={category.id} value={category.name}>
                          {category.name}
                        </option>)}
                    </select>
                    
                    <button onClick={() => {
                  setShowNewToolDialog(false);
                  setShowAddProjectDialog(true);
                }} className="w-full flex items-center justify-center space-x-2 px-3 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Add new stack</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setShowNewToolDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleCreateTool} disabled={!newToolName.trim() || !newToolUrl.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors">
                    Create Tool
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Settings Dialog */}
      <AnimatePresence>
        {showSettingsDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowSettingsDialog(false)}>
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
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
                <button onClick={() => setShowSettingsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Default Theme */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Default Theme
                  </label>
                  <div className="flex space-x-3">
                    <button onClick={() => {
                  setDefaultTheme('light');
                  setDarkMode(false);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}>
                      <Sun className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Light</div>
                    </button>
                    <button onClick={() => {
                  setDefaultTheme('dark');
                  setDarkMode(true);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}>
                      <Moon className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark</div>
                    </button>
                  </div>
                </div>

                {/* Background Photo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Change Background Photo
                  </label>
                  <div className="space-y-3">
                    <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" id="background-upload" />
                    <label htmlFor="background-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors">
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Click to upload photo
                        </div>
                      </div>
                    </label>
                    
                    {backgroundImage && <div className="relative">
                        <img src={backgroundImage} alt="Background preview" className="w-full h-20 object-cover rounded-lg" />
                        <button onClick={() => setBackgroundImage('')} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>}
                    
                    {/* Save Button */}
                    <motion.button onClick={() => {
                  // Save the background image to the header and localStorage
                  if (backgroundImage) {
                    localStorage.setItem('koto_background_image', backgroundImage);
                  }
                  setShowSettingsDialog(false);
                }} whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Save Background</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                <button onClick={() => setShowSettingsDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Prompt Details Modal */}
      <PromptDetailsModal prompt={selectedPrompt} isOpen={showPromptDetailsDialog} onClose={() => {
      setShowPromptDetailsDialog(false);
      setSelectedPrompt(null);
    }} onEdit={handleEditPrompt} onDelete={handleDeletePrompt} onCopy={handleCopyPrompt} onShare={handleSharePrompt} />

      {/* Tool Details Modal */}
      <ToolDetailsModal tool={selectedTool} isOpen={showToolDetailsDialog} onClose={() => {
      setShowToolDetailsDialog(false);
      setSelectedTool(null);
    }} />
    </div>;
};
export default KotoDashboard;