"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus, MessageSquare, Wrench, ChevronLeft, Menu, Bell, User, Settings, HelpCircle, Sun, Moon, ExternalLink, Share2, Trash2, Copy, Palette, Code, Briefcase, PenTool, Target, Users, BarChart3, Zap, Globe, Figma, Cpu, Tag } from 'lucide-react';
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
  mpid?: string;
}
interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  mpid?: string;
}
const KotoDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>('prompts');
  const [activeCategory, setActiveCategory] = useState<string>('midjourney');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [showNewToolDialog, setShowNewToolDialog] = useState(false);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([{
    id: '1',
    title: 'Woman and Tiger',
    content: 'A woman in an oversized sweater and trousers walks with her pet white tiger on the streets of New York City, in the style of cinematic photography.',
    tags: ['sref', 'fashion', 'fashion', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-15'),
    mpid: "5fbb0616-a069-4e69-8e7e-c497ea85b2e7"
  }, {
    id: '2',
    title: 'Man and Leopard',
    content: 'A man dressed in a tailored blazer and fitted jeans strides confidently with a striking spotted leopard companion through the bustling streets.',
    tags: ['sref', 'fashion', 'luxury', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-14'),
    mpid: "84951018-54c5-4f4a-b0e9-1e00fe4255db"
  }, {
    id: '3',
    title: 'Girl and Owl',
    content: 'A young girl in a floral dress and cowboy boots stands in a whimsical forest clearing, holding hands with a majestic owl.',
    tags: ['sref', 'whimsy', 'nature', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-13'),
    mpid: "b58ccaae-b1f3-436a-bc85-873fa9f9513f"
  }, {
    id: '4',
    title: 'Boy and Falcon',
    content: 'A boy in a leather jacket and aviator sunglasses stands on a rocky cliff, proudly displaying a magnificent falcon perched on his arm.',
    tags: ['sref', 'adventure', 'wildlife', 'photography'],
    model: 'Midjourney',
    category: 'Midjourney',
    coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
    createdAt: new Date('2024-01-12'),
    mpid: "519bba7c-1053-4c34-85e3-3af1f5bb0746"
  }, {
    id: '5',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-11'),
    mpid: "23b136f3-0866-4588-9d79-abf20b9610f5"
  }, {
    id: '6',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-10'),
    mpid: "e502cfc1-129b-407d-ad36-ed6433e13765"
  }, {
    id: '7',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-09'),
    mpid: "e5d8a728-e5d2-4f0e-8962-60f5c9566282"
  }, {
    id: '8',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['Writing', 'Creative', 'Storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-08'),
    mpid: "fee386ab-b8a5-4a20-8891-bdd5af2f9986"
  }]);
  const [tools, setTools] = useState<Tool[]>([{
    id: '1',
    name: 'Chat-GPT',
    category: 'AI Tools',
    url: 'https://chat.openai.com',
    mpid: "52ea5f82-22c0-4d49-90f4-7cdcaf9b4179"
  }, {
    id: '2',
    name: 'Claude',
    category: 'AI Tools',
    url: 'https://claude.ai',
    mpid: "d05a618f-254b-4c3f-9fc1-6a664c0972ab"
  }, {
    id: '3',
    name: 'DeepSeek',
    category: 'AI Tools',
    url: 'https://deepseek.com',
    mpid: "a27813bc-3eb5-40d6-bbe2-8757d645668c"
  }, {
    id: '4',
    name: 'Grok',
    category: 'AI Tools',
    url: 'https://grok.x.ai',
    mpid: "0726e152-75ff-48ba-afe1-4186f5e556d0"
  }]);
  const [categories, setCategories] = useState<Category[]>([{
    id: 'midjourney',
    name: 'Midjourney',
    count: 0,
    icon: Palette,
    mpid: "a305e8dd-adc7-4cdb-aa08-f694d2675eb8"
  }, {
    id: 'chat-gpt',
    name: 'Chat-GPT',
    count: 0,
    icon: MessageSquare,
    mpid: "50f1285e-b7c4-4043-ba2b-1ca70ca80189"
  }, {
    id: 'development',
    name: 'Development',
    count: 0,
    icon: Code,
    mpid: "0e5e9819-756b-466b-b193-073586ceb59e"
  }, {
    id: 'design',
    name: 'Design',
    count: 0,
    icon: PenTool,
    mpid: "3bc8f13d-57b9-4f72-b6ad-6c8725a69ef8"
  }, {
    id: 'business',
    name: 'Business',
    count: 0,
    icon: Briefcase,
    mpid: "d06370c8-625f-46e3-bb9c-b2ed3da27369"
  }, {
    id: 'marketing',
    name: 'Marketing',
    count: 0,
    icon: Target,
    mpid: "53e9ba50-f279-48cf-9e10-75efb418bb55"
  }, {
    id: 'sales',
    name: 'Sales',
    count: 0,
    icon: BarChart3,
    mpid: "0a7e6517-4c6d-47c8-83a0-69a4c1dbcb69"
  }, {
    id: 'customer-support',
    name: 'Customer Support',
    count: 0,
    icon: Users,
    mpid: "27062c00-9865-4542-94bc-cf4f1f5962f7"
  }, {
    id: 'research',
    name: 'Research',
    count: 0,
    icon: Search,
    mpid: "d0d2984a-9da8-4cc2-a2b0-a980fb35c06b"
  }, {
    id: 'writing',
    name: 'Writing',
    count: 0,
    icon: PenTool,
    mpid: "6d64d890-3f1b-49d7-9357-efcbe54d4af8"
  }]);
  const [toolCategories, setToolCategories] = useState<Category[]>([{
    id: 'all-tools',
    name: 'All Tools',
    count: 0,
    icon: Globe,
    mpid: "4574d2c9-6164-4296-a391-4a3a415ce460"
  }, {
    id: 'ai-tools',
    name: 'AI Tools',
    count: 0,
    icon: Zap,
    mpid: "99925739-f2bd-4872-adb5-3dde0c109aa4"
  }, {
    id: 'ui-design',
    name: 'UI Design',
    count: 0,
    icon: Figma,
    mpid: "36d5966d-dacb-48e0-b9ed-becc03ffa0f4"
  }, {
    id: 'ux-design',
    name: 'UX Design',
    count: 0,
    icon: Users,
    mpid: "db781268-859c-4337-886a-373fbd7786e1"
  }, {
    id: 'design',
    name: 'Design',
    count: 0,
    icon: PenTool,
    mpid: "27605388-e2f8-45a0-9ba2-5cbbb92f23b8"
  }, {
    id: 'figma',
    name: 'Figma',
    count: 0,
    icon: Figma,
    mpid: "3cdc4eb0-6e18-4a6d-9e82-e61e9c5aa63f"
  }, {
    id: 'crypto',
    name: 'Crypto',
    count: 0,
    icon: Cpu,
    mpid: "707b75f6-101f-4165-be5b-373655811730"
  }]);

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
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    const newTag: Category = {
      id: newTagName.toLowerCase().replace(/\s+/g, '-'),
      name: newTagName,
      count: 0,
      icon: Tag,
      mpid: `tag-${Date.now()}`
    };
    if (activeTab === 'prompts') {
      setCategories(prev => [...prev, newTag]);
    } else {
      setToolCategories(prev => [...prev, newTag]);
    }
    setNewTagName('');
    setShowAddTagDialog(false);
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
                    CATEGORIES
                  </h2>
                  <button onClick={() => setShowAddTagDialog(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" data-magicpath-id="20" data-magicpath-path="KotoDashboard.tsx">
                    <Plus className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="KotoDashboard.tsx" />
                  </button>
                </div>}
              
              <div className="space-y-1" data-magicpath-id="22" data-magicpath-path="KotoDashboard.tsx">
                {(activeTab === 'prompts' ? updatedCategories : updatedToolCategories).map(category => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`} data-magicpath-id="23" data-magicpath-path="KotoDashboard.tsx">
                      <Icon className="w-5 h-5 flex-shrink-0" data-magicpath-id="24" data-magicpath-path="KotoDashboard.tsx" />
                      <AnimatePresence mode="wait" data-magicpath-id="25" data-magicpath-path="KotoDashboard.tsx">
                        {!sidebarCollapsed && <motion.div initial={{
                      opacity: 0,
                      x: -10
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} exit={{
                      opacity: 0,
                      x: -10
                    }} className="flex items-center justify-between w-full" data-magicpath-id="26" data-magicpath-path="KotoDashboard.tsx">
                            <span className="font-medium text-sm" data-magicpath-id="27" data-magicpath-path="KotoDashboard.tsx">{category.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'}`} data-magicpath-id="28" data-magicpath-path="KotoDashboard.tsx">
                              {category.count}
                            </span>
                          </motion.div>}
                      </AnimatePresence>
                    </button>;
              })}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700" data-magicpath-id="29" data-magicpath-path="KotoDashboard.tsx">
            <div className="space-y-1" data-magicpath-id="30" data-magicpath-path="KotoDashboard.tsx">
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx">
                <Settings className="w-5 h-5 flex-shrink-0" data-magicpath-id="32" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="33" data-magicpath-path="KotoDashboard.tsx">Settings</span>}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="34" data-magicpath-path="KotoDashboard.tsx">
                {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" data-magicpath-id="35" data-magicpath-path="KotoDashboard.tsx" /> : <Moon className="w-5 h-5 flex-shrink-0" data-magicpath-id="36" data-magicpath-path="KotoDashboard.tsx" />}
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="37" data-magicpath-path="KotoDashboard.tsx">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors" data-magicpath-id="38" data-magicpath-path="KotoDashboard.tsx">
                <HelpCircle className="w-5 h-5 flex-shrink-0" data-magicpath-id="39" data-magicpath-path="KotoDashboard.tsx" />
                {!sidebarCollapsed && <span className="font-medium text-sm" data-magicpath-id="40" data-magicpath-path="KotoDashboard.tsx">Help</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence data-magicpath-id="41" data-magicpath-path="KotoDashboard.tsx">
        {mobileMenuOpen && <motion.aside initial={{
        x: -320
      }} animate={{
        x: 0
      }} exit={{
        x: -320
      }} transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }} className="fixed left-0 top-0 h-full w-80 z-50 md:hidden bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700" data-magicpath-id="42" data-magicpath-path="KotoDashboard.tsx">
            {/* Mobile sidebar content - similar to desktop but always expanded */}
          </motion.aside>}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" data-magicpath-id="43" data-magicpath-path="KotoDashboard.tsx">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4" style={{
        display: "none"
      }} data-magicpath-id="44" data-magicpath-path="KotoDashboard.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="45" data-magicpath-path="KotoDashboard.tsx">
            <div className="flex items-center space-x-4" data-magicpath-id="46" data-magicpath-path="KotoDashboard.tsx">
              <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="47" data-magicpath-path="KotoDashboard.tsx">
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="48" data-magicpath-path="KotoDashboard.tsx" />
              </button>
            </div>

            <div className="flex items-center space-x-4" data-magicpath-id="49" data-magicpath-path="KotoDashboard.tsx">
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative" data-magicpath-id="50" data-magicpath-path="KotoDashboard.tsx">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" data-magicpath-id="51" data-magicpath-path="KotoDashboard.tsx" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full" data-magicpath-id="52" data-magicpath-path="KotoDashboard.tsx"></span>
              </motion.button>

              <div className="relative" data-magicpath-id="53" data-magicpath-path="KotoDashboard.tsx">
                <motion.button whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex items-center space-x-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" data-magicpath-id="54" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center" data-magicpath-id="55" data-magicpath-path="KotoDashboard.tsx">
                    <User className="w-4 h-4 text-white" data-magicpath-id="56" data-magicpath-path="KotoDashboard.tsx" />
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4" style={{
        display: "none"
      }} data-magicpath-id="57" data-magicpath-path="KotoDashboard.tsx">
          <div className="flex items-center justify-center" data-magicpath-id="58" data-magicpath-path="KotoDashboard.tsx">
            <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg" data-magicpath-id="59" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex space-x-1" data-magicpath-id="60" data-magicpath-path="KotoDashboard.tsx">
                <button onClick={() => setActiveTab('prompts')} className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`} data-magicpath-id="61" data-magicpath-path="KotoDashboard.tsx">
                  <MessageSquare className="w-4 h-4" data-magicpath-id="62" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="63" data-magicpath-path="KotoDashboard.tsx">Prompts</span>
                </button>
                <button onClick={() => setActiveTab('toolbox')} className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'toolbox' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`} data-magicpath-id="64" data-magicpath-path="KotoDashboard.tsx">
                  <Wrench className="w-4 h-4" data-magicpath-id="65" data-magicpath-path="KotoDashboard.tsx" />
                  <span data-magicpath-id="66" data-magicpath-path="KotoDashboard.tsx">Tool Box</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto" data-magicpath-id="67" data-magicpath-path="KotoDashboard.tsx">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} data-magicpath-id="68" data-magicpath-path="KotoDashboard.tsx">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50" data-magicpath-id="69" data-magicpath-path="KotoDashboard.tsx"></div>
            <div className="relative h-full flex items-center justify-center" data-magicpath-id="70" data-magicpath-path="KotoDashboard.tsx">
              <div className="text-center text-white flex flex-col items-center justify-center w-full max-w-4xl px-8" data-magicpath-id="71" data-magicpath-path="KotoDashboard.tsx" style={{
              display: "flex",
              width: "96%",
              maxWidth: "96%"
            }}>
                {/* First Row - Centered Tabs */}
                <div className="mb-8" data-magicpath-id="72" data-magicpath-path="KotoDashboard.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex" data-magicpath-id="73" data-magicpath-path="KotoDashboard.tsx" style={{
                  display: "flex",
                  alignItems: "center"
                }}>
                    <div className="flex space-x-1" data-magicpath-id="74" data-magicpath-path="KotoDashboard.tsx" style={{
                    alignItems: "center"
                  }}>
                      <button onClick={() => setActiveTab('prompts')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="75" data-magicpath-path="KotoDashboard.tsx">
                        <MessageSquare className="w-4 h-4" data-magicpath-id="76" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="77" data-magicpath-path="KotoDashboard.tsx">Prompts</span>
                      </button>
                      <button onClick={() => setActiveTab('toolbox')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'toolbox' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`} data-magicpath-id="78" data-magicpath-path="KotoDashboard.tsx">
                        <Wrench className="w-4 h-4" data-magicpath-id="79" data-magicpath-path="KotoDashboard.tsx" />
                        <span data-magicpath-id="80" data-magicpath-path="KotoDashboard.tsx">Tool Box</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Row - Title and Actions */}
                <div className="flex items-center justify-between w-full max-w-3xl" data-magicpath-id="81" data-magicpath-path="KotoDashboard.tsx" style={{
                alignItems: "end",
                width: "100%",
                maxWidth: "100%"
              }}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6" data-magicpath-id="82" data-magicpath-path="KotoDashboard.tsx" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  paddingTop: "16px",
                  paddingBottom: "16px"
                }}>
                    <div className="flex items-center space-x-3 mb-2" data-magicpath-id="83" data-magicpath-path="KotoDashboard.tsx">
                      <Palette className="w-6 h-6" data-magicpath-id="84" data-magicpath-path="KotoDashboard.tsx" />
                      <h1 className="text-2xl font-bold" data-magicpath-id="85" data-magicpath-path="KotoDashboard.tsx">
                        {activeTab === 'prompts' ? 'Midjourney Prompts' : 'A.I Tools'}
                      </h1>
                    </div>
                    <p className="text-white/80" data-magicpath-id="86" data-magicpath-path="KotoDashboard.tsx">
                      {activeTab === 'prompts' ? `${filteredPrompts.length} prompts available` : `${filteredTools.length} tools saved`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4" data-magicpath-id="87" data-magicpath-path="KotoDashboard.tsx">
                    <motion.button onClick={() => activeTab === 'prompts' ? setShowNewPromptDialog(true) : setShowNewToolDialog(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg transition-colors" data-magicpath-id="88" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="89" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="90" data-magicpath-path="KotoDashboard.tsx">{activeTab === 'prompts' ? 'Add Prompt' : 'Add Tool'}</span>
                    </motion.button>
                    
                    <motion.button onClick={() => setShowAddTagDialog(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 backdrop-blur-sm transition-colors" data-magicpath-id="91" data-magicpath-path="KotoDashboard.tsx">
                      <Plus className="w-4 h-4" data-magicpath-id="92" data-magicpath-path="KotoDashboard.tsx" />
                      <span data-magicpath-id="93" data-magicpath-path="KotoDashboard.tsx">Add Tag</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6" data-magicpath-id="94" data-magicpath-path="KotoDashboard.tsx">
            <div className="max-w-7xl mx-auto" data-magicpath-id="95" data-magicpath-path="KotoDashboard.tsx">
              {activeTab === 'prompts' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="96" data-magicpath-path="KotoDashboard.tsx">
                  {filteredPrompts.map(prompt => <motion.div key={prompt.id} layout initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} whileHover={{
                y: -4
              }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="97" data-magicpath-path="KotoDashboard.tsx">
                      {/* Cover Image */}
                      <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="98" data-magicpath-path="KotoDashboard.tsx">
                        {prompt.coverImage ? <img src={prompt.coverImage} alt={prompt.title} className="w-full h-full object-cover" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="coverImage:unknown" data-magicpath-id="99" data-magicpath-path="KotoDashboard.tsx" /> : <div className="flex items-center justify-center h-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="100" data-magicpath-path="KotoDashboard.tsx">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="101" data-magicpath-path="KotoDashboard.tsx">
                              <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="102" data-magicpath-path="KotoDashboard.tsx" />
                            </div>
                          </div>}
                        
                        {/* Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="103" data-magicpath-path="KotoDashboard.tsx">
                          <div className="flex space-x-2" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="104" data-magicpath-path="KotoDashboard.tsx">
                            <button className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="105" data-magicpath-path="KotoDashboard.tsx">
                              <Share2 className="w-4 h-4 text-slate-600" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="106" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                            <button className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="107" data-magicpath-path="KotoDashboard.tsx">
                              <Trash2 className="w-4 h-4 text-red-500" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="108" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="109" data-magicpath-path="KotoDashboard.tsx">
                        <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="110" data-magicpath-path="KotoDashboard.tsx">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="111" data-magicpath-path="KotoDashboard.tsx">
                            {prompt.title}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full ml-2 flex-shrink-0" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="model:unknown" data-magicpath-id="112" data-magicpath-path="KotoDashboard.tsx" style={{
                      display: "none"
                    }}>
                            {prompt.model}
                          </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="content:unknown" data-magicpath-id="113" data-magicpath-path="KotoDashboard.tsx">
                          {prompt.content}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="114" data-magicpath-path="KotoDashboard.tsx">
                          {prompt.tags.slice(0, 3).map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="115" data-magicpath-path="KotoDashboard.tsx">
                              {tag}
                            </span>)}
                          {prompt.tags.length > 3 && <span className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="116" data-magicpath-path="KotoDashboard.tsx">
                              +{prompt.tags.length - 3}
                            </span>}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="117" data-magicpath-path="KotoDashboard.tsx">
                          <span className="text-xs text-slate-500 dark:text-slate-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="118" data-magicpath-path="KotoDashboard.tsx">
                            {prompt.category}
                          </span>
                          <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="119" data-magicpath-path="KotoDashboard.tsx">
                            <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="120" data-magicpath-path="KotoDashboard.tsx" />
                          </button>
                        </div>
                      </div>
                    </motion.div>)}
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="121" data-magicpath-path="KotoDashboard.tsx">
                  {filteredTools.map(tool => <motion.div key={tool.id} layout initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} whileHover={{
                y: -4
              }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="122" data-magicpath-path="KotoDashboard.tsx">
                      {/* Tool Icon */}
                      <div className="relative h-32 bg-indigo-600 flex items-center justify-center" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="123" data-magicpath-path="KotoDashboard.tsx">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="124" data-magicpath-path="KotoDashboard.tsx">
                          <MessageSquare className="w-8 h-8 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="125" data-magicpath-path="KotoDashboard.tsx" />
                        </div>
                        
                        {/* Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="126" data-magicpath-path="KotoDashboard.tsx">
                          <div className="flex space-x-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="127" data-magicpath-path="KotoDashboard.tsx">
                            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="128" data-magicpath-path="KotoDashboard.tsx">
                              <ExternalLink className="w-4 h-4 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="129" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="130" data-magicpath-path="KotoDashboard.tsx">
                              <Trash2 className="w-4 h-4 text-white" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="131" data-magicpath-path="KotoDashboard.tsx" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="132" data-magicpath-path="KotoDashboard.tsx">
                        <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="133" data-magicpath-path="KotoDashboard.tsx">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="134" data-magicpath-path="KotoDashboard.tsx">
                            {tool.name}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="135" data-magicpath-path="KotoDashboard.tsx">
                            GPT-4
                          </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="136" data-magicpath-path="KotoDashboard.tsx">
                          Help me write engaging stories with vivid descriptions and compelling characters.
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="137" data-magicpath-path="KotoDashboard.tsx">
                          <span className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="138" data-magicpath-path="KotoDashboard.tsx">
                            AI Tools
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="139" data-magicpath-path="KotoDashboard.tsx">
                            LLM's
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="140" data-magicpath-path="KotoDashboard.tsx">
                          <span className="text-xs text-slate-500 dark:text-slate-400" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="141" data-magicpath-path="KotoDashboard.tsx">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>)}
                </div>}

              {/* Empty State */}
              {(activeTab === 'prompts' && filteredPrompts.length === 0 || activeTab === 'toolbox' && filteredTools.length === 0) && <div className="text-center py-12" data-magicpath-id="142" data-magicpath-path="KotoDashboard.tsx">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4" data-magicpath-id="143" data-magicpath-path="KotoDashboard.tsx">
                    {activeTab === 'prompts' ? <MessageSquare className="w-8 h-8 text-slate-400" data-magicpath-id="144" data-magicpath-path="KotoDashboard.tsx" /> : <Wrench className="w-8 h-8 text-slate-400" data-magicpath-id="145" data-magicpath-path="KotoDashboard.tsx" />}
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2" data-magicpath-id="146" data-magicpath-path="KotoDashboard.tsx">
                    No {activeTab === 'prompts' ? 'prompts' : 'tools'} found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6" data-magicpath-id="147" data-magicpath-path="KotoDashboard.tsx">
                    Try adjusting your search or create a new {activeTab === 'prompts' ? 'prompt' : 'tool'}
                  </p>
                  <motion.button onClick={() => activeTab === 'prompts' ? setShowNewPromptDialog(true) : setShowNewToolDialog(true)} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto transition-colors" data-magicpath-id="148" data-magicpath-path="KotoDashboard.tsx">
                    <Plus className="w-4 h-4" data-magicpath-id="149" data-magicpath-path="KotoDashboard.tsx" />
                    <span data-magicpath-id="150" data-magicpath-path="KotoDashboard.tsx">Add {activeTab === 'prompts' ? 'Prompt' : 'Tool'}</span>
                  </motion.button>
                </div>}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence data-magicpath-id="151" data-magicpath-path="KotoDashboard.tsx">
        {mobileMenuOpen && <motion.div className="fixed inset-0 bg-black/50 z-40 md:hidden" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setMobileMenuOpen(false)} data-magicpath-id="152" data-magicpath-path="KotoDashboard.tsx" />}
      </AnimatePresence>

      {/* Add Tag Dialog */}
      <AnimatePresence data-magicpath-id="153" data-magicpath-path="KotoDashboard.tsx">
        {showAddTagDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowAddTagDialog(false)} data-magicpath-id="154" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="155" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" data-magicpath-id="156" data-magicpath-path="KotoDashboard.tsx">Add New Tag</h2>
              
              <div className="space-y-4" data-magicpath-id="157" data-magicpath-path="KotoDashboard.tsx">
                <div data-magicpath-id="158" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" data-magicpath-id="159" data-magicpath-path="KotoDashboard.tsx">
                    Tag Name
                  </label>
                  <input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="Enter tag name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-magicpath-id="160" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="161" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowAddTagDialog(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" data-magicpath-id="162" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleAddTag} disabled={!newTagName.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors" data-magicpath-id="163" data-magicpath-path="KotoDashboard.tsx">
                    Add Tag
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;