"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus, MessageSquare, Wrench, ChevronLeft, Menu, Bell, User, Settings, HelpCircle, Sun, Moon, ExternalLink, Share2, Trash2, Copy, Palette, Code, Briefcase, PenTool, Target, Users, BarChart3, Zap, Globe, Figma, Cpu, Tag, X, Upload, Camera, Smile, Heart, Star, Zap as ZapIcon, Coffee, Music, Book, Gamepad2, Laptop, Smartphone, Headphones, Car, Home, Plane, Gift, ShoppingBag, CreditCard, Mail, Phone, MapPin, Calendar, Clock, Eye, EyeOff, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';
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
  mpid: "0db7ce09-9a75-4b34-a1e9-d9a94233d049"
}, {
  name: 'Heart',
  icon: Heart,
  mpid: "c76d4e55-0c1a-4249-86e0-5878a5ca6fb0"
}, {
  name: 'Star',
  icon: Star,
  mpid: "29453d6d-47dc-44fc-80ea-9806ec927d1c"
}, {
  name: 'Zap',
  icon: ZapIcon,
  mpid: "77874de9-45f0-4218-a0b6-0113c9ef7309"
}, {
  name: 'Coffee',
  icon: Coffee,
  mpid: "8135c3dd-b32a-4c9a-bbf8-e8a6a0cee568"
}, {
  name: 'Music',
  icon: Music,
  mpid: "b9a7c4ca-9288-4d92-88cc-ccc370509eba"
}, {
  name: 'Book',
  icon: Book,
  mpid: "4a3214ee-b22a-4f30-85f7-7e6b57802458"
}, {
  name: 'Gamepad',
  icon: Gamepad2,
  mpid: "267cce7a-335f-4e14-ba13-1d63900db5ba"
}, {
  name: 'Laptop',
  icon: Laptop,
  mpid: "f2f84585-2764-4d89-a5db-fbca30ade32e"
}, {
  name: 'Smartphone',
  icon: Smartphone,
  mpid: "68432f3d-0611-48f7-9690-b91b514e9333"
}, {
  name: 'Headphones',
  icon: Headphones,
  mpid: "2b512430-3f31-4610-8f8b-e79b02ba9388"
}, {
  name: 'Car',
  icon: Car,
  mpid: "2218f2de-b29d-4f80-9c59-ad8bf8ca53a7"
}, {
  name: 'Home',
  icon: Home,
  mpid: "689ad148-e744-42f0-bca6-e95897a0aeeb"
}, {
  name: 'Plane',
  icon: Plane,
  mpid: "5d29b4be-4f5f-4b32-b6e5-7476184c0e88"
}, {
  name: 'Gift',
  icon: Gift,
  mpid: "90cf3f97-31df-49ad-943a-3367bd97ce4d"
}, {
  name: 'Shopping',
  icon: ShoppingBag,
  mpid: "00cf0237-a980-41fb-a40e-31842d02dc19"
}, {
  name: 'Card',
  icon: CreditCard,
  mpid: "2ce41cb8-0e5d-4954-b727-c5a91ed94afe"
}, {
  name: 'Mail',
  icon: Mail,
  mpid: "8131130a-0c96-4a92-8876-35edda483ea8"
}, {
  name: 'Phone',
  icon: Phone,
  mpid: "61828f11-d6b5-4022-97dc-4d769ec3134d"
}, {
  name: 'Map',
  icon: MapPin,
  mpid: "e4e52ce1-f229-459f-93f9-5478ec4c69a2"
}, {
  name: 'Calendar',
  icon: Calendar,
  mpid: "7fb448b7-1172-40b6-875d-3aa3e7357245"
}, {
  name: 'Clock',
  icon: Clock,
  mpid: "9b395a99-61eb-4f42-8d99-9385285c84f3"
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
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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
    mpid: "902ad4cc-9915-4035-a9c8-5c56287bb735"
  }, {
    id: '2',
    title: 'Man and Leopard',
    content: 'A man dressed in a tailored blazer and fitted jeans strides confidently with a striking spotted leopard companion through the bustling streets.',
    tags: ['sref', 'fashion', 'luxury', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-14'),
    mpid: "22e4973c-f3f0-4746-bae4-d64742494e3f"
  }, {
    id: '3',
    title: 'Girl and Owl',
    content: 'A young girl in a floral dress and cowboy boots stands in a whimsical forest clearing, holding hands with a majestic owl.',
    tags: ['sref', 'whimsy', 'nature', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-13'),
    mpid: "93e8f8b8-e312-4080-876f-7d27282f3e3d"
  }, {
    id: '4',
    title: 'Boy and Falcon',
    content: 'A boy in a leather jacket and aviator sunglasses stands on a rocky cliff, proudly displaying a magnificent falcon perched on his arm.',
    tags: ['sref', 'adventure', 'wildlife', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-12'),
    mpid: "3c3a7c5b-40f7-4630-a05d-b4a3f5456cd6"
  }, {
    id: '5',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-11'),
    mpid: "ba752233-1de9-432e-9337-f279c5f25e16"
  }, {
    id: '6',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-10'),
    mpid: "b979de2a-ad50-4b54-82c5-356bc45e2c12"
  }, {
    id: '7',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-09'),
    mpid: "b3aa1947-820b-499c-9607-d8a743a2f509"
  }, {
    id: '8',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-08'),
    mpid: "d541ff0a-c511-4f54-abd7-a04e26d7a428"
  }]);
  const [tools, setTools] = useState<Tool[]>([{
    id: '1',
    name: 'Chat-GPT',
    category: 'AI Tools',
    url: 'https://chat.openai.com',
    description: 'Advanced AI language model for conversations, writing, and problem-solving.',
    mpid: "b5099008-80e3-4885-b73b-957e57477783"
  }, {
    id: '2',
    name: 'Claude',
    category: 'AI Tools',
    url: 'https://claude.ai',
    description: 'AI assistant by Anthropic for helpful, harmless, and honest conversations.',
    mpid: "07e2d881-9e87-4b1c-a2da-84f9c9b64bf4"
  }, {
    id: '3',
    name: 'DeepSeek',
    category: 'AI Tools',
    url: 'https://deepseek.com',
    description: 'Advanced AI model for coding, reasoning, and complex problem-solving.',
    mpid: "399a2036-a194-4c64-81c5-325a322bbe27"
  }, {
    id: '4',
    name: 'Grok',
    category: 'AI Tools',
    url: 'https://grok.x.ai',
    description: 'AI assistant with real-time information and witty personality.',
    mpid: "705dd774-068b-497d-8966-1445bd060bce"
  }]);
  const [categories, setCategories] = useState<Category[]>([{
    id: 'midjourney',
    name: 'Midjourney',
    count: 0,
    icon: Palette,
    expanded: false,
    mpid: "5dffaac2-bcae-48bf-873c-e3686232ca81"
  }, {
    id: 'chat-gpt',
    name: 'Chat-GPT',
    count: 0,
    icon: MessageSquare,
    expanded: false,
    mpid: "7b08fad8-9b7c-4bf3-b79e-f1ce0ea67717"
  }, {
    id: 'development',
    name: 'Development',
    count: 0,
    icon: Code,
    expanded: false,
    mpid: "b761915c-46fa-4172-8aa6-0713e9f1a1ec"
  }, {
    id: 'design',
    name: 'Design',
    count: 0,
    icon: PenTool,
    expanded: false,
    mpid: "8a185906-1403-4bbe-bfb1-7cd233984b36"
  }, {
    id: 'business',
    name: 'Business',
    count: 0,
    icon: Briefcase,
    expanded: false,
    mpid: "81f839c0-b5e3-4f2d-8bc3-895ce1b44a8a"
  }, {
    id: 'marketing',
    name: 'Marketing',
    count: 0,
    icon: Target,
    expanded: false,
    mpid: "45d98bba-4493-4509-9166-ce106753781c"
  }, {
    id: 'sales',
    name: 'Sales',
    count: 0,
    icon: BarChart3,
    expanded: false,
    mpid: "ad66c883-21ac-451b-97e4-e07ae08da7cc"
  }, {
    id: 'customer-support',
    name: 'Customer Support',
    count: 0,
    icon: Users,
    expanded: false,
    mpid: "de6b84a1-f55a-4caf-9d2e-3720cdcfcd45"
  }, {
    id: 'research',
    name: 'Research',
    count: 0,
    icon: Search,
    expanded: false,
    mpid: "1e216f26-c646-4901-8357-31bd905df491"
  }, {
    id: 'writing',
    name: 'Writing',
    count: 0,
    icon: PenTool,
    expanded: false,
    mpid: "cfe9ad8d-f1f0-4582-9269-105b3b87e4b2"
  }]);
  const [toolCategories, setToolCategories] = useState<Category[]>([{
    id: 'all-tools',
    name: 'All Tools',
    count: 0,
    icon: Globe,
    expanded: false,
    mpid: "0fee036a-3544-414e-9c51-d5550687ce36"
  }, {
    id: 'ai-tools',
    name: 'AI Tools',
    count: 0,
    icon: Zap,
    expanded: false,
    mpid: "ca34f45c-9e52-48d3-92af-f516215bf3ce"
  }, {
    id: 'ui-design',
    name: 'UI Design',
    count: 0,
    icon: Figma,
    expanded: false,
    mpid: "75d2de5d-7a35-40d5-9e23-ec0e2d7ffa85"
  }, {
    id: 'ux-design',
    name: 'UX Design',
    count: 0,
    icon: Users,
    expanded: false,
    mpid: "ac7faa91-fc9a-4341-a642-3776b853eb2a"
  }, {
    id: 'design',
    name: 'Design',
    count: 0,
    icon: PenTool,
    expanded: false,
    mpid: "a6c53545-3134-4c5a-9292-c84f6493afc5"
  }, {
    id: 'figma',
    name: 'Figma',
    count: 0,
    icon: Figma,
    expanded: false,
    mpid: "ad5a6c59-0f04-49f0-9727-737573363607"
  }, {
    id: 'crypto',
    name: 'Crypto',
    count: 0,
    icon: Cpu,
    expanded: false,
    mpid: "85d2cbae-270a-4f20-b3e5-90d9511ddec8"
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

    // Auto-complete description if URL is provided
    let description = newToolDescription;
    if (!description && newToolUrl) {
      // Simple auto-complete based on common domains
      const url = newToolUrl.toLowerCase();
      if (url.includes('openai.com') || url.includes('chatgpt')) {
        description = 'Advanced AI language model for conversations, writing, and problem-solving.';
      } else if (url.includes('claude.ai') || url.includes('anthropic')) {
        description = 'AI assistant by Anthropic for helpful, harmless, and honest conversations.';
      } else if (url.includes('figma.com')) {
        description = 'Collaborative interface design tool for creating user interfaces and prototypes.';
      } else if (url.includes('github.com')) {
        description = 'Version control and collaboration platform for software development.';
      } else {
        description = 'A useful tool for productivity and workflow enhancement.';
      }
    }
    const newTool: Tool = {
      id: `tool-${Date.now()}`,
      name: newToolName,
      url: newToolUrl,
      description: description,
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
                          {activeTab === 'prompts' ? prompts.length : tools.length}
                        </span>
                      </div>}
                  </button>
                </div>

                {(activeTab === 'prompts' ? updatedCategories : updatedToolCategories).map(category => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                const categorySubcategories = subcategories.filter(sub => sub.parentId === category.id);
                const hasSubcategories = categorySubcategories.length > 0;
                return <div key={category.id} data-magicpath-id="29" data-magicpath-path="KotoDashboard.tsx">
                      <div className="flex items-center group" data-magicpath-id="30" data-magicpath-path="KotoDashboard.tsx">
                        <button onClick={() => setActiveCategory(category.id)} onDoubleClick={() => handleDoubleClick(category.id, category.name)} className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors relative ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`} data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx">
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
                                {editingItem === category.id ? <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => handleRename(category.id, 'category')} onKeyPress={e => e.key === 'Enter' && handleRename(category.id, 'category')} className="bg-transparent border-none outline-none text-sm font-medium flex-1" autoFocus data-magicpath-id="35" data-magicpath-path="KotoDashboard.tsx" /> : <span className="font-medium text-sm" data-magicpath-id="36" data-magicpath-path="KotoDashboard.tsx">{category.name}</span>}
                                
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
                            {categorySubcategories.map(subcategory => <button key={subcategory.id} onClick={() => setActiveCategory(subcategory.id)} onDoubleClick={() => handleDoubleClick(subcategory.id, subcategory.name)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${activeCategory === subcategory.id ? 'bg-slate-700 dark:bg-slate-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'}`} data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="47" data-magicpath-path="KotoDashboard.tsx">
                                <div className="flex items-center justify-between w-full" data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="48" data-magicpath-path="KotoDashboard.tsx">
                                  {editingItem === subcategory.id ? <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => handleRename(subcategory.id, 'subcategory')} onKeyPress={e => e.key === 'Enter' && handleRename(subcategory.id, 'subcategory')} className="bg-transparent border-none outline-none text-sm flex-1" autoFocus data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="49" data-magicpath-path="KotoDashboard.tsx" /> : <span data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="50" data-magicpath-path="KotoDashboard.tsx">{subcategory.name}</span>}
                                  
                                  {/* Delete subcategory button */}
                                  <button onClick={e => {
                            e.stopPropagation();
                            setSubcategories(prev => prev.filter(sub => sub.id !== subcategory.id));
                          }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all ml-2" data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="51" data-magicpath-path="KotoDashboard.tsx">
                                    <Trash2 className="w-3 h-3 text-red-500" data-magicpath-uuid={(subcategory as any)["mpid"] ?? "unsafe"} data-magicpath-id="52" data-magicpath-path="KotoDashboard.tsx" />
                                  </button>
                                </div>
                              </button>)}
                          </motion.div>}
                      </AnimatePresence>
                    </div>;
              })}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="53" data-magicpath-path="KotoDashboard.tsx">
            <div className="space-y-1" data-magicpath-id="54" data-magicpath-path="KotoDashboard.tsx">
              <button onClick={() => setShowSettingsDialog(true)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="55" data-magicpath-path="KotoDashboard.tsx">
                <Settings className="w-5 h-5 flex-shrink-0" data-magicpath-id="56" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="57" data-magicpath-path="KotoDashboard.tsx">Settings</span>}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="58" data-magicpath-path="KotoDashboard.tsx">
                {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" data-magicpath-id="59" data-magicpath-path="KotoDashboard.tsx" /> : <Moon className="w-5 h-5 flex-shrink-0" data-magicpath-id="60" data-magicpath-path="KotoDashboard.tsx" />}
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="61" data-magicpath-path="KotoDashboard.tsx">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="62" data-magicpath-path="KotoDashboard.tsx">
                <HelpCircle className="w-5 h-5 flex-shrink-0" data-magicpath-id="63" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="64" data-magicpath-path="KotoDashboard.tsx">Help</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" data-magicpath-id="65" data-magicpath-path="KotoDashboard.tsx">
        {/* Content Area */}
        <main className="flex-1 overflow-auto" data-magicpath-id="66" data-magicpath-path="KotoDashboard.tsx">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden" style={{
          backgroundImage: backgroundImage || `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} data-magicpath-id="67" data-magicpath-path="KotoDashboard.tsx">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50" data-magicpath-id="68" data-magicpath-path="KotoDashboard.tsx"></div>
            
            {/* Profile Menu */}
            <div className="absolute top-6 right-6" data-magicpath-id="69" data-magicpath-path="KotoDashboard.tsx">
              <div className="relative" data-magicpath-id="70" data-magicpath-path="KotoDashboard.tsx">
                <motion.button onClick={() => setShowProfileMenu(!showProfileMenu)} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex items-center space-x-3 p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-colors" data-magicpath-id="71" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center" data-magicpath-id="72" data-magicpath-path="KotoDashboard.tsx">
                    <User className="w-5 h-5 text-white" data-magicpath-id="73" data-magicpath-path="KotoDashboard.tsx" />
                  </div>
                  <div className="text-left text-white" data-magicpath-id="74" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-sm font-medium" data-magicpath-id="75" data-magicpath-path="KotoDashboard.tsx">John Doe</div>
                    <div className="text-xs text-white/80" data-magicpath-id="76" data-magicpath-path="KotoDashboard.tsx">john@example.com</div>
                  </div>
                </motion.button>

                <AnimatePresence data-magicpath-id="77" data-magicpath-path="KotoDashboard.tsx">
                  {showProfileMenu && <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: 10
                }} className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2" data-magicpath-id="78" data-magicpath-path="KotoDashboard.tsx">
                      <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="79" data-magicpath-path="KotoDashboard.tsx">
                        <User className="w-4 h-4" data-magicpath-id="80" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="81" data-magicpath-path="KotoDashboard.tsx">Profile</span>
                      </button>
                      <button onClick={() => setShowSettingsDialog(true)} className="w-full px-4 py-1 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2" data-magicpath-id="82" data-magicpath-path="KotoDashboard.tsx">
                        <Settings className="w-4 h-4" data-magicpath-id="83" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="84" data-magicpath-path="KotoDashboard.tsx">Settings</span>
                      </button>
                      <hr className="my-2 border-slate-200 dark:border-slate-700" data-magicpath-id="85" data-magicpath-path="KotoDashboard.tsx" />
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2" data-magicpath-id="86" data-magicpath-path="KotoDashboard.tsx">
                        <span data-magicpath-id="87" data-magicpath-path="KotoDashboard.tsx">Sign Out</span>
                      </button>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative h-full flex items-center justify-center" data-magicpath-id="88" data-magicpath-path="KotoDashboard.tsx">
              <div className="text-center text-white flex flex-col items-center justify-center w-full max-w-4xl px-8" style={{
              display: "flex",
              width: "96%",
              maxWidth: "96%"
            }} data-magicpath-id="89" data-magicpath-path="KotoDashboard.tsx">
                {/* First Row - Centered Tabs */}
                <div className="mb-8" data-magicpath-id="90" data-magicpath-path="KotoDashboard.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex" style={{
                  display: "flex",
                  alignItems: "center"
                }} data-magicpath-id="91" data-magicpath-path="KotoDashboard.tsx">
                    <div className="flex space-x-1" style={{
                    alignItems: "center"
                  }} data-magicpath-id="92" data-magicpath-path="KotoDashboard.tsx">
                      <button onClick={() => setActiveTab('prompts')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="93" data-magicpath-path="KotoDashboard.tsx">
                        <MessageSquare className="w-4 h-4" data-magicpath-id="94" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="95" data-magicpath-path="KotoDashboard.tsx">Prompts</span>
                      </button>
                      <button onClick={() => setActiveTab('toolbox')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'toolbox' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="96" data-magicpath-path="KotoDashboard.tsx">
                        <Wrench className="w-4 h-4" data-magicpath-id="97" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="98" data-magicpath-path="KotoDashboard.tsx">Tool Box</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Row - Title and Actions */}
                <div className="flex items-center justify-between w-full max-w-3xl" style={{
                alignItems: "end",
                width: "100%",
                maxWidth: "100%"
              }} data-magicpath-id="99" data-magicpath-path="KotoDashboard.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  paddingTop: "16px",
                  paddingBottom: "16px"
                }} data-magicpath-id="100" data-magicpath-path="KotoDashboard.tsx">
                    <div className="flex items-center space-x-3 mb-2" data-magicpath-id="101" data-magicpath-path="KotoDashboard.tsx">
                      <Palette className="w-6 h-6" data-magicpath-id="102" data-magicpath-path="KotoDashboard.tsx" />
                      <h1 className="text-2xl font-bold" data-magicpath-id="103" data-magicpath-path="KotoDashboard.tsx">
                        {activeTab === 'prompts' ? 'Midjourney Prompts' : 'A.I Tools'}
                      </h1>
                    </div>
                    <p className="text-white/80" data-magicpath-id="104" data-magicpath-path="KotoDashboard.tsx">
                      {activeTab === 'prompts' ? `${filteredPrompts.length} prompts available` : `${filteredTools.length} tools saved`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4" data-magicpath-id="105" data-magicpath-path="KotoDashboard.tsx">
                    <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg transition-colors" data-magicpath-id="106" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="107" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="108" data-magicpath-path="KotoDashboard.tsx">{activeTab === 'prompts' ? 'Add Prompt' : 'Add Tool'}</span>
                    </motion.button>
                    
                    <motion.button onClick={() => setShowAddProjectDialog(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 backdrop-blur-sm transition-colors" data-magicpath-id="109" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="110" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="111" data-magicpath-path="KotoDashboard.tsx">{activeTab === 'toolbox' ? 'Add Stack' : 'Add Project'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6" data-magicpath-id="112" data-magicpath-path="KotoDashboard.tsx">
            <div className="max-w-7xl mx-auto" data-magicpath-id="113" data-magicpath-path="KotoDashboard.tsx">
              {activeTab === 'prompts' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="114" data-magicpath-path="KotoDashboard.tsx">
                  {filteredPrompts.map(prompt => <motion.div key={prompt.id} layout initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} whileHover={{
                y: -4
              }} onClick={() => handlePromptClick(prompt)} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="115" data-magicpath-path="KotoDashboard.tsx">
                      {/* Cover Image */}
                      <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="116" data-magicpath-path="KotoDashboard.tsx">
                        {prompt.coverImage ? <img src={prompt.coverImage} alt={prompt.title} className="w-full h-full object-cover" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="coverImage:unknown" data-magicpath-id="117" data-magicpath-path="KotoDashboard.tsx" /> : <div className="flex items-center justify-center h-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="118" data-magicpath-path="KotoDashboard.tsx">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="119" data-magicpath-path="KotoDashboard.tsx">
                              <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="120" data-magicpath-path="KotoDashboard.tsx" />
                            </div>
                          </div>}
                        
                        {/* Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="121" data-magicpath-path="KotoDashboard.tsx">
                          <div className="flex space-x-2" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="122" data-magicpath-path="KotoDashboard.tsx">
                            <button onClick={e => {
                        e.stopPropagation();
                        // Handle share
                      }} className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="123" data-magicpath-path="KotoDashboard.tsx">
                              <Share2 className="w-4 h-4 text-slate-600" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="124" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                            <button onClick={e => {
                        e.stopPropagation();
                        // Handle delete
                      }} className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="125" data-magicpath-path="KotoDashboard.tsx">
                              <Trash2 className="w-4 h-4 text-red-500" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="126" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="127" data-magicpath-path="KotoDashboard.tsx">
                        <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="128" data-magicpath-path="KotoDashboard.tsx">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="129" data-magicpath-path="KotoDashboard.tsx">
                            {prompt.title}
                          </h3>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="content:unknown" data-magicpath-id="130" data-magicpath-path="KotoDashboard.tsx">
                          {prompt.content}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="131" data-magicpath-path="KotoDashboard.tsx">
                          {prompt.tags.slice(0, 3).map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="132" data-magicpath-path="KotoDashboard.tsx">
                              {tag}
                            </span>)}
                          {prompt.tags.length > 3 && <span className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="133" data-magicpath-path="KotoDashboard.tsx">
                              +{prompt.tags.length - 3}
                            </span>}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="134" data-magicpath-path="KotoDashboard.tsx">
                          <span className="text-xs text-slate-500 dark:text-slate-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="135" data-magicpath-path="KotoDashboard.tsx">
                            {prompt.category}
                          </span>
                          <button onClick={e => {
                      e.stopPropagation();
                      // Handle copy
                    }} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="136" data-magicpath-path="KotoDashboard.tsx">
                            <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="137" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </div>
                      </div>
                    </motion.div>)}
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="138" data-magicpath-path="KotoDashboard.tsx">
                  {filteredTools.map(tool => <motion.div key={tool.id} layout initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} whileHover={{
                y: -4
              }} onClick={() => handleToolClick(tool)} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="139" data-magicpath-path="KotoDashboard.tsx">
                      {/* Tool Icon */}
                      <div className="relative h-32 bg-indigo-600 flex items-center justify-center" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="140" data-magicpath-path="KotoDashboard.tsx">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="141" data-magicpath-path="KotoDashboard.tsx">
                          <MessageSquare className="w-8 h-8 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="142" data-magicpath-path="KotoDashboard.tsx" />
                        </div>
                        
                        {/* Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="143" data-magicpath-path="KotoDashboard.tsx">
                          <div className="flex space-x-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="144" data-magicpath-path="KotoDashboard.tsx">
                            <button onClick={e => {
                        e.stopPropagation();
                        window.open(tool.url, '_blank');
                      }} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="145" data-magicpath-path="KotoDashboard.tsx">
                              <ExternalLink className="w-4 h-4 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="146" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                            <button onClick={e => {
                        e.stopPropagation();
                        // Handle delete
                      }} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="147" data-magicpath-path="KotoDashboard.tsx">
                              <Trash2 className="w-4 h-4 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="148" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="149" data-magicpath-path="KotoDashboard.tsx">
                        <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="150" data-magicpath-path="KotoDashboard.tsx">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="151" data-magicpath-path="KotoDashboard.tsx">
                            {tool.name}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="152" data-magicpath-path="KotoDashboard.tsx">
                            GPT-4
                          </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="153" data-magicpath-path="KotoDashboard.tsx">
                          {tool.description || 'Help me write engaging stories with vivid descriptions and compelling characters.'}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="154" data-magicpath-path="KotoDashboard.tsx">
                          <span className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="155" data-magicpath-path="KotoDashboard.tsx">
                            AI Tools
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="156" data-magicpath-path="KotoDashboard.tsx">
                            LLM's
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="157" data-magicpath-path="KotoDashboard.tsx">
                          <span className="text-xs text-slate-500 dark:text-slate-400" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="158" data-magicpath-path="KotoDashboard.tsx">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>)}
                </div>}

              {/* Empty State */}
              {(activeTab === 'prompts' && filteredPrompts.length === 0 || activeTab === 'toolbox' && filteredTools.length === 0) && <div className="text-center py-12" data-magicpath-id="159" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4" data-magicpath-id="160" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'prompts' ? <MessageSquare className="w-8 h-8 text-slate-400" data-magicpath-id="161" data-magicpath-path="KotoDashboard.tsx" /> : <Wrench className="w-8 h-8 text-slate-400" data-magicpath-id="162" data-magicpath-path="KotoDashboard.tsx" />}
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2" data-magicpath-id="163" data-magicpath-path="KotoDashboard.tsx">
                    No {activeTab === 'prompts' ? 'prompts' : 'tools'} found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6" data-magicpath-id="164" data-magicpath-path="KotoDashboard.tsx">
                    Try adjusting your search or create a new {activeTab === 'prompts' ? 'prompt' : 'tool'}
                  </p>
                  <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto transition-colors" data-magicpath-id="165" data-magicpath-path="KotoDashboard.tsx">
                    <Plus className="w-4 h-4" data-magicpath-id="166" data-magicpath-path="KotoDashboard.tsx" />
                    <span data-magicpath-id="167" data-magicpath-path="KotoDashboard.tsx">Add {activeTab === 'prompts' ? 'Prompt' : 'Tool'}</span>
                  </motion.button>
                </div>}
            </div>
          </div>
        </main>
      </div>

      {/* Add Project Dialog */}
      <AnimatePresence data-magicpath-id="168" data-magicpath-path="KotoDashboard.tsx">
        {showAddProjectDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowAddProjectDialog(false)} data-magicpath-id="169" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="170" data-magicpath-path="KotoDashboard.tsx">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="171" data-magicpath-path="KotoDashboard.tsx">
                Add New {activeTab === 'toolbox' ? 'Stack' : 'Project'}
              </h1>
              
              <div className="space-y-6" data-magicpath-id="172" data-magicpath-path="KotoDashboard.tsx">
                {/* Stack/Project Name */}
                <div data-magicpath-id="173" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="174" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Name
                  </label>
                  <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder={`Enter ${activeTab === 'toolbox' ? 'stack' : 'project'} name`} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="175" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Stack/Project Icon */}
                <div data-magicpath-id="176" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="177" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto" data-magicpath-id="178" data-magicpath-path="KotoDashboard.tsx">
                    {iconOptions.map(option => {
                  const IconComponent = option.icon;
                  return <button key={option.name} onClick={() => setSelectedIcon(option)} className={`p-2 rounded-lg border-2 transition-colors ${selectedIcon.name === option.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-uuid={(option as any)["mpid"] ?? "unsafe"} data-magicpath-id="179" data-magicpath-path="KotoDashboard.tsx">
                          <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-uuid={(option as any)["mpid"] ?? "unsafe"} data-magicpath-id="180" data-magicpath-path="KotoDashboard.tsx" />
                        </button>;
                })}
                  </div>
                </div>

                {/* Tools Selection - Only for Stack */}
                {activeTab === 'toolbox' && <div data-magicpath-id="181" data-magicpath-path="KotoDashboard.tsx">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="182" data-magicpath-path="KotoDashboard.tsx">
                      Select Tools
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg p-3 space-y-2" data-magicpath-id="183" data-magicpath-path="KotoDashboard.tsx">
                      {tools.map(tool => <label key={tool.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="184" data-magicpath-path="KotoDashboard.tsx">
                          <input type="checkbox" checked={newProjectTags.includes(tool.name)} onChange={e => {
                    if (e.target.checked) {
                      setNewProjectTags(prev => [...prev, tool.name]);
                    } else {
                      setNewProjectTags(prev => prev.filter(tag => tag !== tool.name));
                    }
                  }} className="w-4 h-4 text-indigo-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-indigo-500 focus:ring-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="185" data-magicpath-path="KotoDashboard.tsx" />
                          <div className="flex-1" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="186" data-magicpath-path="KotoDashboard.tsx">
                            <div className="font-medium text-slate-900 dark:text-white text-sm" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="187" data-magicpath-path="KotoDashboard.tsx">{tool.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="188" data-magicpath-path="KotoDashboard.tsx">{tool.category}</div>
                          </div>
                        </label>)}
                    </div>
                    
                    {/* Selected Tools Display */}
                    {newProjectTags.length > 0 && <div className="mt-3" data-magicpath-id="189" data-magicpath-path="KotoDashboard.tsx">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2" data-magicpath-id="190" data-magicpath-path="KotoDashboard.tsx">
                          Selected Tools ({newProjectTags.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5" data-magicpath-id="191" data-magicpath-path="KotoDashboard.tsx">
                          {newProjectTags.map(toolName => <span key={toolName} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(toolName as any)["mpid"] ?? "unsafe"} data-magicpath-id="192" data-magicpath-path="KotoDashboard.tsx">
                              {toolName}
                              <button onClick={() => setNewProjectTags(prev => prev.filter(tag => tag !== toolName))} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100" data-magicpath-uuid={(toolName as any)["mpid"] ?? "unsafe"} data-magicpath-id="193" data-magicpath-path="KotoDashboard.tsx">
                                <X className="w-3 h-3" data-magicpath-uuid={(toolName as any)["mpid"] ?? "unsafe"} data-magicpath-id="194" data-magicpath-path="KotoDashboard.tsx" />
                              </button>
                            </span>)}
                        </div>
                      </div>}
                  </div>}

                {/* Add Tags - Only for Project */}
                {activeTab === 'prompts' && <div data-magicpath-id="195" data-magicpath-path="KotoDashboard.tsx">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="196" data-magicpath-path="KotoDashboard.tsx">
                      Add Tags
                    </label>
                    <div className="flex space-x-2 mb-2" data-magicpath-id="197" data-magicpath-path="KotoDashboard.tsx">
                      <input type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddTag()} placeholder="Enter tag" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="198" data-magicpath-path="KotoDashboard.tsx" />
                      <button onClick={handleAddTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="199" data-magicpath-path="KotoDashboard.tsx">
                        <Plus className="w-4 h-4" data-magicpath-id="200" data-magicpath-path="KotoDashboard.tsx" />
                      </button>
                    </div>
                    
                    {/* Tags Display */}
                    {newProjectTags.length > 0 && <div className="flex flex-wrap gap-1.5" data-magicpath-id="201" data-magicpath-path="KotoDashboard.tsx">
                        {newProjectTags.map(tag => <span key={tag} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="202" data-magicpath-path="KotoDashboard.tsx">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="203" data-magicpath-path="KotoDashboard.tsx">
                              <X className="w-3 h-3" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="204" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </span>)}
                      </div>}
                  </div>}

                {/* Add Subcategories - Only for Project */}
                {activeTab === 'prompts' && <div data-magicpath-id="205" data-magicpath-path="KotoDashboard.tsx">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="206" data-magicpath-path="KotoDashboard.tsx">
                      Add Subcategories
                    </label>
                    <div className="flex space-x-2 mb-2" data-magicpath-id="207" data-magicpath-path="KotoDashboard.tsx">
                      <input type="text" value={newSubcategoryInput} onChange={e => setNewSubcategoryInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddSubcategory()} placeholder="Enter subcategory" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="208" data-magicpath-path="KotoDashboard.tsx" />
                      <button onClick={handleAddSubcategory} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="209" data-magicpath-path="KotoDashboard.tsx">
                        <Plus className="w-4 h-4" data-magicpath-id="210" data-magicpath-path="KotoDashboard.tsx" />
                      </button>
                    </div>
                    
                    {/* Subcategories Display */}
                    {newProjectSubcategories.length > 0 && <div className="flex flex-wrap gap-1.5" data-magicpath-id="211" data-magicpath-path="KotoDashboard.tsx">
                        {newProjectSubcategories.map(subcat => <span key={subcat} className="inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full" data-magicpath-uuid={(subcat as any)["mpid"] ?? "unsafe"} data-magicpath-id="212" data-magicpath-path="KotoDashboard.tsx">
                            {subcat}
                            <button onClick={() => removeSubcategory(subcat)} className="ml-1 hover:text-green-900 dark:hover:text-green-100" data-magicpath-uuid={(subcat as any)["mpid"] ?? "unsafe"} data-magicpath-id="213" data-magicpath-path="KotoDashboard.tsx">
                              <X className="w-3 h-3" data-magicpath-uuid={(subcat as any)["mpid"] ?? "unsafe"} data-magicpath-id="214" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </span>)}
                      </div>}
                  </div>}

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="215" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowAddProjectDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="216" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleAddProject} disabled={!newProjectName.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="217" data-magicpath-path="KotoDashboard.tsx">
                    Add {activeTab === 'toolbox' ? 'Stack' : 'Project'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Prompt Dialog */}
      <AnimatePresence data-magicpath-id="218" data-magicpath-path="KotoDashboard.tsx">
        {showNewPromptDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewPromptDialog(false)} data-magicpath-id="219" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="220" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="221" data-magicpath-path="KotoDashboard.tsx">Add New Prompt</h2>
              
              <div className="space-y-6" data-magicpath-id="222" data-magicpath-path="KotoDashboard.tsx">
                {/* Title */}
                <div data-magicpath-id="223" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="224" data-magicpath-path="KotoDashboard.tsx">
                    Title
                  </label>
                  <input type="text" value={newPromptTitle} onChange={e => setNewPromptTitle(e.target.value)} placeholder="Enter prompt title" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="225" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Content */}
                <div data-magicpath-id="226" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="227" data-magicpath-path="KotoDashboard.tsx">
                    Content
                  </label>
                  <textarea value={newPromptContent} onChange={e => setNewPromptContent(e.target.value)} placeholder="Enter prompt content" rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="228" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Model */}
                <div data-magicpath-id="229" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="230" data-magicpath-path="KotoDashboard.tsx">
                    Model
                  </label>
                  <select value={newPromptModel} onChange={e => setNewPromptModel(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="231" data-magicpath-path="KotoDashboard.tsx">
                    <option value="GPT-4" data-magicpath-id="232" data-magicpath-path="KotoDashboard.tsx">GPT-4</option>
                    <option value="Claude" data-magicpath-id="233" data-magicpath-path="KotoDashboard.tsx">Claude</option>
                    <option value="Midjourney" data-magicpath-id="234" data-magicpath-path="KotoDashboard.tsx">Midjourney</option>
                    <option value="DALL-E" data-magicpath-id="235" data-magicpath-path="KotoDashboard.tsx">DALL-E</option>
                  </select>
                </div>

                {/* Tags */}
                <div data-magicpath-id="236" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="237" data-magicpath-path="KotoDashboard.tsx">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2" data-magicpath-id="238" data-magicpath-path="KotoDashboard.tsx">
                    <input type="text" value={newPromptTagInput} onChange={e => setNewPromptTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddPromptTag()} placeholder="Enter tag" className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" data-magicpath-id="239" data-magicpath-path="KotoDashboard.tsx" />
                    <button onClick={handleAddPromptTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" data-magicpath-id="240" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="241" data-magicpath-path="KotoDashboard.tsx" />
                    </button>
                  </div>
                  
                  {/* Tags Display */}
                  {newPromptTags.length > 0 && <div className="flex flex-wrap gap-1.5" data-magicpath-id="242" data-magicpath-path="KotoDashboard.tsx">
                      {newPromptTags.map(tag => <span key={tag} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="243" data-magicpath-path="KotoDashboard.tsx">
                          {tag}
                          <button onClick={() => removePromptTag(tag)} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="244" data-magicpath-path="KotoDashboard.tsx">
                            <X className="w-3 h-3" data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="245" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </span>)}
                    </div>}
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="246" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowNewPromptDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="247" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleCreatePrompt} disabled={!newPromptTitle.trim() || !newPromptContent.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="248" data-magicpath-path="KotoDashboard.tsx">
                    Create Prompt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Add Tool Dialog */}
      <AnimatePresence data-magicpath-id="249" data-magicpath-path="KotoDashboard.tsx">
        {showNewToolDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowNewToolDialog(false)} data-magicpath-id="250" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="251" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-magicpath-id="252" data-magicpath-path="KotoDashboard.tsx">Add New Tool</h2>
              
              <div className="space-y-6" data-magicpath-id="253" data-magicpath-path="KotoDashboard.tsx">
                {/* Name */}
                <div data-magicpath-id="254" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="255" data-magicpath-path="KotoDashboard.tsx">
                    Tool Name
                  </label>
                  <input type="text" value={newToolName} onChange={e => setNewToolName(e.target.value)} placeholder="Enter tool name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="256" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* URL */}
                <div data-magicpath-id="257" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="258" data-magicpath-path="KotoDashboard.tsx">
                    URL
                  </label>
                  <input type="url" value={newToolUrl} onChange={e => setNewToolUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="259" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Description */}
                <div data-magicpath-id="260" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="261" data-magicpath-path="KotoDashboard.tsx">
                    Description (optional - will auto-complete based on URL)
                  </label>
                  <textarea value={newToolDescription} onChange={e => setNewToolDescription(e.target.value)} placeholder="Enter tool description or leave blank for auto-completion" rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="262" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                {/* Category */}
                <div data-magicpath-id="263" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="264" data-magicpath-path="KotoDashboard.tsx">
                    Category
                  </label>
                  <select value={newToolCategory} onChange={e => setNewToolCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="265" data-magicpath-path="KotoDashboard.tsx">
                    <option value="AI Tools" data-magicpath-id="266" data-magicpath-path="KotoDashboard.tsx">AI Tools</option>
                    <option value="UI Design" data-magicpath-id="267" data-magicpath-path="KotoDashboard.tsx">UI Design</option>
                    <option value="UX Design" data-magicpath-id="268" data-magicpath-path="KotoDashboard.tsx">UX Design</option>
                    <option value="Design" data-magicpath-id="269" data-magicpath-path="KotoDashboard.tsx">Design</option>
                    <option value="Figma" data-magicpath-id="270" data-magicpath-path="KotoDashboard.tsx">Figma</option>
                    <option value="Crypto" data-magicpath-id="271" data-magicpath-path="KotoDashboard.tsx">Crypto</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="272" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowNewToolDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="273" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleCreateTool} disabled={!newToolName.trim() || !newToolUrl.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="274" data-magicpath-path="KotoDashboard.tsx">
                    Create Tool
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Prompt Details Dialog */}
      <AnimatePresence data-magicpath-id="275" data-magicpath-path="KotoDashboard.tsx">
        {showPromptDetailsDialog && selectedPrompt && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowPromptDetailsDialog(false)} data-magicpath-id="276" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="277" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="278" data-magicpath-path="KotoDashboard.tsx">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-magicpath-id="279" data-magicpath-path="KotoDashboard.tsx">{selectedPrompt.title}</h2>
                <button onClick={() => setShowPromptDetailsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="280" data-magicpath-path="KotoDashboard.tsx">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="281" data-magicpath-path="KotoDashboard.tsx" />
                </button>
              </div>

              {selectedPrompt.coverImage && <div className="mb-6" data-magicpath-id="282" data-magicpath-path="KotoDashboard.tsx">
                  <img src={selectedPrompt.coverImage} alt={selectedPrompt.title} className="w-full h-48 object-cover rounded-lg" data-magicpath-id="283" data-magicpath-path="KotoDashboard.tsx" />
                </div>}

              <div className="space-y-4" data-magicpath-id="284" data-magicpath-path="KotoDashboard.tsx">
                <div data-magicpath-id="285" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="286" data-magicpath-path="KotoDashboard.tsx">Content</h3>
                  <p className="text-slate-700 dark:text-slate-300" data-magicpath-id="287" data-magicpath-path="KotoDashboard.tsx">{selectedPrompt.content}</p>
                </div>

                <div data-magicpath-id="288" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="289" data-magicpath-path="KotoDashboard.tsx">Model</h3>
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full" data-magicpath-id="290" data-magicpath-path="KotoDashboard.tsx">
                    {selectedPrompt.model}
                  </span>
                </div>

                <div data-magicpath-id="291" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="292" data-magicpath-path="KotoDashboard.tsx">Tags</h3>
                  <div className="flex flex-wrap gap-2" data-magicpath-id="293" data-magicpath-path="KotoDashboard.tsx">
                    {selectedPrompt.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full" data-magicpath-id="294" data-magicpath-path="KotoDashboard.tsx">
                        {tag}
                      </span>)}
                  </div>
                </div>

                <div data-magicpath-id="295" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="296" data-magicpath-path="KotoDashboard.tsx">Created</h3>
                  <p className="text-slate-700 dark:text-slate-300" data-magicpath-id="297" data-magicpath-path="KotoDashboard.tsx">{selectedPrompt.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="298" data-magicpath-path="KotoDashboard.tsx">
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center space-x-2" data-magicpath-id="299" data-magicpath-path="KotoDashboard.tsx">
                  <Copy className="w-4 h-4" data-magicpath-id="300" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="301" data-magicpath-path="KotoDashboard.tsx">Copy</span>
                </button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2" data-magicpath-id="302" data-magicpath-path="KotoDashboard.tsx">
                  <Share2 className="w-4 h-4" data-magicpath-id="303" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="304" data-magicpath-path="KotoDashboard.tsx">Share</span>
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Tool Details Dialog */}
      <AnimatePresence data-magicpath-id="305" data-magicpath-path="KotoDashboard.tsx">
        {showToolDetailsDialog && selectedTool && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowToolDetailsDialog(false)} data-magicpath-id="306" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="307" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="308" data-magicpath-path="KotoDashboard.tsx">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-magicpath-id="309" data-magicpath-path="KotoDashboard.tsx">{selectedTool.name}</h2>
                <button onClick={() => setShowToolDetailsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="310" data-magicpath-path="KotoDashboard.tsx">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="311" data-magicpath-path="KotoDashboard.tsx" />
                </button>
              </div>

              <div className="space-y-4" data-magicpath-id="312" data-magicpath-path="KotoDashboard.tsx">
                <div data-magicpath-id="313" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="314" data-magicpath-path="KotoDashboard.tsx">Description</h3>
                  <p className="text-slate-700 dark:text-slate-300" data-magicpath-id="315" data-magicpath-path="KotoDashboard.tsx">{selectedTool.description || 'No description available.'}</p>
                </div>

                <div data-magicpath-id="316" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="317" data-magicpath-path="KotoDashboard.tsx">Category</h3>
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full" data-magicpath-id="318" data-magicpath-path="KotoDashboard.tsx">
                    {selectedTool.category}
                  </span>
                </div>

                <div data-magicpath-id="319" data-magicpath-path="KotoDashboard.tsx">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2" data-magicpath-id="320" data-magicpath-path="KotoDashboard.tsx">URL</h3>
                  <a href={selectedTool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline break-all">
                    {selectedTool.url}
                  </a>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="321" data-magicpath-path="KotoDashboard.tsx">
                <button onClick={() => window.open(selectedTool.url, '_blank')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2" data-magicpath-id="322" data-magicpath-path="KotoDashboard.tsx">
                  <ExternalLink className="w-4 h-4" data-magicpath-id="323" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="324" data-magicpath-path="KotoDashboard.tsx">Open Tool</span>
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Settings Dialog */}
      <AnimatePresence data-magicpath-id="325" data-magicpath-path="KotoDashboard.tsx">
        {showSettingsDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowSettingsDialog(false)} data-magicpath-id="326" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="327" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="328" data-magicpath-path="KotoDashboard.tsx">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-magicpath-id="329" data-magicpath-path="KotoDashboard.tsx">Settings</h2>
                <button onClick={() => setShowSettingsDialog(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="330" data-magicpath-path="KotoDashboard.tsx">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="331" data-magicpath-path="KotoDashboard.tsx" />
                </button>
              </div>

              <div className="space-y-6" data-magicpath-id="332" data-magicpath-path="KotoDashboard.tsx">
                {/* Default Theme */}
                <div data-magicpath-id="333" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="334" data-magicpath-path="KotoDashboard.tsx">
                    Default Theme
                  </label>
                  <div className="flex space-x-3" data-magicpath-id="335" data-magicpath-path="KotoDashboard.tsx">
                    <button onClick={() => {
                  setDefaultTheme('light');
                  setDarkMode(false);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-id="336" data-magicpath-path="KotoDashboard.tsx">
                      <Sun className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" data-magicpath-id="337" data-magicpath-path="KotoDashboard.tsx" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300" data-magicpath-id="338" data-magicpath-path="KotoDashboard.tsx">Light</div>
                    </button>
                    <button onClick={() => {
                  setDefaultTheme('dark');
                  setDarkMode(true);
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${defaultTheme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`} data-magicpath-id="339" data-magicpath-path="KotoDashboard.tsx">
                      <Moon className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" data-magicpath-id="340" data-magicpath-path="KotoDashboard.tsx" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300" data-magicpath-id="341" data-magicpath-path="KotoDashboard.tsx">Dark</div>
                    </button>
                  </div>
                </div>

                {/* Background Photo */}
                <div data-magicpath-id="342" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3" data-magicpath-id="343" data-magicpath-path="KotoDashboard.tsx">
                    Change Background Photo
                  </label>
                  <div className="space-y-3" data-magicpath-id="344" data-magicpath-path="KotoDashboard.tsx">
                    <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" id="background-upload" data-magicpath-id="345" data-magicpath-path="KotoDashboard.tsx" />
                    <label htmlFor="background-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors" data-magicpath-id="346" data-magicpath-path="KotoDashboard.tsx">
                      <div className="text-center" data-magicpath-id="347" data-magicpath-path="KotoDashboard.tsx">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" data-magicpath-id="348" data-magicpath-path="KotoDashboard.tsx" />
                        <div className="text-sm text-slate-600 dark:text-slate-400" data-magicpath-id="349" data-magicpath-path="KotoDashboard.tsx">
                          Click to upload photo
                        </div>
                      </div>
                    </label>
                    
                    {backgroundImage && <div className="relative" data-magicpath-id="350" data-magicpath-path="KotoDashboard.tsx">
                        <img src={backgroundImage} alt="Background preview" className="w-full h-20 object-cover rounded-lg" data-magicpath-id="351" data-magicpath-path="KotoDashboard.tsx" />
                        <button onClick={() => setBackgroundImage('')} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors" data-magicpath-id="352" data-magicpath-path="KotoDashboard.tsx">
                          <X className="w-3 h-3" data-magicpath-id="353" data-magicpath-path="KotoDashboard.tsx" />
                        </button>
                      </div>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="354" data-magicpath-path="KotoDashboard.tsx">
                <button onClick={() => setShowSettingsDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="355" data-magicpath-path="KotoDashboard.tsx">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;