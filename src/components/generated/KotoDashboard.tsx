"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus, MessageSquare, Wrench, ChevronLeft, Menu, Bell, User, Settings, HelpCircle, Sun, Moon, ExternalLink, Share2, Trash2, Copy, Palette, Code, Briefcase, PenTool, Target, Users, BarChart3, Zap, Globe, Figma, Cpu, Tag, X, Upload, Camera, Smile, Heart, Star, Zap as ZapIcon, Coffee, Music, Book, Gamepad2, Laptop, Smartphone, Headphones, Car, Home, Plane, Gift, ShoppingBag, CreditCard, Mail, Phone, MapPin, Calendar, Clock, Eye, EyeOff, ChevronDown, ChevronRight, Edit2, LogOut } from 'lucide-react';
import PromptCard from './PromptCard';
import { CONTANER_TYPE } from '../../dnd-kit/types';
interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  count: number;
  mpid?: string;
}
interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  model: string;
  category: string;
  coverImage?: string;
  createdAt: Date;
  mpid?: string;
}
interface Tool {
  id: string;
  name: string;
  category: string;
  url: string;
  description?: string;
  favicon?: string;
  mpid?: string;
}
interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  expanded?: boolean;
  mpid?: string;
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
  mpid?: string;
}
const iconOptions = [{
  name: 'Smile',
  icon: Smile,
  mpid: "b968c6b2-2cf2-404a-be35-abe64e3d345d"
}, {
  name: 'Heart',
  icon: Heart,
  mpid: "e06aa4d5-800e-4027-a46a-9873721c624e"
}, {
  name: 'Star',
  icon: Star,
  mpid: "bc7a23fd-0817-4df5-ab03-e95041f4a890"
}, {
  name: 'Zap',
  icon: ZapIcon,
  mpid: "6d256cbb-cf3b-4328-a57d-d55d866eb9e7"
}, {
  name: 'Coffee',
  icon: Coffee,
  mpid: "8ae58351-3ba7-4e29-bafa-e3a6a1cca056"
}, {
  name: 'Music',
  icon: Music,
  mpid: "c03d5614-ea98-478d-a859-16c1c5caeb5e"
}, {
  name: 'Book',
  icon: Book,
  mpid: "29706f0e-3fbb-45d0-a20d-b8095c83495b"
}, {
  name: 'Gamepad',
  icon: Gamepad2,
  mpid: "9d414a11-cedc-4291-a9f7-7b9bf649d094"
}, {
  name: 'Laptop',
  icon: Laptop,
  mpid: "8a125404-5930-4b49-8ac3-f6e5c6a79bfe"
}, {
  name: 'Smartphone',
  icon: Smartphone,
  mpid: "811ef5fd-0aa7-4da2-8cb5-0cd4e851bb4c"
}, {
  name: 'Headphones',
  icon: Headphones,
  mpid: "f5e078f8-f02b-47af-a8da-8065cd8083f2"
}, {
  name: 'Car',
  icon: Car,
  mpid: "0b3f831a-56c5-4d58-82cf-d9457c0e060b"
}, {
  name: 'Home',
  icon: Home,
  mpid: "b6168d2d-5e42-4617-abff-1b3f60e7c451"
}, {
  name: 'Plane',
  icon: Plane,
  mpid: "b69b9c89-95c2-4b57-ba37-6a3000597e76"
}, {
  name: 'Gift',
  icon: Gift,
  mpid: "85a58e84-3f46-46b8-884a-07f7c00378e6"
}, {
  name: 'Shopping',
  icon: ShoppingBag,
  mpid: "12c19dba-2cb8-41ff-8118-779b256cf27c"
}, {
  name: 'Card',
  icon: CreditCard,
  mpid: "db8e9d36-9448-4b3d-8f5e-2c31ca819c8f"
}, {
  name: 'Mail',
  icon: Mail,
  mpid: "9ebad579-55d2-41ff-be70-f8046e5bb30c"
}, {
  name: 'Phone',
  icon: Phone,
  mpid: "e9892d3d-48c1-4c00-9fd8-884111bfd645"
}, {
  name: 'Map',
  icon: MapPin,
  mpid: "5bd5bbce-cf88-4af3-bdce-c0218721b05d"
}, {
  name: 'Calendar',
  icon: Calendar,
  mpid: "569da6c5-fb0a-4b47-8514-10553a61aecc"
}, {
  name: 'Clock',
  icon: Clock,
  mpid: "d9e74f1f-fe6f-4385-a7ef-90f7069c6566"
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

  // New tool form state
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('AI Tools');
  const [isLoadingToolData, setIsLoadingToolData] = useState(false);
  const [toolFavicon, setToolFavicon] = useState('');

  // Settings state
  const [defaultTheme, setDefaultTheme] = useState<'light' | 'dark'>('light');
  const [backgroundImage, setBackgroundImage] = useState('');

  // Reset all data to defaults for new user
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([{
    id: 'all',
    name: 'All',
    count: 0,
    icon: Globe,
    expanded: false,
    mpid: "d6781a58-923b-43ca-9f22-3441b349b011"
  }]);
  const [toolCategories, setToolCategories] = useState<Category[]>([{
    id: 'all-tools',
    name: 'All Tools',
    count: 0,
    icon: Globe,
    expanded: false,
    mpid: "e7867256-9a54-4298-a181-4784d6aa856f"
  }]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Update category counts dynamically
  const updatedCategories = categories.map(category => {
    if (category.id === 'all') {
      return {
        ...category,
        count: prompts.length
      };
    }

    // Count prompts in this category and its subcategories
    const directPrompts = prompts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === category.id);
    const subcategoryPrompts = subcategories.filter(sub => sub.parentId === category.id).reduce((count, sub) => {
      return count + prompts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === sub.parentId).length;
    }, 0);
    return {
      ...category,
      count: directPrompts.length + subcategoryPrompts
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
      const matchesSubcategory = prompt.category.toLowerCase().replace(/\s+/g, '-') === subcategory.parentId;
      return matchesSearch && matchesSubcategory;
    }

    // Regular category matching
    const matchesCategory = prompt.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
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
      mpid: `project-${Date.now()}`
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
        mpid: `subcat-${Date.now()}-${subcat}`
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
  const handleCreatePrompt = () => {
    if (!newPromptTitle.trim() || !newPromptContent.trim()) return;
    const newPrompt: Prompt = {
      id: `prompt-${Date.now()}`,
      title: newPromptTitle,
      content: newPromptContent,
      model: newPromptModel,
      tags: newPromptTags,
      category: activeCategory === 'all' ? 'General' : getCurrentCategoryName(),
      coverImage: newPromptCoverImage,
      createdAt: new Date(),
      mpid: `prompt-${Date.now()}`
    };
    setPrompts(prev => [newPrompt, ...prev]);

    // Reset form
    setNewPromptTitle('');
    setNewPromptContent('');
    setNewPromptModel('GPT-4');
    setNewPromptTags([]);
    setNewPromptCoverImage('');
    setShowNewPromptDialog(false);
  };
  const handleCreateTool = () => {
    if (!newToolName.trim() || !newToolUrl.trim()) return;
    const newTool: Tool = {
      id: `tool-${Date.now()}`,
      name: newToolName,
      url: newToolUrl,
      description: newToolDescription,
      favicon: toolFavicon,
      category: activeCategory === 'all-tools' ? newToolCategory : getCurrentCategoryName(),
      mpid: `tool-${Date.now()}`
    };
    setTools(prev => [newTool, ...prev]);

    // Reset form
    setNewToolName('');
    setNewToolUrl('');
    setNewToolDescription('');
    setNewToolCategory('AI Tools');
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
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setNewPromptCoverImage(e.target?.result as string);
      };
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
    // Create a new subcategory with a default name
    const subcatName = `New Subcategory ${Date.now()}`;
    const newSubcat: Subcategory = {
      id: `${parentId}-${subcatName.toLowerCase().replace(/\s+/g, '-')}`,
      name: subcatName,
      parentId: parentId,
      count: 0,
      mpid: `subcat-${Date.now()}`
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
      // Count items in this subcategory
      if (activeTab === 'prompts') {
        return prompts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === subcategory.parentId).length;
      } else {
        return tools.filter(t => t.category.toLowerCase().replace(/\s+/g, '-') === subcategory.parentId).length;
      }
    }

    // Check in the appropriate category list
    const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
    const category = categoryList.find(cat => cat.id === activeCategory);
    return category ? category.count : activeTab === 'prompts' ? prompts.length : tools.length;
  };
  const truncateText = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
  return <div className={`h-screen w-full ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-900 flex overflow-hidden transition-colors duration-300`} style={{
    fontFamily: 'Space Grotesk, sans-serif'
  }} data-magicpath-id="0" data-magicpath-path="KotoDashboard.tsx">
      {/* Sidebar */}
      <motion.aside animate={{
      width: sidebarCollapsed ? 80 : 280
    }} transition={{
      duration: 0.3,
      ease: 'easeInOut'
    }} className="hidden md:block h-full flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700" data-magicpath-id="1" data-magicpath-path="KotoDashboard.tsx">
        <div className="h-full flex flex-col" data-magicpath-id="2" data-magicpath-path="KotoDashboard.tsx">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700" data-magicpath-id="3" data-magicpath-path="KotoDashboard.tsx">
            <div className="flex items-center justify-between" data-magicpath-id="4" data-magicpath-path="KotoDashboard.tsx">
              <AnimatePresence mode="wait" data-magicpath-id="5" data-magicpath-path="KotoDashboard.tsx">
                {!sidebarCollapsed && <motion.div initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -20
              }} className="flex items-center space-x-3" data-magicpath-id="6" data-magicpath-path="KotoDashboard.tsx">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center" data-magicpath-id="7" data-magicpath-path="KotoDashboard.tsx">
                      <span className="text-white font-bold text-lg" data-magicpath-id="8" data-magicpath-path="KotoDashboard.tsx">K</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white" data-magicpath-id="9" data-magicpath-path="KotoDashboard.tsx">Koto</h1>
                  </motion.div>}
              </AnimatePresence>
              
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="10" data-magicpath-path="KotoDashboard.tsx">
                <ChevronLeft className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} data-magicpath-id="11" data-magicpath-path="KotoDashboard.tsx" />
              </button>
            </div>
          </div>

          {/* Search */}
          {!sidebarCollapsed && <div className="p-4" data-magicpath-id="12" data-magicpath-path="KotoDashboard.tsx">
              <div className="relative" data-magicpath-id="13" data-magicpath-path="KotoDashboard.tsx">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" data-magicpath-id="14" data-magicpath-path="KotoDashboard.tsx" />
                <input type="text" placeholder="Search prompts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-sm placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-600 transition-colors" data-magicpath-id="15" data-magicpath-path="KotoDashboard.tsx" />
              </div>
            </div>}

          {/* Categories */}
          <div className="flex-1 overflow-y-auto" data-magicpath-id="16" data-magicpath-path="KotoDashboard.tsx">
            <div className="p-4" data-magicpath-id="17" data-magicpath-path="KotoDashboard.tsx">
              {!sidebarCollapsed && <div className="flex items-center justify-between mb-4" data-magicpath-id="18" data-magicpath-path="KotoDashboard.tsx">
                  <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide" data-magicpath-id="19" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'toolbox' ? 'STACKS' : 'PROJECTS'}
                  </h2>
                  <button onClick={() => setShowAddProjectDialog(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" data-magicpath-id="20" data-magicpath-path="KotoDashboard.tsx">
                    <Plus className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="KotoDashboard.tsx" />
                  </button>
                </div>}
              
              <div className="space-y-1" data-magicpath-id="22" data-magicpath-path="KotoDashboard.tsx">
                {/* All Button - Fixed on top with count */}
                <div className="mb-2" data-magicpath-id="23" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setActiveCategory('all')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeCategory === 'all' ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`} data-magicpath-id="24" data-magicpath-path="KotoDashboard.tsx">
                    <Globe className="w-5 h-5 flex-shrink-0" data-magicpath-id="25" data-magicpath-path="KotoDashboard.tsx" />
                    {!sidebarCollapsed && <div className="flex items-center justify-between w-full" data-magicpath-id="26" data-magicpath-path="KotoDashboard.tsx">
                        <span className="font-medium text-sm" data-magicpath-id="27" data-magicpath-path="KotoDashboard.tsx">All</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'}`} data-magicpath-id="28" data-magicpath-path="KotoDashboard.tsx">
                          {activeTab === 'prompts' ? updatedCategories.find(c => c.id === 'all')?.count || 0 : updatedToolCategories.find(c => c.id === 'all-tools')?.count || 0}
                        </span>
                      </div>}
                  </button>
                </div>

                {(activeTab === 'prompts' ? updatedCategories.filter(cat => cat.id !== 'all') : updatedToolCategories.filter(cat => cat.id !== 'all-tools')).map(category => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                const categorySubcategories = subcategories.filter(sub => sub.parentId === category.id);
                const hasSubcategories = categorySubcategories.length > 0;
                return <div key={category.id} data-magicpath-id="29" data-magicpath-path="KotoDashboard.tsx">
                      <div className="flex items-center group" data-magicpath-id="30" data-magicpath-path="KotoDashboard.tsx">
                        <button onClick={() => setActiveCategory(category.id)} onDoubleClick={() => handleDoubleClick(category.id, category.name)} onDragOver={handleDragOver} onDrop={(e: React.DragEvent) => handleDrop(e, category.id)} className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors relative ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'} ${draggedItem ? 'border-2 border-dashed border-indigo-300 dark:border-indigo-600' : ''}`} data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx">
                          <Icon className="w-5 h-5 flex-shrink-0" data-magicpath-id="32" data-magicpath-path="KotoDashboard.tsx" />
                          <AnimatePresence mode="wait" data-magicpath-id="33" data-magicpath-path="KotoDashboard.tsx">
                            {!sidebarCollapsed && <motion.div initial={{
                          opacity: 0,
                          x: -10
                        }} animate={{
                          opacity: 1,
                          x: 0
                        }} exit={{
                          opacity: 0,
                          x: -10
                        }} className="flex items-center justify-between w-full" data-magicpath-id="34" data-magicpath-path="KotoDashboard.tsx">
                                {editingItem === category.id ? <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => handleRename(category.id, 'category')} onKeyPress={e => e.key === 'Enter' && handleRename(category.id, 'category')} className="bg-transparent border-none outline-none text-sm font-medium flex-1" autoFocus data-magicpath-id="35" data-magicpath-path="KotoDashboard.tsx" /> : <span className="font-medium text-sm truncate" title={category.name} data-magicpath-id="36" data-magicpath-path="KotoDashboard.tsx">{truncateText(category.name)}</span>}
                                
                                {/* Inline action buttons */}
                                <div className="flex items-center space-x-1" data-magicpath-id="37" data-magicpath-path="KotoDashboard.tsx">
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
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all" data-magicpath-id="38" data-magicpath-path="KotoDashboard.tsx">
                                    <Trash2 className="w-4 h-4 text-red-500" data-magicpath-id="39" data-magicpath-path="KotoDashboard.tsx" />
                                  </button>
                                  
                                  {/* Add subcategory button */}
                                  <button onClick={e => {
                              e.stopPropagation();
                              handleAddSubcategoryToProject(category.id);
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all" data-magicpath-id="40" data-magicpath-path="KotoDashboard.tsx">
                                    <Plus className="w-4 h-4 text-slate-400" data-magicpath-id="41" data-magicpath-path="KotoDashboard.tsx" />
                                  </button>
                                  
                                  {/* Expand/collapse button for subcategories - always show if has subcategories or on hover */}
                                  {(hasSubcategories || category.expanded) && <button onClick={e => {
                              e.stopPropagation();
                              toggleCategoryExpansion(category.id);
                            }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" data-magicpath-id="42" data-magicpath-path="KotoDashboard.tsx">
                                      {category.expanded ? <ChevronDown className="w-4 h-4 text-slate-400" data-magicpath-id="43" data-magicpath-path="KotoDashboard.tsx" /> : <ChevronRight className="w-4 h-4 text-slate-400" data-magicpath-id="44" data-magicpath-path="KotoDashboard.tsx" />}
                                    </button>}
                                </div>
                              </motion.div>}
                          </AnimatePresence>
                        </button>
                      </div>
                      
                      {/* Subcategories */}
                      <AnimatePresence data-magicpath-id="45" data-magicpath-path="KotoDashboard.tsx">
                        {!sidebarCollapsed && category.expanded && categorySubcategories.length > 0 && <motion.div initial={{
                      opacity: 0,
                      height: 0
                    }} animate={{
                      opacity: 1,
                      height: 'auto'
                    }} exit={{
                      opacity: 0,
                      height: 0
                    }} className="ml-8 mt-1 space-y-1" data-magicpath-id="46" data-magicpath-path="KotoDashboard.tsx">
                            {categorySubcategories.map(subcategory => {
                        const subcategoryCount = activeTab === 'prompts' ? prompts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === subcategory.parentId).length : tools.filter(t => t.category.toLowerCase().replace(/\s+/g, '-') === subcategory.parentId).length;
                        return <button key={subcategory.id} onClick={() => setActiveCategory(subcategory.id)} onDoubleClick={() => handleDoubleClick(subcategory.id, subcategory.name)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${activeCategory === subcategory.id ? 'bg-slate-700 dark:bg-slate-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'}`} data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="47" data-magicpath-path="KotoDashboard.tsx">
                                <div className="flex items-center justify-between w-full" data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="48" data-magicpath-path="KotoDashboard.tsx">
                                  {editingItem === subcategory.id ? <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => handleRename(subcategory.id, 'subcategory')} onKeyPress={e => e.key === 'Enter' && handleRename(subcategory.id, 'subcategory')} className="bg-transparent border-none outline-none text-sm flex-1" autoFocus data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="49" data-magicpath-path="KotoDashboard.tsx" /> : <span className="truncate" title={subcategory.name} data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="50" data-magicpath-path="KotoDashboard.tsx">{truncateText(subcategory.name, 15)}</span>}
                                  
                                  <div className="flex items-center space-x-1" data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="51" data-magicpath-path="KotoDashboard.tsx">
                                    {/* Subcategory count */}
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === subcategory.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'}`} data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="52" data-magicpath-path="KotoDashboard.tsx">
                                      {subcategoryCount}
                                    </span>
                                    
                                    {/* Delete subcategory button */}
                                    <button onClick={e => {
                                e.stopPropagation();
                                setSubcategories(prev => prev.filter(sub => sub.id !== subcategory.id));
                              }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all ml-2" data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="53" data-magicpath-path="KotoDashboard.tsx">
                                      <Trash2 className="w-3 h-3 text-red-500" data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="54" data-magicpath-path="KotoDashboard.tsx" />
                                    </button>
                                  </div>
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
          <div className="p-4 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="55" data-magicpath-path="KotoDashboard.tsx">
            <div className="space-y-1" data-magicpath-id="56" data-magicpath-path="KotoDashboard.tsx">
              <button onClick={() => setShowSettingsDialog(true)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="57" data-magicpath-path="KotoDashboard.tsx">
                <Settings className="w-5 h-5 flex-shrink-0" data-magicpath-id="58" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="59" data-magicpath-path="KotoDashboard.tsx">Settings</span>}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="60" data-magicpath-path="KotoDashboard.tsx">
                {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" data-magicpath-id="61" data-magicpath-path="KotoDashboard.tsx" /> : <Moon className="w-5 h-5 flex-shrink-0" data-magicpath-id="62" data-magicpath-path="KotoDashboard.tsx" />}
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="63" data-magicpath-path="KotoDashboard.tsx">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="64" data-magicpath-path="KotoDashboard.tsx">
                <HelpCircle className="w-5 h-5 flex-shrink-0" data-magicpath-id="65" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="66" data-magicpath-path="KotoDashboard.tsx">Help</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" data-magicpath-id="67" data-magicpath-path="KotoDashboard.tsx">
        {/* Content Area */}
        <main className="flex-1 overflow-auto" data-magicpath-id="68" data-magicpath-path="KotoDashboard.tsx">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden" style={{
          backgroundImage: backgroundImage ? `url('${backgroundImage}')` : `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} data-magicpath-id="69" data-magicpath-path="KotoDashboard.tsx">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50" data-magicpath-id="70" data-magicpath-path="KotoDashboard.tsx"></div>
            
            {/* Profile Menu */}
            <div className="absolute top-6 right-6" data-magicpath-id="71" data-magicpath-path="KotoDashboard.tsx">
              <div className="relative" data-magicpath-id="72" data-magicpath-path="KotoDashboard.tsx">
                <motion.button onClick={() => setShowProfileMenu(!showProfileMenu)} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex items-center space-x-3 p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-colors" data-magicpath-id="73" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center" data-magicpath-id="74" data-magicpath-path="KotoDashboard.tsx">
                    <User className="w-5 h-5 text-white" data-magicpath-id="75" data-magicpath-path="KotoDashboard.tsx" />
                  </div>
                  <div className="text-left text-white" data-magicpath-id="76" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-sm font-medium" data-magicpath-id="77" data-magicpath-path="KotoDashboard.tsx">Login</div>
                    <div className="text-xs text-white/80" data-magicpath-id="78" data-magicpath-path="KotoDashboard.tsx">Sign in to continue</div>
                  </div>
                </motion.button>

                <AnimatePresence data-magicpath-id="79" data-magicpath-path="KotoDashboard.tsx">
                  {showProfileMenu && <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: 10
                }} className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1" data-magicpath-id="80" data-magicpath-path="KotoDashboard.tsx">
                      <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="81" data-magicpath-path="KotoDashboard.tsx">
                        <User className="w-4 h-4" data-magicpath-id="82" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="83" data-magicpath-path="KotoDashboard.tsx">Sign in</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="84" data-magicpath-path="KotoDashboard.tsx">
                        <User className="w-4 h-4" data-magicpath-id="85" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="86" data-magicpath-path="KotoDashboard.tsx">Create Account</span>
                      </button>
                      <button onClick={() => setShowSettingsDialog(true)} className="w-full px-4 py-1 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="87" data-magicpath-path="KotoDashboard.tsx">
                        <Settings className="w-4 h-4" data-magicpath-id="88" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="89" data-magicpath-path="KotoDashboard.tsx">Settings</span>
                      </button>
                      <hr className="my-2 border-slate-200 dark:border-slate-700" data-magicpath-id="90" data-magicpath-path="KotoDashboard.tsx" />
                      <button className="w-full px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="91" data-magicpath-path="KotoDashboard.tsx">
                        <HelpCircle className="w-4 h-4" data-magicpath-id="92" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="93" data-magicpath-path="KotoDashboard.tsx">Help & Support</span>
                      </button>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative h-full flex items-center justify-center" data-magicpath-id="94" data-magicpath-path="KotoDashboard.tsx">
              <div className="text-center text-white flex flex-col items-center justify-center w-full max-w-4xl px-8" style={{
              display: "flex",
              width: "96%",
              maxWidth: "96%"
            }} data-magicpath-id="95" data-magicpath-path="KotoDashboard.tsx">
                {/* First Row - Centered Tabs */}
                <div className="mb-8" data-magicpath-id="96" data-magicpath-path="KotoDashboard.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex" style={{
                  display: "flex",
                  alignItems: "center"
                }} data-magicpath-id="97" data-magicpath-path="KotoDashboard.tsx">
                    <div className="flex space-x-1" style={{
                    alignItems: "center"
                  }} data-magicpath-id="98" data-magicpath-path="KotoDashboard.tsx">
                      <button onClick={() => setActiveTab('prompts')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="99" data-magicpath-path="KotoDashboard.tsx">
                        <MessageSquare className="w-4 h-4" data-magicpath-id="100" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="101" data-magicpath-path="KotoDashboard.tsx">Prompts</span>
                      </button>
                      <button onClick={() => setActiveTab('toolbox')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'toolbox' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="102" data-magicpath-path="KotoDashboard.tsx">
                        <Wrench className="w-4 h-4" data-magicpath-id="103" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="104" data-magicpath-path="KotoDashboard.tsx">Tool Box</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Row - Title and Actions */}
                <div className="flex items-center justify-between w-full max-w-3xl" style={{
                alignItems: "end",
                width: "100%",
                maxWidth: "100%"
              }} data-magicpath-id="105" data-magicpath-path="KotoDashboard.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  paddingTop: "16px",
                  paddingBottom: "16px"
                }} data-magicpath-id="106" data-magicpath-path="KotoDashboard.tsx">
                    <div className="flex items-center space-x-3" data-magicpath-id="107" data-magicpath-path="KotoDashboard.tsx">
                      <Palette className="w-6 h-6" data-magicpath-id="108" data-magicpath-path="KotoDashboard.tsx" />
                      <h1 className="text-2xl font-bold" data-magicpath-id="109" data-magicpath-path="KotoDashboard.tsx">
                        {getCurrentCategoryName()}
                      </h1>
                    </div>
                    <p className="text-white/80" data-magicpath-id="110" data-magicpath-path="KotoDashboard.tsx">
                      {getCurrentCategoryCount()} {activeTab === 'prompts' ? 'prompts' : 'tools'} available
                    </p>
                  </div>

                  <div className="flex items-center space-x-4" data-magicpath-id="111" data-magicpath-path="KotoDashboard.tsx">
                    <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg transition-colors" data-magicpath-id="112" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="113" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="114" data-magicpath-path="KotoDashboard.tsx">{activeTab === 'prompts' ? 'Add Prompt' : 'Add Tool'}</span>
                    </motion.button>
                    
                    <motion.button onClick={() => setShowAddProjectDialog(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 backdrop-blur-sm transition-colors" data-magicpath-id="115" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="116" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="117" data-magicpath-path="KotoDashboard.tsx">{activeTab === 'toolbox' ? 'Add Stack' : 'Add Project'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6" data-magicpath-id="118" data-magicpath-path="KotoDashboard.tsx">
            <div className="max-w-7xl mx-auto" data-magicpath-id="119" data-magicpath-path="KotoDashboard.tsx">
              {/* Show prompts/tools if they exist, otherwise show empty state */}
              {(activeTab === 'prompts' ? filteredPrompts.length > 0 : filteredTools.length > 0) ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="120" data-magicpath-path="KotoDashboard.tsx">
                  {activeTab === 'prompts' ? filteredPrompts.map(prompt => <div key={prompt.id} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, 'prompt', prompt)} data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="121" data-magicpath-path="KotoDashboard.tsx">
                      <PromptCard title={prompt.title} description={prompt.content} tags={prompt.tags} model={prompt.model} coverImage={prompt.coverImage} onClick={() => handlePromptClick(prompt)} mpid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="122" data-magicpath-path="KotoDashboard.tsx" />
                    </div>) : filteredTools.map(tool => <div key={tool.id} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, 'tool', tool)} onClick={() => handleToolClick(tool)} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200 hover:scale-102 hover:-translate-y-1" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="123" data-magicpath-path="KotoDashboard.tsx">
                      <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="124" data-magicpath-path="KotoDashboard.tsx">
                        <div className="flex items-center space-x-3 flex-1 min-w-0" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="125" data-magicpath-path="KotoDashboard.tsx">
                          {tool.favicon && <img src={tool.favicon} alt={`${tool.name} favicon`} className="w-6 h-6 rounded-sm flex-shrink-0" onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="favicon:unknown" data-magicpath-id="126" data-magicpath-path="KotoDashboard.tsx" />}
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight truncate" title={tool.name} data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="127" data-magicpath-path="KotoDashboard.tsx">
                            {truncateText(tool.name, 25)}
                          </h3>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="128" data-magicpath-path="KotoDashboard.tsx" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="129" data-magicpath-path="KotoDashboard.tsx">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="130" data-magicpath-path="KotoDashboard.tsx">
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="131" data-magicpath-path="KotoDashboard.tsx">
                          {tool.category}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-32" title={tool.url} data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="url:unknown" data-magicpath-id="132" data-magicpath-path="KotoDashboard.tsx">
                          {truncateText(tool.url, 20)}
                        </span>
                      </div>
                    </div>)}
                </div> : (/* Empty State for New User */
            <div className="text-center py-12" data-magicpath-id="133" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4" data-magicpath-id="134" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'prompts' ? <MessageSquare className="w-8 h-8 text-slate-400" data-magicpath-id="135" data-magicpath-path="KotoDashboard.tsx" /> : <Wrench className="w-8 h-8 text-slate-400" data-magicpath-id="136" data-magicpath-path="KotoDashboard.tsx" />}
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2" data-magicpath-id="137" data-magicpath-path="KotoDashboard.tsx">
                    Welcome to Koto!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6" data-magicpath-id="138" data-magicpath-path="KotoDashboard.tsx">
                    Get started by creating your first {activeTab === 'prompts' ? 'prompt' : 'tool'} or project
                  </p>
                  <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto transition-colors" data-magicpath-id="139" data-magicpath-path="KotoDashboard.tsx">
                    <Plus className="w-4 h-4" data-magicpath-id="140" data-magicpath-path="KotoDashboard.tsx" />
                    <span data-magicpath-id="141" data-magicpath-path="KotoDashboard.tsx">Add {activeTab === 'prompts' ? 'Prompt' : 'Tool'}</span>
                  </motion.button>
                </div>)}
            </div>
          </div>
        </main>
      </div>

      {/* Add Project Dialog */}
      <AnimatePresence data-magicpath-id="142" data-magicpath-path="KotoDashboard.tsx">
        {showAddProjectDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowAddProjectDialog(false)} data-magicpath-id="143" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.1,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="144" data-magicpath-path="KotoDashboard.tsx">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="145" data-magicpath-path="KotoDashboard.tsx">
                Add New {activeTab === 'toolbox' ? 'Stack' : 'Project'}
              </h1>
              
              <div className="space-y-6" data-magicpath-id="146" data-magicpath-path="KotoDashboard.tsx">
                {/* Stack/Project Name */}
                <div data-magicpath-id="147" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="148" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Name
                  </label>
                  <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder={`Enter ${activeTab === 'toolbox' ? 'stack' : 'project'} name`} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="149" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Stack/Project Icon */}
                <div data-magicpath-id="150" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="151" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto" data-magicpath-id="152" data-magicpath-path="KotoDashboard.tsx">
                    {iconOptions.map(option => {
                  const IconComponent = option.icon;
                  return <button key={option.name} onClick={() => setSelectedIcon(option)} className={`p-2 rounded-lg border-2 transition-colors ${selectedIcon.name === option.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-uuid={(option as any)["mpid"] ?? "unsafe"} data-magicpath-id="153" data-magicpath-path="KotoDashboard.tsx">
                          <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-uuid={(option as any)["mpid"] ?? "unsafe"} data-magicpath-id="154" data-magicpath-path="KotoDashboard.tsx" />
                        </button>;
                })}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="155" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowAddProjectDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="156" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleAddProject} disabled={!newProjectName.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="157" data-magicpath-path="KotoDashboard.tsx">
                    Add {activeTab === 'toolbox' ? 'Stack' : 'Project'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Prompt Dialog */}
      <AnimatePresence data-magicpath-id="158" data-magicpath-path="KotoDashboard.tsx">
        {showNewPromptDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewPromptDialog(false)} data-magicpath-id="159" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="160" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="161" data-magicpath-path="KotoDashboard.tsx">Add New Prompt</h2>
              
              <div className="space-y-6" data-magicpath-id="162" data-magicpath-path="KotoDashboard.tsx">
                {/* Title */}
                <div data-magicpath-id="163" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="164" data-magicpath-path="KotoDashboard.tsx">
                    Title
                  </label>
                  <input type="text" value={newPromptTitle} onChange={e => setNewPromptTitle(e.target.value)} placeholder="Enter prompt title" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="165" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Content */}
                <div data-magicpath-id="166" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="167" data-magicpath-path="KotoDashboard.tsx">
                    Content
                  </label>
                  <textarea value={newPromptContent} onChange={e => setNewPromptContent(e.target.value)} placeholder="Enter prompt content" rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="168" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Model */}
                <div data-magicpath-id="169" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="170" data-magicpath-path="KotoDashboard.tsx">
                    Model
                  </label>
                  <select value={newPromptModel} onChange={e => setNewPromptModel(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="171" data-magicpath-path="KotoDashboard.tsx">
                    <option value="GPT-4" data-magicpath-id="172" data-magicpath-path="KotoDashboard.tsx">GPT-4</option>
                    <option value="Claude" data-magicpath-id="173" data-magicpath-path="KotoDashboard.tsx">Claude</option>
                    <option value="Midjourney" data-magicpath-id="174" data-magicpath-path="KotoDashboard.tsx">Midjourney</option>
                    <option value="DALL-E" data-magicpath-id="175" data-magicpath-path="KotoDashboard.tsx">DALL-E</option>
                  </select>
                </div>

                {/* Tags */}
                <div data-magicpath-id="176" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="177" data-magicpath-path="KotoDashboard.tsx">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2" data-magicpath-id="178" data-magicpath-path="KotoDashboard.tsx">
                    <input type="text" value={newPromptTagInput} onChange={e => setNewPromptTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddPromptTag()} placeholder="Enter tag" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="179" data-magicpath-path="KotoDashboard.tsx" />
                    <button onClick={handleAddPromptTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="180" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="181" data-magicpath-path="KotoDashboard.tsx" />
                    </button>
                  </div>
                  
                  {/* Tags Display */}
                  {newPromptTags.length > 0 && <div className="flex flex-wrap gap-1.5" data-magicpath-id="182" data-magicpath-path="KotoDashboard.tsx">
                      {newPromptTags.map(tag => <span key={tag} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="183" data-magicpath-path="KotoDashboard.tsx">
                          {tag}
                          <button onClick={() => removePromptTag(tag)} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="184" data-magicpath-path="KotoDashboard.tsx">
                            <X className="w-3 h-3" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="185" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </span>)}
                    </div>}
                </div>

                {/* Cover Image */}
                <div data-magicpath-id="186" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="187" data-magicpath-path="KotoDashboard.tsx">
                    Cover Image (optional)
                  </label>
                  <div className="space-y-3" data-magicpath-id="188" data-magicpath-path="KotoDashboard.tsx">
                    <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" id="cover-image-upload" data-magicpath-id="189" data-magicpath-path="KotoDashboard.tsx" />
                    <label htmlFor="cover-image-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors" data-magicpath-id="190" data-magicpath-path="KotoDashboard.tsx">
                      <div className="text-center" data-magicpath-id="191" data-magicpath-path="KotoDashboard.tsx">
                        <Camera className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                        <div className="text-sm text-slate-600 dark:text-slate-400" data-magicpath-id="192" data-magicpath-path="KotoDashboard.tsx">
                          Click to upload cover image
                        </div>
                      </div>
                    </label>
                    
                    {newPromptCoverImage && <div className="relative" data-magicpath-id="193" data-magicpath-path="KotoDashboard.tsx">
                        <img src={newPromptCoverImage} alt="Cover preview" className="w-full h-32 object-cover rounded-lg" data-magicpath-id="194" data-magicpath-path="KotoDashboard.tsx" />
                        <button onClick={() => setNewPromptCoverImage('')} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors" data-magicpath-id="195" data-magicpath-path="KotoDashboard.tsx">
                          <X className="w-3 h-3" data-magicpath-id="196" data-magicpath-path="KotoDashboard.tsx" />
                        </button>
                      </div>}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="197" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowNewPromptDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="198" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleCreatePrompt} disabled={!newPromptTitle.trim() || !newPromptContent.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="199" data-magicpath-path="KotoDashboard.tsx">
                    Create Prompt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Tool Dialog */}
      <AnimatePresence data-magicpath-id="200" data-magicpath-path="KotoDashboard.tsx">
        {showNewToolDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewToolDialog(false)} data-magicpath-id="201" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="202" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="203" data-magicpath-path="KotoDashboard.tsx">Add New Tool</h2>
              
              <div className="space-y-6" data-magicpath-id="204" data-magicpath-path="KotoDashboard.tsx">
                {/* URL - First field */}
                <div data-magicpath-id="205" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="206" data-magicpath-path="KotoDashboard.tsx">
                    URL
                  </label>
                  <div className="relative" data-magicpath-id="207" data-magicpath-path="KotoDashboard.tsx">
                    <input type="url" value={newToolUrl} onChange={e => setNewToolUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="208" data-magicpath-path="KotoDashboard.tsx" />
                    {isLoadingToolData && <div className="absolute right-3 top-1/2 transform -translate-y-1/2" data-magicpath-id="209" data-magicpath-path="KotoDashboard.tsx">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" data-magicpath-id="210" data-magicpath-path="KotoDashboard.tsx"></div>
                      </div>}
                  </div>
                </div>

                {/* Name - Auto-completed */}
                <div data-magicpath-id="211" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="212" data-magicpath-path="KotoDashboard.tsx">
                    Tool Name
                    {newToolName && !isLoadingToolData && <span className="ml-2 text-xs text-green-600 dark:text-green-400" data-magicpath-id="213" data-magicpath-path="KotoDashboard.tsx">✓ Auto-completed</span>}
                  </label>
                  <div className="relative" data-magicpath-id="214" data-magicpath-path="KotoDashboard.tsx">
                    <input type="text" value={newToolName} onChange={e => setNewToolName(e.target.value)} placeholder="Enter tool name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="215" data-magicpath-path="KotoDashboard.tsx" />
                    {toolFavicon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2" data-magicpath-id="216" data-magicpath-path="KotoDashboard.tsx">
                        <img src={toolFavicon} alt="Site favicon" className="w-5 h-5 rounded-sm" onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} data-magicpath-id="217" data-magicpath-path="KotoDashboard.tsx" />
                      </div>}
                  </div>
                </div>

                {/* Description - Auto-completed */}
                <div data-magicpath-id="218" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="219" data-magicpath-path="KotoDashboard.tsx">
                    Description
                    {newToolDescription && !isLoadingToolData && <span className="ml-2 text-xs text-green-600 dark:text-green-400" data-magicpath-id="220" data-magicpath-path="KotoDashboard.tsx">✓ Auto-completed</span>}
                  </label>
                  <textarea value={newToolDescription} onChange={e => setNewToolDescription(e.target.value)} placeholder="Enter tool description (will auto-complete based on URL)" rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="221" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Category */}
                <div data-magicpath-id="222" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="223" data-magicpath-path="KotoDashboard.tsx">
                    Category
                  </label>
                  <select value={newToolCategory} onChange={e => setNewToolCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="224" data-magicpath-path="KotoDashboard.tsx">
                    <option value="AI Tools" data-magicpath-id="225" data-magicpath-path="KotoDashboard.tsx">AI Tools</option>
                    <option value="UIDesign" data-magicpath-id="226" data-magicpath-path="KotoDashboard.tsx">UI Design</option>
                    <option value="UXDesign" data-magicpath-id="227" data-magicpath-path="KotoDashboard.tsx">UX Design</option>
                    <option value="Design" data-magicpath-id="228" data-magicpath-path="KotoDashboard.tsx">Design</option>
                    <option value="Figma" data-magicpath-id="229" data-magicpath-path="KotoDashboard.tsx">Figma</option>
                    <option value="Crypto" data-magicpath-id="230" data-magicpath-path="KotoDashboard.tsx">Crypto</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="231" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowNewToolDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="232" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleCreateTool} disabled={!newToolName.trim() || !newToolUrl.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="233" data-magicpath-path="KotoDashboard.tsx">
                    Create Tool
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Settings Dialog */}
      <AnimatePresence data-magicpath-id="234" data-magicpath-path="KotoDashboard.tsx">
        {showSettingsDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowSettingsDialog(false)} data-magicpath-id="235" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="236" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="237" data-magicpath-path="KotoDashboard.tsx">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-magicpath-id="238" data-magicpath-path="KotoDashboard.tsx">Settings</h2>
                <button onClick={() => setShowSettingsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="239" data-magicpath-path="KotoDashboard.tsx">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="240" data-magicpath-path="KotoDashboard.tsx" />
                </button>
              </div>

              <div className="space-y-6" data-magicpath-id="241" data-magicpath-path="KotoDashboard.tsx">
                {/* Default Theme */}
                <div data-magicpath-id="242" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="243" data-magicpath-path="KotoDashboard.tsx">
                    Default Theme
                  </label>
                  <div className="flex space-x-3" data-magicpath-id="244" data-magicpath-path="KotoDashboard.tsx">
                    <button onClick={() => {
                  setDefaultTheme('light');
                  setDarkMode(false);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-id="245" data-magicpath-path="KotoDashboard.tsx">
                      <Sun className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" data-magicpath-id="246" data-magicpath-path="KotoDashboard.tsx" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300" data-magicpath-id="247" data-magicpath-path="KotoDashboard.tsx">Light</div>
                    </button>
                    <button onClick={() => {
                  setDefaultTheme('dark');
                  setDarkMode(true);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-id="248" data-magicpath-path="KotoDashboard.tsx">
                      <Moon className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" data-magicpath-id="249" data-magicpath-path="KotoDashboard.tsx" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300" data-magicpath-id="250" data-magicpath-path="KotoDashboard.tsx">Dark</div>
                    </button>
                  </div>
                </div>

                {/* Background Photo */}
                <div data-magicpath-id="251" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="252" data-magicpath-path="KotoDashboard.tsx">
                    Change Background Photo
                  </label>
                  <div className="space-y-3" data-magicpath-id="253" data-magicpath-path="KotoDashboard.tsx">
                    <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" id="background-upload" data-magicpath-id="254" data-magicpath-path="KotoDashboard.tsx" />
                    <label htmlFor="background-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors" data-magicpath-id="255" data-magicpath-path="KotoDashboard.tsx">
                      <div className="text-center" data-magicpath-id="256" data-magicpath-path="KotoDashboard.tsx">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" data-magicpath-id="257" data-magicpath-path="KotoDashboard.tsx" />
                        <div className="text-sm text-slate-600 dark:text-slate-400" data-magicpath-id="258" data-magicpath-path="KotoDashboard.tsx">
                          Click to upload photo
                        </div>
                      </div>
                    </label>
                    
                    {backgroundImage && <div className="relative" data-magicpath-id="259" data-magicpath-path="KotoDashboard.tsx">
                        <img src={backgroundImage} alt="Background preview" className="w-full h-20 object-cover rounded-lg" data-magicpath-id="260" data-magicpath-path="KotoDashboard.tsx" />
                        <button onClick={() => setBackgroundImage('')} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors" data-magicpath-id="261" data-magicpath-path="KotoDashboard.tsx">
                          <X className="w-3 h-3" data-magicpath-id="262" data-magicpath-path="KotoDashboard.tsx" />
                        </button>
                      </div>}
                    
                    {/* Save Button */}
                    <motion.button onClick={() => {
                  // Save the background image to the header
                  // This will automatically update the header background
                  setShowSettingsDialog(false);
                }} whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2" data-magicpath-id="263" data-magicpath-path="KotoDashboard.tsx">
                      <Camera className="w-4 h-4" />
                      <span data-magicpath-id="264" data-magicpath-path="KotoDashboard.tsx">Save Background</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="265" data-magicpath-path="KotoDashboard.tsx">
                <button onClick={() => setShowSettingsDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="266" data-magicpath-path="KotoDashboard.tsx">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;