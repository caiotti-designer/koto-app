"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus, MessageSquare, Wrench, ChevronLeft, Menu, Bell, User, Settings, HelpCircle, Sun, Moon, ExternalLink, Share2, Trash2, Copy, Palette, Code, Briefcase, PenTool, Target, Users, BarChart3, Zap, Globe, Figma, Cpu, Tag, X, Upload, Camera, Smile, Heart, Star, Zap as ZapIcon, Coffee, Music, Book, Gamepad2, Laptop, Smartphone, Headphones, Car, Home, Plane, Gift, ShoppingBag, CreditCard, Mail, Phone, MapPin, Calendar, Clock, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
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
  mpid: "882dca65-8d08-4dc5-9e1d-eec0d6a9aba0"
}, {
  name: 'Heart',
  icon: Heart,
  mpid: "c38eba83-aaaa-4e91-868e-d0548173379b"
}, {
  name: 'Star',
  icon: Star,
  mpid: "32d52ba1-8300-4fa8-983c-25e0bc2ca754"
}, {
  name: 'Zap',
  icon: ZapIcon,
  mpid: "4d13662c-1f77-4952-acf8-47c84d943f85"
}, {
  name: 'Coffee',
  icon: Coffee,
  mpid: "30ddd715-dfeb-4d6b-b690-24c9ae5cf406"
}, {
  name: 'Music',
  icon: Music,
  mpid: "158e5ea0-0ffc-4503-83c3-b93abc041f2b"
}, {
  name: 'Book',
  icon: Book,
  mpid: "4a2298d7-712b-43a3-ac4c-e3a856f8d969"
}, {
  name: 'Gamepad',
  icon: Gamepad2,
  mpid: "46d84d28-aa5b-4b3e-aead-f1566502f206"
}, {
  name: 'Laptop',
  icon: Laptop,
  mpid: "7a5faab1-cf0d-4b49-bab5-36d2e026753a"
}, {
  name: 'Smartphone',
  icon: Smartphone,
  mpid: "c39b7392-0722-4a78-abc1-2ad8ebd9ade1"
}, {
  name: 'Headphones',
  icon: Headphones,
  mpid: "b4e46c17-634b-4f2d-b56c-ac7cc416efa4"
}, {
  name: 'Car',
  icon: Car,
  mpid: "9e460773-88f5-4313-abc8-1dd9f0282dda"
}, {
  name: 'Home',
  icon: Home,
  mpid: "07372ee6-a1ba-44eb-9a5c-81732dad7ecf"
}, {
  name: 'Plane',
  icon: Plane,
  mpid: "9fc4e165-2e44-4599-a3f8-8cde0d35864d"
}, {
  name: 'Gift',
  icon: Gift,
  mpid: "0d803866-5d86-46ea-9541-a79cead685f7"
}, {
  name: 'Shopping',
  icon: ShoppingBag,
  mpid: "90f89a05-f35d-4e29-a1d1-1985ed586acb"
}, {
  name: 'Card',
  icon: CreditCard,
  mpid: "974badcd-90ba-4f05-8f8b-6309348b231a"
}, {
  name: 'Mail',
  icon: Mail,
  mpid: "5bbea595-b50d-44a3-a954-830f7f7e359a"
}, {
  name: 'Phone',
  icon: Phone,
  mpid: "7501f30a-7c03-4866-9624-431b3c5e1f9f"
}, {
  name: 'Map',
  icon: MapPin,
  mpid: "2d730a45-b21a-4a3d-9b94-b785ccff0c87"
}, {
  name: 'Calendar',
  icon: Calendar,
  mpid: "501b7e35-fe22-41f8-a478-f981f70fc5d6"
}, {
  name: 'Clock',
  icon: Clock,
  mpid: "ad5067a8-836a-4e85-acf8-ab3ac05a5270"
}] as any[];
const KotoDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>('prompts');
  const [activeCategory, setActiveCategory] = useState<string>('midjourney');
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

  // New tool form state
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('AI Tools');

  // Settings state
  const [defaultTheme, setDefaultTheme] = useState<'light' | 'dark'>('light');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([{
    id: '1',
    title: 'Woman and Tiger',
    content: 'A woman in an oversized sweater and trousers walks with her pet white tiger on the streets of New York City, in the style of cinematic photography.',
    tags: ['sref', 'fashion', 'fashion', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-15'),
    mpid: "90a9dc16-3c5f-4579-9ba8-57c3115dfec5"
  }, {
    id: '2',
    title: 'Man and Leopard',
    content: 'A man dressed in a tailored blazer and fitted jeans strides confidently with a striking spotted leopard companion through the bustling streets.',
    tags: ['sref', 'fashion', 'luxury', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-14'),
    mpid: "b2689701-35b9-49fc-8bb1-b2f5be1c367f"
  }, {
    id: '3',
    title: 'Girl and Owl',
    content: 'A young girl in a floral dress and cowboy boots stands in a whimsical forest clearing, holding hands with a majestic owl.',
    tags: ['sref', 'whimsy', 'nature', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-13'),
    mpid: "3c5945e4-cfd5-4e13-a1cc-bd48eb853f3f"
  }, {
    id: '4',
    title: 'Boy and Falcon',
    content: 'A boy in a leather jacket and aviator sunglasses stands on a rocky cliff, proudly displaying a magnificent falcon perched on his arm.',
    tags: ['sref', 'adventure', 'wildlife', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-12'),
    mpid: "17d1b2f7-52c0-48e2-bd7e-9cd8b52c357d"
  }, {
    id: '5',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-11'),
    mpid: "d90238c1-c030-4f02-8d18-555ce5181752"
  }, {
    id: '6',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-10'),
    mpid: "a25ef216-c367-4d29-9280-52e819109029"
  }, {
    id: '7',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-09'),
    mpid: "9a5d95e1-24fb-47a4-ae16-bdc342dc2189"
  }, {
    id: '8',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-08'),
    mpid: "5484c431-ad69-4222-9e52-11071fc18dd3"
  }]);
  const [tools, setTools] = useState<Tool[]>([{
    id: '1',
    name: 'Chat-GPT',
    category: 'AI Tools',
    url: 'https://chat.openai.com',
    description: 'Advanced AI language model for conversations, writing, and problem-solving.',
    mpid: "0a11bb1b-6f8b-4add-acb3-2c786bbe4d53"
  }, {
    id: '2',
    name: 'Claude',
    category: 'AI Tools',
    url: 'https://claude.ai',
    description: 'AI assistant by Anthropic for helpful, harmless, and honest conversations.',
    mpid: "ddaad020-d654-48eb-9011-851795ef3be7"
  }, {
    id: '3',
    name: 'DeepSeek',
    category: 'AI Tools',
    url: 'https://deepseek.com',
    description: 'Advanced AI model for coding, reasoning, and complex problem-solving.',
    mpid: "0e98f501-4191-4f59-993d-fe978108681d"
  }, {
    id: '4',
    name: 'Grok',
    category: 'AI Tools',
    url: 'https://grok.x.ai',
    description: 'AI assistant with real-time information and witty personality.',
    mpid: "62e89a02-da0a-4664-b6ab-4772bd1ef40b"
  }]);
  const [categories, setCategories] = useState<Category[]>([{
    id: 'midjourney',
    name: 'Midjourney',
    count: 0,
    icon: Palette,
    expanded: false,
    mpid: "cce5e15a-b242-4406-815d-b8eeac3a5c6e"
  }, {
    id: 'chat-gpt',
    name: 'Chat-GPT',
    count: 0,
    icon: MessageSquare,
    expanded: false,
    mpid: "7d56d0b3-8155-4759-a6a7-6b89ccdc5de5"
  }, {
    id: 'development',
    name: 'Development',
    count: 0,
    icon: Code,
    expanded: false,
    mpid: "6ded16d5-bd0a-4201-a06b-b56d56267a12"
  }, {
    id: 'design',
    name: 'Design',
    count: 0,
    icon: PenTool,
    expanded: false,
    mpid: "d7a39c7c-f262-48e4-81fa-9cc3e15d24a9"
  }, {
    id: 'business',
    name: 'Business',
    count: 0,
    icon: Briefcase,
    expanded: false,
    mpid: "8a080b5c-6bb1-4b12-86af-4fafce5afee8"
  }, {
    id: 'marketing',
    name: 'Marketing',
    count: 0,
    icon: Target,
    expanded: false,
    mpid: "7f25a4bc-c982-44e8-9226-8b0b36e3b554"
  }, {
    id: 'sales',
    name: 'Sales',
    count: 0,
    icon: BarChart3,
    expanded: false,
    mpid: "76b0f8c4-64ea-4d85-9bbb-d717536c67cf"
  }, {
    id: 'customer-support',
    name: 'Customer Support',
    count: 0,
    icon: Users,
    expanded: false,
    mpid: "0a2fc00a-d1f2-4ce7-9b22-728360652f61"
  }, {
    id: 'research',
    name: 'Research',
    count: 0,
    icon: Search,
    expanded: false,
    mpid: "39843ecb-21c3-4308-8d45-d4456aa0f325"
  }, {
    id: 'writing',
    name: 'Writing',
    count: 0,
    icon: PenTool,
    expanded: false,
    mpid: "7065bcdb-0065-4313-b7d7-1787ff0d6ca7"
  }]);
  const [toolCategories, setToolCategories] = useState<Category[]>([{
    id: 'all-tools',
    name: 'All Tools',
    count: 0,
    icon: Globe,
    expanded: false,
    mpid: "67ae831d-fe82-4b3f-b970-674d632dc281"
  }, {
    id: 'ai-tools',
    name: 'AI Tools',
    count: 0,
    icon: Zap,
    expanded: false,
    mpid: "ffacb969-aa03-45c5-9d2a-ce1d10c40988"
  }, {
    id: 'ui-design',
    name: 'UI Design',
    count: 0,
    icon: Figma,
    expanded: false,
    mpid: "8674e9de-b0cc-467c-987b-834a43aa9132"
  }, {
    id: 'ux-design',
    name: 'UX Design',
    count: 0,
    icon: Users,
    expanded: false,
    mpid: "d8503065-c57a-4b69-9732-985d917372b7"
  }, {
    id: 'design',
    name: 'Design',
    count: 0,
    icon: PenTool,
    expanded: false,
    mpid: "22fab746-6cd1-42cd-8966-b3050fd8821f"
  }, {
    id: 'figma',
    name: 'Figma',
    count: 0,
    icon: Figma,
    expanded: false,
    mpid: "83bc8290-60dc-47c7-ad19-a61ee8110b2d"
  }, {
    id: 'crypto',
    name: 'Crypto',
    count: 0,
    icon: Cpu,
    expanded: false,
    mpid: "8e55a735-5ccf-4363-8254-fff9cbff207e"
  }]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Update category counts dynamically
  const updatedCategories = categories.map(category => ({
    ...category,
    count: prompts.filter(p => p.category.toLowerCase() === category.id.replace('-', '')).length
  }));
  const updatedToolCategories = toolCategories.map(category => ({
    ...category,
    count: category.id === 'all-tools' ? tools.length : tools.filter(t => t.category.toLowerCase().replace(/\s+/g, '-') === category.id).length
  }));
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || prompt.category.toLowerCase().replace(/\s+/g, '') === activeCategory.replace('-', '');
    return matchesSearch && matchesCategory;
  });
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all-tools' || tool.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
    return matchesSearch && matchesCategory;
  });
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
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

    // Add subcategories
    const newSubcats = newProjectSubcategories.map(subcat => ({
      id: `${newCategory.id}-${subcat.toLowerCase().replace(/\s+/g, '-')}`,
      name: subcat,
      parentId: newCategory.id,
      count: 0,
      mpid: `subcat-${Date.now()}-${subcat}`
    }));
    setSubcategories(prev => [...prev, ...newSubcats]);

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
      category: activeCategory === 'all' ? 'General' : categories.find(c => c.id === activeCategory)?.name || 'General',
      createdAt: new Date(),
      mpid: `prompt-${Date.now()}`
    };
    setPrompts(prev => [newPrompt, ...prev]);

    // Reset form
    setNewPromptTitle('');
    setNewPromptContent('');
    setNewPromptModel('GPT-4');
    setNewPromptTags([]);
    setShowNewPromptDialog(false);
  };
  const handleCreateTool = () => {
    if (!newToolName.trim() || !newToolUrl.trim()) return;
    const newTool: Tool = {
      id: `tool-${Date.now()}`,
      name: newToolName,
      url: newToolUrl,
      description: newToolDescription,
      category: newToolCategory,
      mpid: `tool-${Date.now()}`
    };
    setTools(prev => [newTool, ...prev]);

    // Reset form
    setNewToolName('');
    setNewToolUrl('');
    setNewToolDescription('');
    setNewToolCategory('AI Tools');
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
                  <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide" data-magicpath-id="19" data-magicpath-path="KotoDashboard.tsx">PROJECTS</h2>
                  <button onClick={() => setShowAddProjectDialog(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" data-magicpath-id="20" data-magicpath-path="KotoDashboard.tsx">
                    <Plus className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="KotoDashboard.tsx" />
                  </button>
                </div>}
              
              <div className="space-y-1" data-magicpath-id="22" data-magicpath-path="KotoDashboard.tsx">
                {(activeTab === 'prompts' ? updatedCategories : updatedToolCategories).map(category => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                const categorySubcategories = subcategories.filter(sub => sub.parentId === category.id);
                return <div key={category.id} data-magicpath-id="23" data-magicpath-path="KotoDashboard.tsx">
                      <div className="flex items-center" data-magicpath-id="24" data-magicpath-path="KotoDashboard.tsx">
                        <button onClick={() => setActiveCategory(category.id)} className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`} data-magicpath-id="25" data-magicpath-path="KotoDashboard.tsx">
                          <Icon className="w-5 h-5 flex-shrink-0" data-magicpath-id="26" data-magicpath-path="KotoDashboard.tsx" />
                          <AnimatePresence mode="wait" data-magicpath-id="27" data-magicpath-path="KotoDashboard.tsx">
                            {!sidebarCollapsed && <motion.div initial={{
                          opacity: 0,
                          x: -10
                        }} animate={{
                          opacity: 1,
                          x: 0
                        }} exit={{
                          opacity: 0,
                          x: -10
                        }} className="flex items-center justify-between w-full" data-magicpath-id="28" data-magicpath-path="KotoDashboard.tsx">
                                <span className="font-medium text-sm" data-magicpath-id="29" data-magicpath-path="KotoDashboard.tsx">{category.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'}`} data-magicpath-id="30" data-magicpath-path="KotoDashboard.tsx">
                                  {category.count}
                                </span>
                              </motion.div>}
                          </AnimatePresence>
                        </button>
                        
                        {!sidebarCollapsed && categorySubcategories.length > 0 && <button onClick={() => toggleCategoryExpansion(category.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx">
                            {category.expanded ? <ChevronDown className="w-4 h-4 text-slate-400" data-magicpath-id="32" data-magicpath-path="KotoDashboard.tsx" /> : <ChevronRight className="w-4 h-4 text-slate-400" data-magicpath-id="33" data-magicpath-path="KotoDashboard.tsx" />}
                          </button>}
                      </div>
                      
                      {/* Subcategories */}
                      <AnimatePresence data-magicpath-id="34" data-magicpath-path="KotoDashboard.tsx">
                        {!sidebarCollapsed && category.expanded && categorySubcategories.length > 0 && <motion.div initial={{
                      opacity: 0,
                      height: 0
                    }} animate={{
                      opacity: 1,
                      height: 'auto'
                    }} exit={{
                      opacity: 0,
                      height: 0
                    }} className="ml-8 mt-1 space-y-1" data-magicpath-id="35" data-magicpath-path="KotoDashboard.tsx">
                            {categorySubcategories.map(subcategory => <button key={subcategory.id} onClick={() => setActiveCategory(subcategory.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === subcategory.id ? 'bg-slate-700 dark:bg-slate-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'}`} data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="36" data-magicpath-path="KotoDashboard.tsx">
                                <span data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="37" data-magicpath-path="KotoDashboard.tsx">{subcategory.name}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === subcategory.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'}`} data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-field="count:unknown" data-magicpath-id="38" data-magicpath-path="KotoDashboard.tsx">
                                  {subcategory.count}
                                </span>
                              </button>)}
                            
                            <button onClick={() => {
                        // Add subcategory functionality
                        const subcatName = prompt('Enter subcategory name:');
                        if (subcatName?.trim()) {
                          const newSubcat: Subcategory = {
                            id: `${category.id}-${subcatName.toLowerCase().replace(/\s+/g, '-')}`,
                            name: subcatName.trim(),
                            parentId: category.id,
                            count: 0,
                            mpid: `subcat-${Date.now()}`
                          };
                          setSubcategories(prev => [...prev, newSubcat]);
                        }
                      }} className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" data-magicpath-id="39" data-magicpath-path="KotoDashboard.tsx">
                              <Plus className="w-3 h-3" data-magicpath-id="40" data-magicpath-path="KotoDashboard.tsx" />
                              <span data-magicpath-id="41" data-magicpath-path="KotoDashboard.tsx">Add subcategory</span>
                            </button>
                          </motion.div>}
                      </AnimatePresence>
                    </div>;
              })}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="42" data-magicpath-path="KotoDashboard.tsx">
            <div className="space-y-1" data-magicpath-id="43" data-magicpath-path="KotoDashboard.tsx">
              <button onClick={() => setShowSettingsDialog(true)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="44" data-magicpath-path="KotoDashboard.tsx">
                <Settings className="w-5 h-5 flex-shrink-0" data-magicpath-id="45" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="46" data-magicpath-path="KotoDashboard.tsx">Settings</span>}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="47" data-magicpath-path="KotoDashboard.tsx">
                {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" data-magicpath-id="48" data-magicpath-path="KotoDashboard.tsx" /> : <Moon className="w-5 h-5 flex-shrink-0" data-magicpath-id="49" data-magicpath-path="KotoDashboard.tsx" />}
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="50" data-magicpath-path="KotoDashboard.tsx">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="51" data-magicpath-path="KotoDashboard.tsx">
                <HelpCircle className="w-5 h-5 flex-shrink-0" data-magicpath-id="52" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="53" data-magicpath-path="KotoDashboard.tsx">Help</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" data-magicpath-id="54" data-magicpath-path="KotoDashboard.tsx">
        {/* Content Area */}
        <main className="flex-1 overflow-auto" data-magicpath-id="55" data-magicpath-path="KotoDashboard.tsx">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden" style={{
          backgroundImage: backgroundImage || `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} data-magicpath-id="56" data-magicpath-path="KotoDashboard.tsx">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50" data-magicpath-id="57" data-magicpath-path="KotoDashboard.tsx"></div>
            
            {/* Profile Menu */}
            <div className="absolute top-6 right-6" data-magicpath-id="58" data-magicpath-path="KotoDashboard.tsx">
              <div className="relative" data-magicpath-id="59" data-magicpath-path="KotoDashboard.tsx">
                <motion.button onClick={() => setShowProfileMenu(!showProfileMenu)} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex items-center space-x-3 p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-colors" data-magicpath-id="60" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center" data-magicpath-id="61" data-magicpath-path="KotoDashboard.tsx">
                    <User className="w-5 h-5 text-white" data-magicpath-id="62" data-magicpath-path="KotoDashboard.tsx" />
                  </div>
                  <div className="text-left text-white" data-magicpath-id="63" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-sm font-medium" data-magicpath-id="64" data-magicpath-path="KotoDashboard.tsx">John Doe</div>
                    <div className="text-xs text-white/80" data-magicpath-id="65" data-magicpath-path="KotoDashboard.tsx">john@example.com</div>
                  </div>
                </motion.button>

                <AnimatePresence data-magicpath-id="66" data-magicpath-path="KotoDashboard.tsx">
                  {showProfileMenu && <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: 10
                }} className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2" data-magicpath-id="67" data-magicpath-path="KotoDashboard.tsx">
                      <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="68" data-magicpath-path="KotoDashboard.tsx">
                        <User className="w-4 h-4" data-magicpath-id="69" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="70" data-magicpath-path="KotoDashboard.tsx">Profile</span>
                      </button>
                      <button onClick={() => setShowSettingsDialog(true)} className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="71" data-magicpath-path="KotoDashboard.tsx">
                        <Settings className="w-4 h-4" data-magicpath-id="72" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="73" data-magicpath-path="KotoDashboard.tsx">Settings</span>
                      </button>
                      <hr className="my-2 border-slate-200 dark:border-slate-700" data-magicpath-id="74" data-magicpath-path="KotoDashboard.tsx" />
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2" data-magicpath-id="75" data-magicpath-path="KotoDashboard.tsx">
                        <span data-magicpath-id="76" data-magicpath-path="KotoDashboard.tsx">Sign Out</span>
                      </button>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative h-full flex items-center justify-center" data-magicpath-id="77" data-magicpath-path="KotoDashboard.tsx">
              <div className="text-center text-white flex flex-col items-center justify-center w-full max-w-4xl px-8" style={{
              display: "flex",
              width: "96%",
              maxWidth: "96%"
            }} data-magicpath-id="78" data-magicpath-path="KotoDashboard.tsx">
                {/* First Row - Centered Tabs */}
                <div className="mb-8" data-magicpath-id="79" data-magicpath-path="KotoDashboard.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex" style={{
                  display: "flex",
                  alignItems: "center"
                }} data-magicpath-id="80" data-magicpath-path="KotoDashboard.tsx">
                    <div className="flex space-x-1" style={{
                    alignItems: "center"
                  }} data-magicpath-id="81" data-magicpath-path="KotoDashboard.tsx">
                      <button onClick={() => setActiveTab('prompts')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="82" data-magicpath-path="KotoDashboard.tsx">
                        <MessageSquare className="w-4 h-4" data-magicpath-id="83" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="84" data-magicpath-path="KotoDashboard.tsx">Prompts</span>
                      </button>
                      <button onClick={() => setActiveTab('toolbox')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'toolbox' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="85" data-magicpath-path="KotoDashboard.tsx">
                        <Wrench className="w-4 h-4" data-magicpath-id="86" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="87" data-magicpath-path="KotoDashboard.tsx">Tool Box</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Row - Title and Actions */}
                <div className="flex items-center justify-between w-full max-w-3xl" style={{
                alignItems: "end",
                width: "100%",
                maxWidth: "100%"
              }} data-magicpath-id="88" data-magicpath-path="KotoDashboard.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  paddingTop: "16px",
                  paddingBottom: "16px"
                }} data-magicpath-id="89" data-magicpath-path="KotoDashboard.tsx">
                    <div className="flex items-center space-x-3 mb-2" data-magicpath-id="90" data-magicpath-path="KotoDashboard.tsx">
                      <Palette className="w-6 h-6" data-magicpath-id="91" data-magicpath-path="KotoDashboard.tsx" />
                      <h1 className="text-2xl font-bold" data-magicpath-id="92" data-magicpath-path="KotoDashboard.tsx">
                        {activeTab === 'prompts' ? 'Midjourney Prompts' : 'A.I Tools'}
                      </h1>
                    </div>
                    <p className="text-white/80" data-magicpath-id="93" data-magicpath-path="KotoDashboard.tsx">
                      {activeTab === 'prompts' ? `${filteredPrompts.length} prompts available` : `${filteredTools.length} tools saved`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4" data-magicpath-id="94" data-magicpath-path="KotoDashboard.tsx">
                    <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg transition-colors" data-magicpath-id="95" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="96" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="97" data-magicpath-path="KotoDashboard.tsx">{activeTab === 'prompts' ? 'Add Prompt' : 'Add Tool'}</span>
                    </motion.button>
                    
                    <motion.button onClick={() => setShowAddProjectDialog(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 backdrop-blur-sm transition-colors" data-magicpath-id="98" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="99" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="100" data-magicpath-path="KotoDashboard.tsx">Add Project</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6" data-magicpath-id="101" data-magicpath-path="KotoDashboard.tsx">
            <div className="max-w-7xl mx-auto" data-magicpath-id="102" data-magicpath-path="KotoDashboard.tsx">
              {activeTab === 'prompts' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="103" data-magicpath-path="KotoDashboard.tsx">
                  {filteredPrompts.map(prompt => <motion.div key={prompt.id} layout initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} whileHover={{
                y: -4
              }} onClick={() => handlePromptClick(prompt)} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="104" data-magicpath-path="KotoDashboard.tsx">
                      {/* Cover Image */}
                      <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="105" data-magicpath-path="KotoDashboard.tsx">
                        {prompt.coverImage ? <img src={prompt.coverImage} alt={prompt.title} className="w-full h-full object-cover" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="coverImage:unknown" data-magicpath-id="106" data-magicpath-path="KotoDashboard.tsx" /> : <div className="flex items-center justify-center h-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="107" data-magicpath-path="KotoDashboard.tsx">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="108" data-magicpath-path="KotoDashboard.tsx">
                              <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="109" data-magicpath-path="KotoDashboard.tsx" />
                            </div>
                          </div>}
                        
                        {/* Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="110" data-magicpath-path="KotoDashboard.tsx">
                          <div className="flex space-x-2" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="111" data-magicpath-path="KotoDashboard.tsx">
                            <button onClick={e => {
                        e.stopPropagation();
                        // Handle share
                      }} className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="112" data-magicpath-path="KotoDashboard.tsx">
                              <Share2 className="w-4 h-4 text-slate-600" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="113" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                            <button onClick={e => {
                        e.stopPropagation();
                        // Handle delete
                      }} className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="114" data-magicpath-path="KotoDashboard.tsx">
                              <Trash2 className="w-4 h-4 text-red-500" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="115" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="116" data-magicpath-path="KotoDashboard.tsx">
                        <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="117" data-magicpath-path="KotoDashboard.tsx">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="118" data-magicpath-path="KotoDashboard.tsx">
                            {prompt.title}
                          </h3>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="content:unknown" data-magicpath-id="119" data-magicpath-path="KotoDashboard.tsx">
                          {prompt.content}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="120" data-magicpath-path="KotoDashboard.tsx">
                          {prompt.tags.slice(0, 3).map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="121" data-magicpath-path="KotoDashboard.tsx">
                              {tag}
                            </span>)}
                          {prompt.tags.length > 3 && <span className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="122" data-magicpath-path="KotoDashboard.tsx">
                              +{prompt.tags.length - 3}
                            </span>}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="123" data-magicpath-path="KotoDashboard.tsx">
                          <span className="text-xs text-slate-500 dark:text-slate-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="124" data-magicpath-path="KotoDashboard.tsx">
                            {prompt.category}
                          </span>
                          <button onClick={e => {
                      e.stopPropagation();
                      // Handle copy
                    }} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="125" data-magicpath-path="KotoDashboard.tsx">
                            <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="126" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </div>
                      </div>
                    </motion.div>)}
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="127" data-magicpath-path="KotoDashboard.tsx">
                  {filteredTools.map(tool => <motion.div key={tool.id} layout initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} whileHover={{
                y: -4
              }} onClick={() => handleToolClick(tool)} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="128" data-magicpath-path="KotoDashboard.tsx">
                      {/* Tool Icon */}
                      <div className="relative h-32 bg-indigo-600 flex items-center justify-center" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="129" data-magicpath-path="KotoDashboard.tsx">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="130" data-magicpath-path="KotoDashboard.tsx">
                          <MessageSquare className="w-8 h-8 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="131" data-magicpath-path="KotoDashboard.tsx" />
                        </div>
                        
                        {/* Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="132" data-magicpath-path="KotoDashboard.tsx">
                          <div className="flex space-x-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="133" data-magicpath-path="KotoDashboard.tsx">
                            <button onClick={e => {
                        e.stopPropagation();
                        window.open(tool.url, '_blank');
                      }} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="134" data-magicpath-path="KotoDashboard.tsx">
                              <ExternalLink className="w-4 h-4 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="135" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                            <button onClick={e => {
                        e.stopPropagation();
                        // Handle delete
                      }} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="136" data-magicpath-path="KotoDashboard.tsx">
                              <Trash2 className="w-4 h-4 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="137" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="138" data-magicpath-path="KotoDashboard.tsx">
                        <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="139" data-magicpath-path="KotoDashboard.tsx">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="140" data-magicpath-path="KotoDashboard.tsx">
                            {tool.name}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="141" data-magicpath-path="KotoDashboard.tsx">
                            GPT-4
                          </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="142" data-magicpath-path="KotoDashboard.tsx">
                          {tool.description || 'Help me write engaging stories with vivid descriptions and compelling characters.'}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="143" data-magicpath-path="KotoDashboard.tsx">
                          <span className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="144" data-magicpath-path="KotoDashboard.tsx">
                            AI Tools
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="145" data-magicpath-path="KotoDashboard.tsx">
                            LLM's
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="146" data-magicpath-path="KotoDashboard.tsx">
                          <span className="text-xs text-slate-500 dark:text-slate-400" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="147" data-magicpath-path="KotoDashboard.tsx">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>)}
                </div>}

              {/* Empty State */}
              {(activeTab === 'prompts' && filteredPrompts.length === 0 || activeTab === 'toolbox' && filteredTools.length === 0) && <div className="text-center py-12" data-magicpath-id="148" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4" data-magicpath-id="149" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'prompts' ? <MessageSquare className="w-8 h-8 text-slate-400" data-magicpath-id="150" data-magicpath-path="KotoDashboard.tsx" /> : <Wrench className="w-8 h-8 text-slate-400" data-magicpath-id="151" data-magicpath-path="KotoDashboard.tsx" />}
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2" data-magicpath-id="152" data-magicpath-path="KotoDashboard.tsx">
                    No {activeTab === 'prompts' ? 'prompts' : 'tools'} found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6" data-magicpath-id="153" data-magicpath-path="KotoDashboard.tsx">
                    Try adjusting your search or create a new {activeTab === 'prompts' ? 'prompt' : 'tool'}
                  </p>
                  <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto transition-colors" data-magicpath-id="154" data-magicpath-path="KotoDashboard.tsx">
                    <Plus className="w-4 h-4" data-magicpath-id="155" data-magicpath-path="KotoDashboard.tsx" />
                    <span data-magicpath-id="156" data-magicpath-path="KotoDashboard.tsx">Add {activeTab === 'prompts' ? 'Prompt' : 'Tool'}</span>
                  </motion.button>
                </div>}
            </div>
          </div>
        </main>
      </div>

      {/* Add Project Dialog */}
      <AnimatePresence data-magicpath-id="157" data-magicpath-path="KotoDashboard.tsx">
        {showAddProjectDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowAddProjectDialog(false)} data-magicpath-id="158" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="159" data-magicpath-path="KotoDashboard.tsx">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="160" data-magicpath-path="KotoDashboard.tsx">Add New Project</h1>
              
              <div className="space-y-6" data-magicpath-id="161" data-magicpath-path="KotoDashboard.tsx">
                {/* Project Name */}
                <div data-magicpath-id="162" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="163" data-magicpath-path="KotoDashboard.tsx">
                    Project Name
                  </label>
                  <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Enter project name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="164" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Project Icon */}
                <div data-magicpath-id="165" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="166" data-magicpath-path="KotoDashboard.tsx">
                    Project Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto" data-magicpath-id="167" data-magicpath-path="KotoDashboard.tsx">
                    {iconOptions.map(option => {
                  const IconComponent = option.icon;
                  return <button key={option.name} onClick={() => setSelectedIcon(option)} className={`p-2 rounded-lg border-2 transition-colors ${selectedIcon.name === option.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-uuid={(option as any)["mpid"] ?? "unsafe"} data-magicpath-id="168" data-magicpath-path="KotoDashboard.tsx">
                          <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-uuid={(option as any)["mpid"] ?? "unsafe"} data-magicpath-id="169" data-magicpath-path="KotoDashboard.tsx" />
                        </button>;
                })}
                  </div>
                </div>

                {/* Add Tags */}
                <div data-magicpath-id="170" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="171" data-magicpath-path="KotoDashboard.tsx">
                    Add Tags
                  </label>
                  <div className="flex space-x-2 mb-2" data-magicpath-id="172" data-magicpath-path="KotoDashboard.tsx">
                    <input type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddTag()} placeholder="Enter tag" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="173" data-magicpath-path="KotoDashboard.tsx" />
                    <button onClick={handleAddTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="174" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="175" data-magicpath-path="KotoDashboard.tsx" />
                    </button>
                  </div>
                  
                  {/* Tags Display */}
                  {newProjectTags.length > 0 && <div className="flex flex-wrap gap-1.5" data-magicpath-id="176" data-magicpath-path="KotoDashboard.tsx">
                      {newProjectTags.map(tag => <span key={tag} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="177" data-magicpath-path="KotoDashboard.tsx">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="178" data-magicpath-path="KotoDashboard.tsx">
                            <X className="w-3 h-3" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="179" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </span>)}
                    </div>}
                </div>

                {/* Add Subcategories */}
                <div data-magicpath-id="180" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="181" data-magicpath-path="KotoDashboard.tsx">
                    Add Subcategories
                  </label>
                  <div className="flex space-x-2 mb-2" data-magicpath-id="182" data-magicpath-path="KotoDashboard.tsx">
                    <input type="text" value={newSubcategoryInput} onChange={e => setNewSubcategoryInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddSubcategory()} placeholder="Enter subcategory" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="183" data-magicpath-path="KotoDashboard.tsx" />
                    <button onClick={handleAddSubcategory} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="184" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="185" data-magicpath-path="KotoDashboard.tsx" />
                    </button>
                  </div>
                  
                  {/* Subcategories Display */}
                  {newProjectSubcategories.length > 0 && <div className="flex flex-wrap gap-1.5" data-magicpath-id="186" data-magicpath-path="KotoDashboard.tsx">
                      {newProjectSubcategories.map(subcat => <span key={subcat} className="inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full" data-magicpath-uuid={(subcat as any)["mpid"] ?? "unsafe"} data-magicpath-id="187" data-magicpath-path="KotoDashboard.tsx">
                          {subcat}
                          <button onClick={() => removeSubcategory(subcat)} className="ml-1 hover:text-green-900 dark:hover:text-green-100" data-magicpath-uuid={(subcat as any)["mpid"] ?? "unsafe"} data-magicpath-id="188" data-magicpath-path="KotoDashboard.tsx">
                            <X className="w-3 h-3" data-magicpath-uuid={(subcat as any)["mpid"] ?? "unsafe"} data-magicpath-id="189" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </span>)}
                    </div>}
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="190" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowAddProjectDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="191" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleAddProject} disabled={!newProjectName.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="192" data-magicpath-path="KotoDashboard.tsx">
                    Add Project
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Prompt Dialog */}
      <AnimatePresence data-magicpath-id="193" data-magicpath-path="KotoDashboard.tsx">
        {showNewPromptDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewPromptDialog(false)} data-magicpath-id="194" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="195" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="196" data-magicpath-path="KotoDashboard.tsx">Add New Prompt</h2>
              
              <div className="space-y-6" data-magicpath-id="197" data-magicpath-path="KotoDashboard.tsx">
                {/* Title */}
                <div data-magicpath-id="198" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="199" data-magicpath-path="KotoDashboard.tsx">
                    Title
                  </label>
                  <input type="text" value={newPromptTitle} onChange={e => setNewPromptTitle(e.target.value)} placeholder="Enter prompt title" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="200" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Content */}
                <div data-magicpath-id="201" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="202" data-magicpath-path="KotoDashboard.tsx">
                    Content
                  </label>
                  <textarea value={newPromptContent} onChange={e => setNewPromptContent(e.target.value)} placeholder="Enter prompt content" rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="203" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Model */}
                <div data-magicpath-id="204" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="205" data-magicpath-path="KotoDashboard.tsx">
                    Model
                  </label>
                  <select value={newPromptModel} onChange={e => setNewPromptModel(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="206" data-magicpath-path="KotoDashboard.tsx">
                    <option value="GPT-4" data-magicpath-id="207" data-magicpath-path="KotoDashboard.tsx">GPT-4</option>
                    <option value="Claude" data-magicpath-id="208" data-magicpath-path="KotoDashboard.tsx">Claude</option>
                    <option value="Midjourney" data-magicpath-id="209" data-magicpath-path="KotoDashboard.tsx">Midjourney</option>
                    <option value="DALL-E" data-magicpath-id="210" data-magicpath-path="KotoDashboard.tsx">DALL-E</option>
                  </select>
                </div>

                {/* Tags */}
                <div data-magicpath-id="211" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="212" data-magicpath-path="KotoDashboard.tsx">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2" data-magicpath-id="213" data-magicpath-path="KotoDashboard.tsx">
                    <input type="text" value={newPromptTagInput} onChange={e => setNewPromptTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddPromptTag()} placeholder="Enter tag" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="214" data-magicpath-path="KotoDashboard.tsx" />
                    <button onClick={handleAddPromptTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="215" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="216" data-magicpath-path="KotoDashboard.tsx" />
                    </button>
                  </div>
                  
                  {/* Tags Display */}
                  {newPromptTags.length > 0 && <div className="flex flex-wrap gap-1.5" data-magicpath-id="217" data-magicpath-path="KotoDashboard.tsx">
                      {newPromptTags.map(tag => <span key={tag} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="218" data-magicpath-path="KotoDashboard.tsx">
                          {tag}
                          <button onClick={() => removePromptTag(tag)} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="219" data-magicpath-path="KotoDashboard.tsx">
                            <X className="w-3 h-3" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="220" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </span>)}
                    </div>}
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="221" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowNewPromptDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="222" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleCreatePrompt} disabled={!newPromptTitle.trim() || !newPromptContent.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="223" data-magicpath-path="KotoDashboard.tsx">
                    Create Prompt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Tool Dialog */}
      <AnimatePresence data-magicpath-id="224" data-magicpath-path="KotoDashboard.tsx">
        {showNewToolDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewToolDialog(false)} data-magicpath-id="225" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="226" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="227" data-magicpath-path="KotoDashboard.tsx">Add New Tool</h2>
              
              <div className="space-y-6" data-magicpath-id="228" data-magicpath-path="KotoDashboard.tsx">
                {/* Name */}
                <div data-magicpath-id="229" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="230" data-magicpath-path="KotoDashboard.tsx">
                    Tool Name
                  </label>
                  <input type="text" value={newToolName} onChange={e => setNewToolName(e.target.value)} placeholder="Enter tool name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="231" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* URL */}
                <div data-magicpath-id="232" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="233" data-magicpath-path="KotoDashboard.tsx">
                    URL
                  </label>
                  <input type="url" value={newToolUrl} onChange={e => setNewToolUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="234" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Description */}
                <div data-magicpath-id="235" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="236" data-magicpath-path="KotoDashboard.tsx">
                    Description
                  </label>
                  <textarea value={newToolDescription} onChange={e => setNewToolDescription(e.target.value)} placeholder="Enter tool description" rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="237" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Category */}
                <div data-magicpath-id="238" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="239" data-magicpath-path="KotoDashboard.tsx">
                    Category
                  </label>
                  <select value={newToolCategory} onChange={e => setNewToolCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="240" data-magicpath-path="KotoDashboard.tsx">
                    <option value="AI Tools" data-magicpath-id="241" data-magicpath-path="KotoDashboard.tsx">AI Tools</option>
                    <option value="UI Design" data-magicpath-id="242" data-magicpath-path="KotoDashboard.tsx">UI Design</option>
                    <option value="UX Design" data-magicpath-id="243" data-magicpath-path="KotoDashboard.tsx">UX Design</option>
                    <option value="Design" data-magicpath-id="244" data-magicpath-path="KotoDashboard.tsx">Design</option>
                    <option value="Figma" data-magicpath-id="245" data-magicpath-path="KotoDashboard.tsx">Figma</option>
                    <option value="Crypto" data-magicpath-id="246" data-magicpath-path="KotoDashboard.tsx">Crypto</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="247" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowNewToolDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="248" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleCreateTool} disabled={!newToolName.trim() || !newToolUrl.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="249" data-magicpath-path="KotoDashboard.tsx">
                    Create Tool
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Prompt Details Dialog */}
      <AnimatePresence data-magicpath-id="250" data-magicpath-path="KotoDashboard.tsx">
        {showPromptDetailsDialog && selectedPrompt && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowPromptDetailsDialog(false)} data-magicpath-id="251" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="252" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="253" data-magicpath-path="KotoDashboard.tsx">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-magicpath-id="254" data-magicpath-path="KotoDashboard.tsx">{selectedPrompt.title}</h2>
                <button onClick={() => setShowPromptDetailsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="255" data-magicpath-path="KotoDashboard.tsx">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="256" data-magicpath-path="KotoDashboard.tsx" />
                </button>
              </div>

              {selectedPrompt.coverImage && <div className="mb-6" data-magicpath-id="257" data-magicpath-path="KotoDashboard.tsx">
                  <img src={selectedPrompt.coverImage} alt={selectedPrompt.title} className="w-full h-48 object-cover rounded-lg" data-magicpath-id="258" data-magicpath-path="KotoDashboard.tsx" />
                </div>}

              <div className="space-y-4" data-magicpath-id="259" data-magicpath-path="KotoDashboard.tsx">
                <div data-magicpath-id="260" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="261" data-magicpath-path="KotoDashboard.tsx">Content</h3>
                  <p className="text-slate-700 dark:text-slate-300" data-magicpath-id="262" data-magicpath-path="KotoDashboard.tsx">{selectedPrompt.content}</p>
                </div>

                <div data-magicpath-id="263" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="264" data-magicpath-path="KotoDashboard.tsx">Model</h3>
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full" data-magicpath-id="265" data-magicpath-path="KotoDashboard.tsx">
                    {selectedPrompt.model}
                  </span>
                </div>

                <div data-magicpath-id="266" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="267" data-magicpath-path="KotoDashboard.tsx">Tags</h3>
                  <div className="flex flex-wrap gap-2" data-magicpath-id="268" data-magicpath-path="KotoDashboard.tsx">
                    {selectedPrompt.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full" data-magicpath-id="269" data-magicpath-path="KotoDashboard.tsx">
                        {tag}
                      </span>)}
                  </div>
                </div>

                <div data-magicpath-id="270" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="271" data-magicpath-path="KotoDashboard.tsx">Created</h3>
                  <p className="text-slate-700 dark:text-slate-300" data-magicpath-id="272" data-magicpath-path="KotoDashboard.tsx">{selectedPrompt.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="273" data-magicpath-path="KotoDashboard.tsx">
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center space-x-2" data-magicpath-id="274" data-magicpath-path="KotoDashboard.tsx">
                  <Copy className="w-4 h-4" data-magicpath-id="275" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="276" data-magicpath-path="KotoDashboard.tsx">Copy</span>
                </button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2" data-magicpath-id="277" data-magicpath-path="KotoDashboard.tsx">
                  <Share2 className="w-4 h-4" data-magicpath-id="278" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="279" data-magicpath-path="KotoDashboard.tsx">Share</span>
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Tool Details Dialog */}
      <AnimatePresence data-magicpath-id="280" data-magicpath-path="KotoDashboard.tsx">
        {showToolDetailsDialog && selectedTool && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowToolDetailsDialog(false)} data-magicpath-id="281" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="282" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="283" data-magicpath-path="KotoDashboard.tsx">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-magicpath-id="284" data-magicpath-path="KotoDashboard.tsx">{selectedTool.name}</h2>
                <button onClick={() => setShowToolDetailsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="285" data-magicpath-path="KotoDashboard.tsx">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="286" data-magicpath-path="KotoDashboard.tsx" />
                </button>
              </div>

              <div className="space-y-4" data-magicpath-id="287" data-magicpath-path="KotoDashboard.tsx">
                <div data-magicpath-id="288" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="289" data-magicpath-path="KotoDashboard.tsx">Description</h3>
                  <p className="text-slate-700 dark:text-slate-300" data-magicpath-id="290" data-magicpath-path="KotoDashboard.tsx">{selectedTool.description || 'No description available.'}</p>
                </div>

                <div data-magicpath-id="291" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="292" data-magicpath-path="KotoDashboard.tsx">Category</h3>
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full" data-magicpath-id="293" data-magicpath-path="KotoDashboard.tsx">
                    {selectedTool.category}
                  </span>
                </div>

                <div data-magicpath-id="294" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="295" data-magicpath-path="KotoDashboard.tsx">URL</h3>
                  <a href={selectedTool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline break-all">
                    {selectedTool.url}
                  </a>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="296" data-magicpath-path="KotoDashboard.tsx">
                <button onClick={() => window.open(selectedTool.url, '_blank')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2" data-magicpath-id="297" data-magicpath-path="KotoDashboard.tsx">
                  <ExternalLink className="w-4 h-4" data-magicpath-id="298" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="299" data-magicpath-path="KotoDashboard.tsx">Open Tool</span>
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Settings Dialog */}
      <AnimatePresence data-magicpath-id="300" data-magicpath-path="KotoDashboard.tsx">
        {showSettingsDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowSettingsDialog(false)} data-magicpath-id="301" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="302" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="303" data-magicpath-path="KotoDashboard.tsx">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-magicpath-id="304" data-magicpath-path="KotoDashboard.tsx">Settings</h2>
                <button onClick={() => setShowSettingsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="305" data-magicpath-path="KotoDashboard.tsx">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="306" data-magicpath-path="KotoDashboard.tsx" />
                </button>
              </div>

              <div className="space-y-6" data-magicpath-id="307" data-magicpath-path="KotoDashboard.tsx">
                {/* Default Theme */}
                <div data-magicpath-id="308" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="309" data-magicpath-path="KotoDashboard.tsx">
                    Default Theme
                  </label>
                  <div className="flex space-x-3" data-magicpath-id="310" data-magicpath-path="KotoDashboard.tsx">
                    <button onClick={() => {
                  setDefaultTheme('light');
                  setDarkMode(false);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-id="311" data-magicpath-path="KotoDashboard.tsx">
                      <Sun className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" data-magicpath-id="312" data-magicpath-path="KotoDashboard.tsx" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300" data-magicpath-id="313" data-magicpath-path="KotoDashboard.tsx">Light</div>
                    </button>
                    <button onClick={() => {
                  setDefaultTheme('dark');
                  setDarkMode(true);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-id="314" data-magicpath-path="KotoDashboard.tsx">
                      <Moon className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" data-magicpath-id="315" data-magicpath-path="KotoDashboard.tsx" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300" data-magicpath-id="316" data-magicpath-path="KotoDashboard.tsx">Dark</div>
                    </button>
                  </div>
                </div>

                {/* Background Photo */}
                <div data-magicpath-id="317" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="318" data-magicpath-path="KotoDashboard.tsx">
                    Change Background Photo
                  </label>
                  <div className="space-y-3" data-magicpath-id="319" data-magicpath-path="KotoDashboard.tsx">
                    <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" id="background-upload" data-magicpath-id="320" data-magicpath-path="KotoDashboard.tsx" />
                    <label htmlFor="background-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors" data-magicpath-id="321" data-magicpath-path="KotoDashboard.tsx">
                      <div className="text-center" data-magicpath-id="322" data-magicpath-path="KotoDashboard.tsx">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" data-magicpath-id="323" data-magicpath-path="KotoDashboard.tsx" />
                        <div className="text-sm text-slate-600 dark:text-slate-400" data-magicpath-id="324" data-magicpath-path="KotoDashboard.tsx">
                          Click to upload photo
                        </div>
                      </div>
                    </label>
                    
                    {backgroundImage && <div className="relative" data-magicpath-id="325" data-magicpath-path="KotoDashboard.tsx">
                        <img src={backgroundImage} alt="Background preview" className="w-full h-20 object-cover rounded-lg" data-magicpath-id="326" data-magicpath-path="KotoDashboard.tsx" />
                        <button onClick={() => setBackgroundImage('')} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors" data-magicpath-id="327" data-magicpath-path="KotoDashboard.tsx">
                          <X className="w-3 h-3" data-magicpath-id="328" data-magicpath-path="KotoDashboard.tsx" />
                        </button>
                      </div>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="329" data-magicpath-path="KotoDashboard.tsx">
                <button onClick={() => setShowSettingsDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="330" data-magicpath-path="KotoDashboard.tsx">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;