"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus, MessageSquare, Wrench, ChevronLeft, Menu, Bell, User, Settings, HelpCircle, Sun, Moon, ExternalLink, Share2, Trash2, Copy, Palette, Code, Code2, Briefcase, PenTool, Target, Users, BarChart3, Zap, Globe, Figma, Cpu, Tag, X, Upload, Camera, Smile, Heart, Star, Coffee, Music, Book, BookOpen, Gamepad2, Laptop, Smartphone, Headphones, Car, Home, Plane, Gift, ShoppingBag, CreditCard, Mail, Phone, MapPin, Calendar, Clock, Eye, EyeOff, ChevronDown, ChevronRight, Edit2, LogOut, Check, Database, Shield, ShieldCheck, ShieldAlert, ShieldX, Server, Cloud, CloudSnow, CloudRain, Terminal, Package, Package2, PackageOpen, Layers, Workflow, GitBranch, Container, Boxes, Box, FileCode, FileCode2, Monitor, Tablet, Watch, Tv, Radio, Headset, Microphone, Video, Image, FileText, Folder, Archive, Download, Share, Lock, Unlock, Key, UserCheck, UserPlus, UserMinus, Users2, Team, Building, Building2, Factory, Store, Warehouse, Truck, Ship, Rocket, Satellite, Wifi, Bluetooth, Usb, HardDrive, MemoryStick, Disc, PlayCircle, PauseCircle, StopCircle, SkipForward, SkipBack, Volume2, VolumeX, Mic, MicOff, VideoOff, Scissors, Paintbrush, Paintbrush2, Brush, Pen, Pencil, Edit, Edit3, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough, List, ListOrdered, CheckSquare, Square, Circle, Triangle, Hexagon, Octagon, Diamond, Shapes, Grid, Layout, Sidebar, PanelLeft, PanelRight, PanelTop, PanelBottom, Maximize, Minimize, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Move, MousePointer, Hand, Grab, ZoomIn, ZoomOut, Focus, Scan, QrCode, Barcode, Hash, AtSign, Percent, DollarSign, Euro, PoundSterling, Bitcoin, TrendingUp, TrendingDown, Activity, Flame, Snowflake, CloudLightning, Umbrella, Rainbow, Thermometer, Wind, Compass, Map, Navigation, Route, Flag, Bookmark, Award, Medal, Trophy, Crown, Gem, Sparkles, Wand2, Puzzle, Gamepad, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Spade, Club, Cherry, Apple, Grape, Banana, Carrot, Wheat, Leaf, Trees, Flower, Flower2, Bug, Fish, Bird, Cat, Dog, Rabbit, Turtle, Snail, Worm, Microscope, Telescope, Atom, Dna, Pill, Syringe, Stethoscope, Bandage, Cross, Minus, Equal, Divide, Calculator, Binary, Infinity, Pi, Sigma, Variable, Parentheses, Brackets, Braces, Quote, Ampersand, Asterisk, Slash, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight, CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight, ChevronsUp, ChevronsDown, ChevronsLeft, ChevronsRight, MoreHorizontal, MoreVertical, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';
import PromptCard from './PromptCard';
import PromptDetailsModal from './PromptDetailsModal';
import Logo from '../Logo';
import supabase from '../../lib/supabaseClient';
import {
  fetchPrompts,
  fetchTools,
  createPrompt,
  createTool,
  updatePrompt,
  updateTool,
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
const iconOptions = [
  // Frontend Frameworks & Libraries
  { name: 'React', icon: Code },
  { name: 'Vue', icon: Zap },
  { name: 'Angular', icon: Target },
  { name: 'Svelte', icon: Zap },
  { name: 'Next.js', icon: Globe },
  { name: 'Nuxt.js', icon: Layers },
  { name: 'Gatsby', icon: Rocket },
  { name: 'Astro', icon: Star },
  
  // Backend & Runtime
  { name: 'Node.js', icon: Server },
  { name: 'Deno', icon: Terminal },
  { name: 'Express', icon: Route },
  { name: 'Fastify', icon: Zap },
  { name: 'NestJS', icon: Boxes },
  { name: 'Koa', icon: Workflow },
  
  // Programming Languages
  { name: 'JavaScript', icon: FileCode },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Python', icon: FileCode2 },
  { name: 'Java', icon: Coffee },
  { name: 'C#', icon: Hash },
  { name: 'Go', icon: Activity },
  { name: 'Rust', icon: Cpu },
  { name: 'PHP', icon: FileCode },
  { name: 'Ruby', icon: Gem },
  { name: 'Swift', icon: Smartphone },
  { name: 'Kotlin', icon: Smartphone },
  { name: 'Dart', icon: Target },
  { name: 'C++', icon: Cpu },
  { name: 'C', icon: Terminal },
  
  // Databases
  { name: 'PostgreSQL', icon: Database },
  { name: 'MySQL', icon: HardDrive },
  { name: 'MongoDB', icon: Leaf },
  { name: 'Redis', icon: MemoryStick },
  { name: 'SQLite', icon: Archive },
  { name: 'Supabase', icon: Database },
  { name: 'Firebase', icon: Flame },
  { name: 'PlanetScale', icon: Globe },
  
  // Cloud & DevOps
  { name: 'AWS', icon: Cloud },
  { name: 'Azure', icon: CloudSnow },
  { name: 'GCP', icon: CloudRain },
  { name: 'Vercel', icon: Triangle },
  { name: 'Netlify', icon: Globe },
  { name: 'Docker', icon: Container },
  { name: 'Kubernetes', icon: Boxes },
  { name: 'Terraform', icon: Building },
  { name: 'Jenkins', icon: Workflow },
  { name: 'GitHub Actions', icon: GitBranch },
  
  // Mobile Development
  { name: 'React Native', icon: Smartphone },
  { name: 'Flutter', icon: Tablet },
  { name: 'Ionic', icon: Phone },
  { name: 'Xamarin', icon: Smartphone },
  { name: 'Cordova', icon: Smartphone },
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
  { name: 'ESLint', icon: Shield },
  { name: 'Prettier', icon: Brush },
  
  // AI & Machine Learning
  { name: 'TensorFlow', icon: Cpu },
  { name: 'PyTorch', icon: Flame },
  { name: 'OpenAI', icon: Sparkles },
  { name: 'Hugging Face', icon: Heart },
  { name: 'Jupyter', icon: Book },
  { name: 'Pandas', icon: BarChart3 },
  { name: 'NumPy', icon: Calculator },
  
  // Blockchain & Web3
  { name: 'Ethereum', icon: Diamond },
  { name: 'Solidity', icon: FileCode },
  { name: 'Web3.js', icon: Link },
  { name: 'Hardhat', icon: Wrench },
  { name: 'Truffle', icon: Package },
  { name: 'MetaMask', icon: CreditCard },
  
  // Gaming
  { name: 'Unity', icon: Gamepad2 },
  { name: 'Unreal Engine', icon: Gamepad },
  { name: 'Godot', icon: Gamepad2 },
  { name: 'Three.js', icon: Box },
  { name: 'Babylon.js', icon: Boxes },
  
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
  { name: 'Food & Beverage', icon: Coffee },
  { name: 'Real Estate', icon: Building },
  { name: 'Automotive', icon: Car },
  { name: 'IoT', icon: Wifi },
  { name: 'Logistics', icon: Truck },
  { name: 'Agriculture', icon: Leaf },
  
  // Project Types
  { name: 'Web App', icon: Globe },
  { name: 'Mobile App', icon: Smartphone },
  { name: 'Desktop App', icon: Monitor },
  { name: 'API Service', icon: Server },
  { name: 'Library', icon: Package },
  { name: 'CLI Tool', icon: Terminal },
  { name: 'Plugin', icon: Puzzle },
  { name: 'Theme', icon: Palette },
  { name: 'Template', icon: Layout },
  { name: 'Boilerplate', icon: FileCode },
  
  // Tools & Utilities
  { name: 'Webpack', icon: Package },
  { name: 'Vite', icon: Zap },
  { name: 'Rollup', icon: Package2 },
  { name: 'Parcel', icon: PackageOpen },
  { name: 'Babel', icon: Code },
  { name: 'PostCSS', icon: Brush },
  { name: 'Sass', icon: Palette },
  { name: 'Less', icon: Paintbrush2 },
  { name: 'Stylus', icon: Pen },
  
  // Analytics & Monitoring
  { name: 'Google Analytics', icon: BarChart3 },
  { name: 'Mixpanel', icon: Activity },
  { name: 'Amplitude', icon: TrendingUp },
  { name: 'Sentry', icon: Shield },
  { name: 'LogRocket', icon: Video },
  { name: 'Datadog', icon: Monitor },
  
  // Communication & Collaboration
  { name: 'Slack', icon: MessageSquare },
  { name: 'Discord', icon: Users },
  { name: 'Teams', icon: Users2 },
  { name: 'Zoom', icon: Video },
  { name: 'Notion', icon: FileText },
  { name: 'Confluence', icon: BookOpen },
  
  // Productivity
  { name: 'Productivity', icon: Calendar },
  { name: 'Task Management', icon: CheckSquare },
  { name: 'Time Tracking', icon: Clock },
  { name: 'Project Management', icon: Briefcase },
  { name: 'Documentation', icon: FileText },
  { name: 'Knowledge Base', icon: Book },
  
  // Security
  { name: 'Security', icon: Shield },
  { name: 'Authentication', icon: Key },
  { name: 'Authorization', icon: Lock },
  { name: 'Encryption', icon: ShieldCheck },
  { name: 'VPN', icon: ShieldAlert },
  { name: 'Firewall', icon: ShieldX },
  
  // Generic/Fallback
  { name: 'Frontend', icon: Monitor },
  { name: 'Backend', icon: Server },
  { name: 'Full Stack', icon: Layers },
  { name: 'DevOps', icon: Wrench },
  { name: 'Design', icon: Palette },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Other', icon: Package }
] as any[];
const KotoDashboard: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
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
  const [showProjectSettingsDialog, setShowProjectSettingsDialog] = useState(false);
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [editingProjectName, setEditingProjectName] = useState('');
  const [editingProjectIcon, setEditingProjectIcon] = useState<any>(null);
  
  // New simple edit modal state
  const [showSimpleEditModal, setShowSimpleEditModal] = useState(false);
  const [simpleEditName, setSimpleEditName] = useState('');
  const [simpleEditIcon, setSimpleEditIcon] = useState<any>(null);
  
  // Debug useEffect to monitor modal state changes
  React.useEffect(() => {
    console.log('DEBUG: showSimpleEditModal state changed to:', showSimpleEditModal);
  }, [showSimpleEditModal]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
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
  const [customModelName, setCustomModelName] = useState('');
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
  const [returnToToolDialog, setReturnToToolDialog] = useState(false);

  // Settings state
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
  const [categories, setCategories] = useState<Category[]>(() => {
    // Load categories from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koto_categories');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Restore icon references from iconOptions
          return parsed.map((cat: any) => ({
            ...cat,
            icon: iconOptions.find(opt => opt.name === cat.iconName)?.icon || Globe
          }));
        } catch (e) {
          console.warn('Failed to parse saved categories:', e);
        }
      }
    }
    return [{
      id: 'all',
      name: 'All',
      count: 0,
      icon: Globe,
      expanded: false
    }];
  });

  // Missing state variables
  const [subcategories, setSubcategories] = useState<Subcategory[]>(() => {
    // Load subcategories from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koto_subcategories');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved subcategories:', e);
        }
      }
    }
    return [];
  });
  const [toolCategories, setToolCategories] = useState<Category[]>(() => {
    // Load tool categories from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koto_tool_categories');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Restore icon references from iconOptions
          return parsed.map((cat: any) => ({
            ...cat,
            icon: iconOptions.find(opt => opt.name === cat.iconName)?.icon || Globe
          }));
        } catch (e) {
          console.warn('Failed to parse saved tool categories:', e);
        }
      }
    }
    return [{
      id: 'all-tools',
      name: 'All Tools',
      count: 0,
      icon: Globe,
      expanded: false
    }];
  });

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
  // Theme is now managed by ThemeContext

  // Auto-switch activeCategory when tab changes
  useEffect(() => {
    if (activeTab === 'prompts' && activeCategory === 'all-tools') {
      setActiveCategory('all');
    } else if (activeTab === 'toolbox' && activeCategory === 'all') {
      setActiveCategory('all-tools');
    }
  }, [activeTab, activeCategory]);

  // Auth subscription and initial load
  useEffect(() => {
    const sub = onAuthChange((u) => {
      setUser(u);
    });
    return () => {
      // best-effort cleanup for supabase v2 subscription wrapper
      try { (sub as any)?.data?.subscription?.unsubscribe?.(); } catch {}
    };
  }, []);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setPrompts([]);
        setTools([]);
        return;
      }

      try {
        const [promptRows, toolRows] = await Promise.all([
          fetchPrompts(user.id), 
          fetchTools(user.id)
        ]);
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
  }, [user]);

  // Drag and drop handlers
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  
  const handleDragStart = (e: React.DragEvent, type: 'prompt' | 'tool', item: Prompt | Tool) => {
    setDraggedItem({
      type,
      item
    });
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = () => {
    // Clear dragged item and any visual feedback when drag ends
    setDraggedItem(null);
    setDragOverTarget(null);
  };
  
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(targetId);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTarget(null);
  };
  
  const handleDrop = async (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // Check if target is a main category or subcategory
    const targetCategory = activeTab === 'prompts' ? updatedCategories.find(cat => cat.id === targetCategoryId) : updatedToolCategories.find(cat => cat.id === targetCategoryId);
    const targetSubcategory = subcategories.find(sub => sub.id === targetCategoryId);
    
    if ((!targetCategory && !targetSubcategory) || targetCategoryId === 'all' || targetCategoryId === 'all-tools') {
      setDraggedItem(null);
      return;
    }
    
    if (draggedItem.type === 'prompt' && activeTab === 'prompts') {
      const newCategory = targetCategory ? targetCategory.name : targetSubcategory?.parentId ? updatedCategories.find(cat => cat.id === targetSubcategory.parentId)?.name || draggedItem.item.category : draggedItem.item.category;
      const newSubcategory = targetSubcategory ? targetSubcategory.id : undefined;
      
      // Update local state
      setPrompts(prev => prev.map(p => p.id === draggedItem.item.id ? {
        ...p,
        category: newCategory,
        subcategory: newSubcategory
      } : p));
      
      // Update database
      try {
        await updatePrompt(draggedItem.item.id, {
          category: newCategory,
          subcategory: newSubcategory
        });
      } catch (error) {
        console.error('Failed to update prompt in database:', error);
        toast.error('Failed to save changes to database');
        // Revert local state on error
        setPrompts(prev => prev.map(p => p.id === (draggedItem.item as Prompt).id ? draggedItem.item as Prompt : p));
      }
    } else if (draggedItem.type === 'tool' && activeTab === 'toolbox') {
      const newCategory = targetCategory ? targetCategory.name : targetSubcategory?.parentId ? updatedToolCategories.find(cat => cat.id === targetSubcategory.parentId)?.name || draggedItem.item.category : draggedItem.item.category;
      const newSubcategory = targetSubcategory ? targetSubcategory.id : undefined;
      
      // Update local state
      setTools(prev => prev.map(t => t.id === draggedItem.item.id ? {
        ...t,
        category: newCategory,
        subcategory: newSubcategory
      } : t));
      
      // Update database
      try {
        await updateTool(draggedItem.item.id, {
          category: newCategory,
          subcategory: newSubcategory
        });
      } catch (error) {
        console.error('Failed to update tool in database:', error);
        toast.error('Failed to save changes to database');
        // Revert local state on error
        setTools(prev => prev.map(t => t.id === draggedItem.item.id ? draggedItem.item as Tool : t));
      }
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
      setCategories(prev => {
        const updated = [...prev, newCategory];
        // Save to localStorage with icon name for serialization
        const serializable = updated.map(cat => ({
          ...cat,
          iconName: iconOptions.find(opt => opt.icon === cat.icon)?.name || 'Globe'
        }));
        localStorage.setItem('koto_categories', JSON.stringify(serializable));
        return updated;
      });
    } else {
      setToolCategories(prev => {
        const updated = [...prev, newCategory];
        // Save to localStorage with icon name for serialization
        const serializable = updated.map(cat => ({
          ...cat,
          iconName: iconOptions.find(opt => opt.icon === cat.icon)?.name || 'Globe'
        }));
        localStorage.setItem('koto_tool_categories', JSON.stringify(serializable));
        return updated;
      });
    }

    // Add subcategories (only for prompts)
    if (activeTab === 'prompts') {
      const newSubcats = newProjectSubcategories.map(subcat => ({
        id: `${newCategory.id}-${subcat.toLowerCase().replace(/\s+/g, '-')}`,
        name: subcat,
        parentId: newCategory.id,
        count: 0,
      }));
      setSubcategories(prev => {
        const updated = [...prev, ...newSubcats];
        localStorage.setItem('koto_subcategories', JSON.stringify(updated));
        return updated;
      });
    }

    // Set the new project as active category
    setActiveCategory(newCategory.id);

    // If returning to tool dialog, set the new category and reopen tool dialog
    if (returnToToolDialog) {
      setNewToolCategory(newCategory.name);
      setReturnToToolDialog(false);
      setShowAddProjectDialog(false);
      setShowNewToolDialog(true);
    } else {
      setShowAddProjectDialog(false);
    }

    // Reset form
    setNewProjectName('');
    setSelectedIcon(iconOptions[0]);
    setNewProjectTags([]);
    setNewProjectSubcategories([]);
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
    
    // Require authentication
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
        model: newPromptModel === 'Custom' ? customModelName : newPromptModel,
        tags: newPromptTags,
        category: promptCategory,
        subcategory: promptSubcategory,
        cover_image: coverUrl || undefined,
      }, user.id);
      
      if (created) {
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
      }
    } catch (e) {
      console.error('Failed to create prompt', e);
    }

    // Reset form
    setNewPromptTitle('');
    setNewPromptContent('');
    setNewPromptModel('GPT-4');
    setCustomModelName('');
    setNewPromptTags([]);
    setNewPromptCoverImage('');
    setNewPromptCoverFile(null);
    setShowNewPromptDialog(false);
  };
  const handleCreateTool = async () => {
    if (!newToolName.trim() || !newToolUrl.trim()) return;
    
    // Require authentication
    if (!user?.id) {
      console.warn('You must be signed in to create tools.');
      setShowProfileMenu(true);
      return;
    }
    
    try {
      const created = await createTool({
        name: newToolName,
        url: newToolUrl,
        description: newToolDescription || undefined,
        favicon: toolFavicon || undefined,
        category: (newToolCategory || (activeCategory === 'all-tools' ? 'General' : getCurrentCategoryName())) || 'General',
      }, user.id);
      
      if (created) {
        const mapped: Tool = {
          id: created.id,
          name: created.name,
          url: created.url,
          description: created.description || undefined,
          favicon: created.favicon || undefined,
          category: created.category || 'General',
        };
        setTools(prev => [mapped, ...prev]);
      }
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

  // Handle clipboard paste for cover images
  const handleClipboardPaste = async (event: ClipboardEvent) => {
    // Only handle paste when the new prompt modal is open
    if (!showNewPromptDialog) return;
    
    const items = event.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          setNewPromptCoverFile(file);
          // preview locally
          const reader = new FileReader();
          reader.onload = e => setNewPromptCoverImage(e.target?.result as string);
          reader.readAsDataURL(file);
          
          // Show success toast
          toast.success('Image pasted as cover image!', {
            description: 'The image from your clipboard has been set as the cover image.'
          });
          break;
        }
      }
    }
  };

  // Add clipboard event listener when modal is open
  React.useEffect(() => {
    if (showNewPromptDialog) {
      document.addEventListener('paste', handleClipboardPaste);
      return () => {
        document.removeEventListener('paste', handleClipboardPaste);
      };
    }
  }, [showNewPromptDialog]);
  const handleDoubleClick = (itemId: string, currentName: string) => {
    setEditingItem(itemId);
    setEditingName(currentName);
  };
  const handleRename = (itemId: string, type: 'category' | 'subcategory') => {
    if (!editingName.trim()) return;
    if (type === 'category') {
      if (activeTab === 'prompts') {
        setCategories(prev => {
          const updated = prev.map(cat => cat.id === itemId ? {
            ...cat,
            name: editingName.trim()
          } : cat);
          // Save to localStorage
          const serializedCategories = updated.map(cat => ({
            ...cat,
            icon: cat.icon.name || 'FolderOpen'
          }));
          localStorage.setItem('koto_categories', JSON.stringify(serializedCategories));
          return updated;
        });
      } else {
        setToolCategories(prev => {
          const updated = prev.map(cat => cat.id === itemId ? {
            ...cat,
            name: editingName.trim()
          } : cat);
          // Save to localStorage
          const serializedToolCategories = updated.map(cat => ({
            ...cat,
            icon: cat.icon.name || 'Wrench'
          }));
          localStorage.setItem('koto_tool_categories', JSON.stringify(serializedToolCategories));
          return updated;
        });
      }
    } else {
      setSubcategories(prev => {
        const updated = prev.map(sub => sub.id === itemId ? {
          ...sub,
          name: editingName.trim()
        } : sub);
        // Save to localStorage
        localStorage.setItem('koto_subcategories', JSON.stringify(updated));
        return updated;
      });
    }
    setEditingItem(null);
    setEditingName('');
  };
  const handleAddSubcategoryToProject = (parentId: string) => {
    // Create a new subcategory with a default name based on active tab
    const subcatName = activeTab === 'prompts' ? 'New subproject' : 'New substack';
    // Generate unique ID using timestamp to avoid conflicts
    const uniqueId = `${parentId}-${subcatName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newSubcat: Subcategory = {
      id: uniqueId,
      name: subcatName,
      parentId: parentId,
      count: 0,
    };
    setSubcategories(prev => {
      const updated = [...prev, newSubcat];
      // Save to localStorage
      localStorage.setItem('koto_subcategories', JSON.stringify(updated));
      return updated;
    });

    // Also expand the parent category to show the new subcategory
    if (activeTab === 'prompts') {
      setCategories(prev => {
        const updated = prev.map(cat => cat.id === parentId ? {
          ...cat,
          expanded: true
        } : cat);
        // Save to localStorage
        const serializedCategories = updated.map(cat => ({
          ...cat,
          icon: cat.icon.name || 'FolderOpen'
        }));
        localStorage.setItem('koto_categories', JSON.stringify(serializedCategories));
        return updated;
      });
    } else {
      setToolCategories(prev => {
        const updated = prev.map(cat => cat.id === parentId ? {
          ...cat,
          expanded: true
        } : cat);
        // Save to localStorage
        const serializedToolCategories = updated.map(cat => ({
          ...cat,
          icon: cat.icon.name || 'Wrench'
        }));
        localStorage.setItem('koto_tool_categories', JSON.stringify(serializedToolCategories));
        return updated;
      });
    }

    // Automatically start editing the newly created subcategory
    setTimeout(() => {
      setEditingItem(uniqueId);
      setEditingName(subcatName);
    }, 100); // Small delay to ensure the DOM is updated
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
        
        // AI Tools
        if (url.includes('openai.com') || url.includes('chatgpt')) {
          description = 'Advanced AI language model for conversations, writing, and problem-solving.';
        } else if (url.includes('claude.ai') || url.includes('anthropic')) {
          description = 'AI assistant by Anthropic for helpful, harmless, and honest conversations.';
        } else if (url.includes('midjourney.com')) {
          description = 'AI-powered image generation tool for creating stunning artwork and designs.';
        } else if (url.includes('runway.ml') || url.includes('runwayml.com')) {
          description = 'AI-powered creative tools for video editing, image generation, and content creation.';
        } else if (url.includes('stability.ai') || url.includes('stablediffusion')) {
          description = 'Open-source AI model for generating images from text descriptions.';
        } else if (url.includes('huggingface.co')) {
          description = 'Platform for machine learning models, datasets, and AI applications.';
        } 
        // Design Tools
        else if (url.includes('figma.com')) {
          description = 'Collaborative interface design tool for creating user interfaces and prototypes.';
        } else if (url.includes('canva.com')) {
          description = 'Graphic design platform for creating visual content and presentations.';
        } else if (url.includes('sketch.com')) {
          description = 'Digital design toolkit for creating user interfaces and experiences.';
        } else if (url.includes('adobe.com')) {
          description = 'Creative software suite for design, photography, and digital content creation.';
        } 
        // Development Tools
        else if (url.includes('github.com')) {
          description = 'Version control and collaboration platform for software development.';
        } else if (url.includes('vercel.com')) {
          description = 'Platform for frontend frameworks and static sites deployment.';
        } else if (url.includes('netlify.com')) {
          description = 'Web development platform for building and deploying modern websites.';
        } else if (url.includes('heroku.com')) {
          description = 'Cloud platform for building, running, and scaling applications.';
        } else if (url.includes('aws.amazon.com')) {
          description = 'Amazon Web Services cloud computing platform and infrastructure.';
        } 
        // Productivity Tools
        else if (url.includes('notion.so')) {
          description = 'All-in-one workspace for notes, docs, and project management.';
        } else if (url.includes('linear.app')) {
          description = 'Modern issue tracking and project management for software teams.';
        } else if (url.includes('slack.com')) {
          description = 'Team communication and collaboration platform for workspaces.';
        } else if (url.includes('trello.com')) {
          description = 'Visual project management tool using boards, lists, and cards.';
        } else if (url.includes('asana.com')) {
          description = 'Work management platform for teams to organize and track projects.';
        } else if (url.includes('airtable.com')) {
          description = 'Cloud collaboration service that combines spreadsheet and database functionality.';
        } 
        // Analytics & Marketing
        else if (url.includes('google.com/analytics')) {
          description = 'Web analytics service for tracking and reporting website traffic.';
        } else if (url.includes('mailchimp.com')) {
          description = 'Email marketing platform for creating and managing campaigns.';
        } else if (url.includes('hubspot.com')) {
          description = 'Customer relationship management and marketing automation platform.';
        } 
        // Communication & Video
        else if (url.includes('zoom.us')) {
          description = 'Video conferencing and online meeting platform.';
        } else if (url.includes('discord.com')) {
          description = 'Voice, video, and text communication platform for communities.';
        } else if (url.includes('loom.com')) {
          description = 'Screen recording and video messaging tool for async communication.';
        } 
        // Fallback: Extract meaningful description from domain
        else {
          try {
            const domain = urlObj.hostname.replace('www.', '').replace('app.', '');
            const siteName = domain.split('.')[0];
            const capitalizedName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
            description = `${capitalizedName} - A useful tool for productivity and workflow enhancement.`;
          } catch {
            description = 'A useful tool for productivity and workflow enhancement.';
          }
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
  const handleSharePrompt = async (prompt: Prompt) => {
    if (!user?.id) return;
    
    try {
      const { sharePrompt } = await import('../../lib/data');
      const shareToken = await sharePrompt(prompt.id);
      if (shareToken) {
        const shareUrl = `${window.location.origin}/shared/prompt?token=${shareToken}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!', {
          description: 'Anyone with this link can view your prompt',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to share prompt:', error);
      toast.error('Failed to share prompt', {
        description: 'Please try again later',
        duration: 3000,
      });
    }
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
          description: editedTool.description ?? undefined,
          favicon: editedTool.favicon ?? undefined,
          category: editedTool.category,
        });
        setTools(prev => prev.map(t => t.id === tool.id ? {
          id: updated.id,
          name: updated.name,
          url: updated.url,
          description: updated.description ?? undefined,
          favicon: updated.favicon ?? undefined,
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
    const handleShare = async () => {
      if (!user?.id) return;
      
      try {
        const { shareTool } = await import('../../lib/data');
        const shareToken = await shareTool(tool.id);
        if (shareToken) {
          const shareUrl = `${window.location.origin}/shared/tool?token=${shareToken}`;
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Share link copied to clipboard!', {
            description: 'Anyone with this link can view your tool',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Failed to share tool:', error);
        toast.error('Failed to share tool', {
          description: 'Please try again later',
          duration: 3000,
        });
      }
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




        {/* Project/Stack Settings Dialog */}
        {showProjectSettingsDialog && (
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowProjectSettingsDialog(false)}
          >
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Edit {activeTab === 'toolbox' ? 'Stack' : 'Project'}
                </h2>
                <button 
                  onClick={() => setShowProjectSettingsDialog(false)} 
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Name
                  </label>
                  <input
                     type="text"
                     value={editingProjectName}
                     onChange={(e) => setEditingProjectName(e.target.value)}
                     className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     placeholder={`Enter ${activeTab === 'toolbox' ? 'stack' : 'project'} name`}
                   />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                     {[Code, Database, Globe, Palette, Settings, Star, Heart, Zap, Shield, Camera].map((IconComponent, index) => (
                       <button
                         key={index}
                         onClick={() => setEditingProjectIcon(IconComponent)}
                         className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center ${
                           editingProjectIcon === IconComponent 
                             ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                             : 'border-slate-200 dark:border-slate-600 hover:border-indigo-500'
                         }`}
                       >
                         <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                       </button>
                     ))}
                   </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setShowProjectSettingsDialog(false)} 
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                   onClick={async () => {
                     try {
                       // Find the current category
                       const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
                       const categoryIndex = categoryList.findIndex(cat => cat.id === activeCategory);
                       
                       if (categoryIndex !== -1) {
                         // Update the category
                         const updatedCategory = {
                           ...categoryList[categoryIndex],
                           name: editingProjectName,
                           icon: editingProjectIcon
                         };
                         
                         // Update the categories array
                         const newCategories = [...categoryList];
                         newCategories[categoryIndex] = updatedCategory;
                         
                         // Update the state
                         if (activeTab === 'prompts') {
                           setCategories(newCategories);
                         } else {
                           setToolCategories(newCategories);
                         }
                         
                         // Save to localStorage for persistence
                         localStorage.setItem(
                           activeTab === 'prompts' ? 'koto_prompt_categories' : 'koto_tool_categories',
                           JSON.stringify(newCategories)
                         );
                         
                         toast.success(`${activeTab === 'toolbox' ? 'Stack' : 'Project'} updated successfully!`);
                         setShowProjectSettingsDialog(false);
                       }
                     } catch (error) {
                       console.error('Error updating project:', error);
                       toast.error('Failed to update project. Please try again.');
                     }
                   }}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                 >
                   Save Changes
                 </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>;
  };
  // Authentication Guard
  if (!user) {
    return (
      <div className={`h-screen w-full ${actualTheme === 'dark' ? 'dark' : ''} bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center transition-colors duration-300`} style={{
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Koto</h1>
            <p className="text-white/80">Sign in to access your personal workspace</p>
          </div>
          
          <div className="space-y-4">
            <motion.button
              onClick={() => {
                signInWithGitHub().catch(err => console.error('GitHub sign-in error:', err));
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
              onClick={() => {
                signInWithGoogle().catch(err => console.error('Google sign-in error:', err));
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
    <div className={`h-screen w-full ${actualTheme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-slate-900 flex overflow-hidden transition-colors duration-300`} style={{
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
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <Logo size="custom-40" className="text-indigo-500" />
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
                  <button onClick={() => setActiveCategory(activeTab === 'prompts' ? 'all' : 'all-tools')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors max-w-[247px] ${(activeTab === 'prompts' && activeCategory === 'all') || (activeTab === 'toolbox' && activeCategory === 'all-tools') ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
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
                        <button onClick={() => setActiveCategory(category.id)} onDoubleClick={() => handleDoubleClick(category.id, category.name)} onDragOver={(e: React.DragEvent) => handleDragOver(e, category.id)} onDragLeave={handleDragLeave} onDrop={(e: React.DragEvent) => handleDrop(e, category.id)} className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative max-w-[247px] ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'} ${draggedItem && dragOverTarget === category.id ? 'shadow-lg transform -translate-y-1' : ''}`}>
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
                                  <div onClick={e => {
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
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all cursor-pointer">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </div>
                                  
                                  {/* Add subcategory button */}
                                  <div onClick={e => {
                              e.stopPropagation();
                              handleAddSubcategoryToProject(category.id);
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all cursor-pointer">
                                    <Plus className="w-4 h-4 text-slate-400" />
                                  </div>
                                  
                                  {/* Expand/collapse button for subcategories - always show if has subcategories or on hover */}
                                  {(hasSubcategories || category.expanded) && <div onClick={e => {
                              e.stopPropagation();
                              toggleCategoryExpansion(category.id);
                            }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer">
                                      {category.expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                    </div>}
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
                        return <button key={subcategory.id} onClick={() => setActiveCategory(subcategory.id)} onDoubleClick={() => handleDoubleClick(subcategory.id, subcategory.name)} onDragOver={(e: React.DragEvent) => handleDragOver(e, subcategory.id)} onDragLeave={handleDragLeave} onDrop={(e: React.DragEvent) => handleDrop(e, subcategory.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group max-w-[247px] ${activeCategory === subcategory.id ? 'bg-slate-700 dark:bg-slate-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'} ${draggedItem && dragOverTarget === subcategory.id ? 'shadow-lg transform -translate-y-1' : ''}`}>
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
                            <div onClick={e => {
                              e.stopPropagation();
                              setSubcategories(prev => prev.filter(sub => sub.id !== subcategory.id));
                              // Reset to parent category if deleting active subcategory
                              if (activeCategory === subcategory.id) {
                                setActiveCategory(subcategory.parentId);
                              }
                            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all cursor-pointer">
                              <Trash2 className="w-3 h-3 text-red-500" />
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
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
              <button onClick={() => setShowSettingsDialog(true)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium text-sm">Settings</span>}
              </button>
              <button onClick={() => {
                const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
                setTheme(nextTheme);
              }} className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                {theme === 'light' ? <Sun className="w-5 h-5 flex-shrink-0" /> : theme === 'dark' ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Settings className="w-5 h-5 flex-shrink-0" />}
                {!sidebarCollapsed && <span className="font-medium text-sm">{theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}</span>}
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
          <div className="relative h-64 overflow-hidden" style={{
          backgroundImage: backgroundImage ? `url('${backgroundImage}')` : `url('/koto-background-image.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
            
            {/* Unified Header Row moved inside content container below */}

            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white flex flex-col items-center justify-center w-full max-w-4xl p-0" style={{
              display: "flex",
              width: "96%",
              maxWidth: "96%"
            }}>
                {/* Header Row inside container: Logo, Tabs (left) and Login (right) */}
                <div className="w-full flex items-stretch justify-between mb-6 h-14">
                  {/* Tabs */}
                  <div className="flex items-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-1 inline-flex h-full" style={{ display: 'flex', alignItems: 'center' }}>
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
                          {user && (
                            <>
                              <button onClick={() => { window.location.href = '/settings/profile'; setShowProfileMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>Profile Settings</span>
                              </button>
                              <hr className="my-2 border-slate-200 dark:border-slate-700" />
                            </>
                          )}
                          <button onClick={() => setShowSettingsDialog(true)} className="w-full px-4 py-1 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <span>App Settings</span>
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
                    <div className="flex items-center space-x-3 group">
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
                      {/* Edit icon - conditional rendering restored */}
                      {(activeTab === 'prompts' || activeTab === 'toolbox') && activeCategory && activeCategory !== 'all' && activeCategory !== 'all-tools' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('DEBUG: Edit button clicked!');
                            console.log('DEBUG: activeTab:', activeTab);
                            console.log('DEBUG: activeCategory:', activeCategory);
                            
                            // Initialize simple edit modal state with current values
                            const categoryName = getCurrentCategoryName();
                            console.log('DEBUG: Setting name to:', categoryName);
                            setSimpleEditName(categoryName);
                            
                            const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
                            console.log('DEBUG: Available categories:', categoryList.map(cat => ({ id: cat.id, name: cat.name })));
                            console.log('DEBUG: Looking for category with ID:', activeCategory);
                            const category = categoryList.find(cat => cat.id === activeCategory);
                            console.log('DEBUG: Found category:', category);
                            
                            // Always set a fallback icon first (use icon name, not component)
                            console.log('DEBUG: Setting fallback icon first');
                            const fallbackIconName = iconOptions.find(opt => opt.icon === iconOptions[0].icon)?.name || '🎨';
                            setSimpleEditIcon(fallbackIconName);
                            
                            if (category && category.icon) {
                              console.log('DEBUG: Found category icon, overriding fallback:', category.icon);
                              // Find the icon name from iconOptions or use emoji fallback
                              const iconName = iconOptions.find(opt => opt.icon === category.icon)?.name || '🎨';
                              setSimpleEditIcon(iconName);
                            } else {
                              console.log('DEBUG: No category icon found, keeping fallback');
                            }
                            
                            console.log('DEBUG: Opening simple edit modal');
                            console.log('DEBUG: iconOptions[0].icon:', iconOptions[0].icon);
                            
                            // Force state update in next tick to avoid batching issues
                            setTimeout(() => {
                              console.log('DEBUG: Setting modal state to true in setTimeout');
                              setShowSimpleEditModal(true);
                            }, 0);
                            
                            console.log('DEBUG: Modal state set to true (queued)');
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 cursor-pointer ml-2"
                          title={`Edit ${activeTab === 'toolbox' ? 'Stack' : 'Project'}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
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
                  {activeTab === 'prompts' ? filteredPrompts.map(prompt => <div key={prompt.id} className="justify-self-start w-full h-full" draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, 'prompt', prompt)} onDragEnd={handleDragEnd}>
                          <PromptCard title={prompt.title} description={prompt.content} tags={prompt.tags} model={prompt.model} coverImage={prompt.coverImage} onClick={() => handlePromptClick(prompt)} />
                        </div>) : filteredTools.map(tool => <div key={tool.id} className="justify-self-start w-full h-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200 hover:scale-102 hover:-translate-y-1" draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, 'tool', tool)} onDragEnd={handleDragEnd} onClick={() => handleToolClick(tool)}>
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
                  
                  {/* Icon Search */}
                  <div className="mb-3">
                    <input
                      type="text"
                      value={iconSearchQuery}
                      onChange={(e) => setIconSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                      placeholder="Search icons..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800">
                    {iconOptions
                      .filter(option => 
                        option.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
                      )
                      .map(option => {
                        const IconComponent = option.icon;
                        return (
                          <button 
                            key={option.name} 
                            onClick={() => setSelectedIcon(option)} 
                            className={`p-2 rounded-lg border-2 transition-colors hover:scale-105 ${
                              selectedIcon.name === option.name 
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                            }`}
                            title={option.name}
                          >
                            <IconComponent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          </button>
                        );
                      })
                    }
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
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Model
                  </label>
                  <select value={newPromptModel} onChange={e => setNewPromptModel(e.target.value)} className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white appearance-none">
                    <option value="GPT-4">GPT-4</option>
                    <option value="GPT-4 Turbo">GPT-4 Turbo</option>
                    <option value="Claude-3.5 Sonnet">Claude-3.5 Sonnet</option>
                    <option value="Claude-3 Opus">Claude-3 Opus</option>
                    <option value="Gemini Pro">Gemini Pro</option>
                    <option value="Llama 3.1">Llama 3.1</option>
                    <option value="Midjourney">Midjourney</option>
                    <option value="DALL-E 3">DALL-E 3</option>
                    <option value="Custom">Custom Model...</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-3 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                
                {/* Custom Model Input */}
                {newPromptModel === 'Custom' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Custom Model Name
                    </label>
                    <input
                      type="text"
                      value={customModelName}
                      onChange={e => setCustomModelName(e.target.value)}
                      placeholder="Enter custom model name (e.g., GPT-5, Custom-LLM)"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                )}

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
                        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          or paste an image from clipboard (Ctrl+V)
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
                    <div className="relative">
                      <select value={newToolCategory} onChange={e => setNewToolCategory(e.target.value)} className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white appearance-none">
                        <option value="">Select a stack</option>
                        {updatedToolCategories.filter(cat => cat.id !== 'all-tools').map(category => <option key={category.id} value={category.name}>
                            {category.name}
                          </option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    
                    <button onClick={() => {
                  setReturnToToolDialog(true);
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
                  setTheme('light');
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${theme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}>
                      <Sun className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Light</div>
                    </button>
                    <button onClick={() => {
                  setTheme('dark');
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${theme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}>
                      <Moon className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark</div>
                    </button>
                    <button onClick={() => {
                  setTheme('system');
                }} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${theme === 'system' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}>
                      <Settings className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">System</div>
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

      {/* Simple Edit Modal */}
      <AnimatePresence>
        {showSimpleEditModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSimpleEditModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Edit {activeTab === 'toolbox' ? 'Stack' : 'Project'}
                </h2>
                <button
                  onClick={() => setShowSimpleEditModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={simpleEditName}
                    onChange={(e) => setSimpleEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Icon
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        {simpleEditIcon ? (
                          (() => {
                            // Check if it's an icon name from iconOptions
                            const iconOption = iconOptions.find(opt => opt.name === simpleEditIcon);
                            if (iconOption) {
                              const IconComponent = iconOption.icon;
                              return <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
                            }
                            // Otherwise, treat it as an emoji
                            return <span className="text-lg">{simpleEditIcon}</span>;
                          })()
                        ) : (
                          <Palette className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={simpleEditIcon || ''}
                        onChange={(e) => setSimpleEditIcon(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="Enter emoji or select icon below"
                      />
                    </div>
                    
                    {/* Icon Search */}
                    <div className="mb-3">
                      <input
                        type="text"
                        value={iconSearchQuery}
                        onChange={(e) => setIconSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                        placeholder="Search icons..."
                      />
                    </div>
                    
                    {/* Icon Picker Grid */}
                    <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800">
                      {iconOptions
                        .filter(option => 
                          option.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
                        )
                        .map(option => {
                          const IconComponent = option.icon;
                          const isSelected = simpleEditIcon === option.name;
                          return (
                            <button
                              key={option.name}
                              type="button"
                              onClick={() => setSimpleEditIcon(option.name)}
                              className={`p-2 rounded-lg border-2 transition-colors hover:scale-105 ${
                                isSelected
                                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                              }`}
                              title={option.name}
                            >
                              <IconComponent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSimpleEditModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Find the current category
                    const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
                    const categoryIndex = categoryList.findIndex(cat => cat.id === activeCategory);
                    
                    if (categoryIndex !== -1) {
                      // Find the icon component from iconOptions or keep current icon
                      const iconOption = iconOptions.find(opt => opt.name === simpleEditIcon);
                      const newIcon = iconOption ? iconOption.icon : categoryList[categoryIndex].icon;
                      
                      // Update the category
                      const updatedCategory = {
                        ...categoryList[categoryIndex],
                        name: simpleEditName.trim(),
                        icon: newIcon
                      };
                      
                      // Update the categories array
                      const newCategories = [...categoryList];
                      newCategories[categoryIndex] = updatedCategory;
                      
                      // Update the state
                      if (activeTab === 'prompts') {
                        setCategories(newCategories);
                        // Save to localStorage with icon name for serialization
                        const serializable = newCategories.map(cat => ({
                          ...cat,
                          iconName: iconOptions.find(opt => opt.icon === cat.icon)?.name || 'Globe'
                        }));
                        localStorage.setItem('koto_categories', JSON.stringify(serializable));
                      } else {
                        setToolCategories(newCategories);
                        // Save to localStorage with icon name for serialization
                        const serializable = newCategories.map(cat => ({
                          ...cat,
                          iconName: iconOptions.find(opt => opt.icon === cat.icon)?.name || 'Globe'
                        }));
                        localStorage.setItem('koto_tool_categories', JSON.stringify(serializable));
                      }
                    }
                    
                    setShowSimpleEditModal(false);
                  }}
                  disabled={!simpleEditName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KotoDashboard;