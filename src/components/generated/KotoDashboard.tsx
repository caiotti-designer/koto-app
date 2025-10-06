"use client";

import React, { useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus, MessageSquare, Wrench, ChevronLeft, Menu, Bell, User, Settings, HelpCircle, Sun, Moon, ExternalLink, Share2, Trash2, Copy, Palette, Code, Code2, Briefcase, PenTool, Target, Users, BarChart3, Zap, Globe, Figma, Cpu, Tag, X, Upload, Camera, Smile, Heart, Star, Coffee, Music, Book, BookOpen, Gamepad2, Laptop, Smartphone, Headphones, Car, Home, Plane, Gift, ShoppingBag, CreditCard, Mail, Phone, MapPin, Calendar, Clock, Eye, EyeOff, ChevronDown, ChevronRight, Edit2, LogOut, Check, Database, Shield, ShieldCheck, ShieldAlert, ShieldX, Server, Cloud, CloudSnow, CloudRain, Terminal, Package, Package2, PackageOpen, Layers, Workflow, GitBranch, Container, Boxes, Box, FileCode, FileCode2, Monitor, Tablet, Watch, Tv, Radio, Headset, Video, Image, FileText, Folder, Archive, Download, Share, Lock, Unlock, Key, UserCheck, UserPlus, UserMinus, Users2, Building, Building2, Factory, Store, Warehouse, Truck, Ship, Rocket, Satellite, Wifi, Bluetooth, Usb, HardDrive, MemoryStick, Disc, PlayCircle, PauseCircle, StopCircle, SkipForward, SkipBack, Volume2, VolumeX, Mic, MicOff, VideoOff, Scissors, Paintbrush, Paintbrush2, Brush, Pen, Pencil, Edit, Edit3, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough, List, ListOrdered, CheckSquare, Square, Circle, Triangle, Hexagon, Octagon, Diamond, Shapes, Grid, Layout, Sidebar, PanelLeft, PanelRight, PanelTop, PanelBottom, Maximize, Minimize, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Move, MousePointer, Hand, Grab, ZoomIn, ZoomOut, Focus, Scan, QrCode, Barcode, Hash, AtSign, Percent, DollarSign, Euro, PoundSterling, Bitcoin, TrendingUp, TrendingDown, Activity, Flame, Snowflake, CloudLightning, Umbrella, Rainbow, Thermometer, Wind, Compass, Map, Navigation, Route, Flag, Bookmark, Award, Medal, Trophy, Crown, Gem, Sparkles, Wand2, Puzzle, Gamepad, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Spade, Club, Cherry, Apple, Grape, Banana, Carrot, Wheat, Leaf, Trees, Flower, Flower2, Bug, Fish, Bird, Cat, Dog, Rabbit, Turtle, Snail, Worm, Microscope, Telescope, Atom, Dna, Pill, Syringe, Stethoscope, Bandage, Cross, Minus, Equal, Divide, Calculator, Binary, Pi, Sigma, Variable, Parentheses, Brackets, Braces, Quote, Ampersand, Asterisk, Slash, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight, CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight, ChevronsUp, ChevronsDown, ChevronsLeft, ChevronsRight, MoreHorizontal, MoreVertical, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';
import PromptCard from './PromptCard';
import ToolCard from './ToolCard';
import PromptDetailsModal from './PromptDetailsModal';
import Logo from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import ProfileSettingsDialog from '../ProfileSettingsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
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
  fetchUserProfile,
  fetchCategories,
  fetchSubcategories,
  createCategory,
  createSubcategory,
  updateCategory,
  updateSubcategory,
  deleteCategory,
  deleteSubcategory,
  subscribeToCategories,
  subscribeToSubcategories,
  unsubscribeFromChannel,
  shareCategory,
  shareSubcategory,
  resequenceCategories,
} from '../../lib/data';
import type { PromptRow, ToolRow } from '../../lib/data';
import type { UserProfile } from '../../lib/data';
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
  isPublic?: boolean; // Add public/private field
}
interface Tool {
  id: string;
  name: string;
  category: string;
  url: string;
  description?: string;
  favicon?: string;
  subcategory?: string;
  isPublic?: boolean; // Add public/private field
}
interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  expanded?: boolean;
  sortOrder?: number | null;
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
];
const KotoDashboard: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('koto_active_tab') : null;
      if (saved === 'prompts' || saved === 'toolbox') return saved;
    } catch {}
    return 'prompts';
  });
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    try {
      const savedTab = typeof window !== 'undefined' ? localStorage.getItem('koto_active_tab') : null;
      const key = savedTab === 'toolbox' ? 'koto_active_category_tools' : 'koto_active_category_prompts';
      const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (saved) return saved;
      return savedTab === 'toolbox' ? 'all-tools' : 'all';
    } catch {
      return 'all';
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [showNewToolDialog, setShowNewToolDialog] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showPromptDetailsDialog, setShowPromptDetailsDialog] = useState(false);
  const [showToolDetailsDialog, setShowToolDetailsDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProfileSettingsDialog, setShowProfileSettingsDialog] = useState(false);
  const [showProjectSettingsDialog, setShowProjectSettingsDialog] = useState(false);
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [editingProjectName, setEditingProjectName] = useState('');
  const [editingProjectIcon, setEditingProjectIcon] = useState<React.ComponentType | null>(null);
  
  // New simple edit modal state
  const [showSimpleEditModal, setShowSimpleEditModal] = useState(false);
  const [simpleEditName, setSimpleEditName] = useState('');
  const [simpleEditIcon, setSimpleEditIcon] = useState<string | null>(null);
  
  // Debug useEffect to monitor modal state changes

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [draggedItem, setDraggedItem] = useState<{
    type: 'prompt' | 'tool';
    item: Prompt | Tool;
  } | null>(null);
  // Sidebar reorder state (Projects/Stacks order)
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null);
  const [hoverCategoryId, setHoverCategoryId] = useState<string | null>(null);
  const [hoverInsertPos, setHoverInsertPos] = useState<'above' | 'below' | null>(null);
  const [reorderListType, setReorderListType] = useState<'prompts' | 'toolbox' | null>(null);
  const [sidebarReorderArmed, setSidebarReorderArmed] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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
  const [newPromptSelectedProject, setNewPromptSelectedProject] = useState('');

  // New tool form state
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('');
  const [isLoadingToolData, setIsLoadingToolData] = useState(false);
  const [toolFavicon, setToolFavicon] = useState('');
  const [returnToToolDialog, setReturnToToolDialog] = useState(false);
  // Track if user manually edited the auto fields
  const [toolNameEdited, setToolNameEdited] = useState(false);
  const [toolDescEdited, setToolDescEdited] = useState(false);

  // Right-click context menu (empty space shortcut)
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Settings state
  const [backgroundImage, setBackgroundImage] = useState(() => {
    // Load background image from localStorage if available, otherwise use default
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

  // Update category counts dynamically (compare by IDs)
  // Helper to resolve legacy name-based category values to ids
  const resolvePromptCategoryId = (value: string) => {
    if (!value) return value;
    const byId = categories.find(c => c.id === value);
    if (byId) return byId.id;
    const byName = categories.find(c => c.name === value);
    return byName ? byName.id : value;
  };
  const resolveToolCategoryId = (value: string) => {
    if (!value) return value;
    const byId = toolCategories.find(c => c.id === value);
    if (byId) return byId.id;
    const byName = toolCategories.find(c => c.name === value);
    return byName ? byName.id : value;
  };
  const updatedCategories = categories.map(category => {
    if (category.id === 'all') {
      return {
        ...category,
        count: prompts.length
      };
    }

    // Count prompts in this category (including subcategories) by id
    const directPrompts = prompts.filter(p => resolvePromptCategoryId(p.category) === category.id && !p.subcategory);
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

    // Count tools in this category and its subcategories by id
    const directTools = tools.filter(t => resolveToolCategoryId(t.category) === category.id && !t.subcategory);
    const subcategoryTools = subcategories
      .filter(sub => sub.parentId === category.id)
      .reduce((count, sub) => count + tools.filter(t => t.subcategory === sub.id).length, 0);
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

    // Regular category matching by id - show prompts in this category but not in any subcategory
    const matchesCategory = resolvePromptCategoryId(prompt.category) === activeCategory && !prompt.subcategory;
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
      const matchesSubcategory = tool.subcategory === subcategory.id;
      return matchesSearch && matchesSubcategory;
    }

    // Regular category matching by id
    const matchesCategory = resolveToolCategoryId(tool.category) === activeCategory && !tool.subcategory;
    return matchesSearch && matchesCategory;
  });
  // Theme is now managed by ThemeContext

  // Persist active tab across reloads
  useEffect(() => {
    try {
      localStorage.setItem('koto_active_tab', activeTab);
    } catch {}
  }, [activeTab]);

  // Persist active category for current tab
  // Important: do NOT persist on tab change before category is restored,
  // otherwise we might save the prompts category under tools key.
  useEffect(() => {
    try {
      const key = activeTab === 'toolbox' ? 'koto_active_category_tools' : 'koto_active_category_prompts';
      const nameKey = activeTab === 'toolbox' ? 'koto_active_category_name_tools' : 'koto_active_category_name_prompts';
      localStorage.setItem(key, activeCategory);
      
      // Also persist the category name for immediate display during refresh
      const categoryName = getCurrentCategoryName();
      localStorage.setItem(nameKey, categoryName);
    } catch {}
  }, [activeCategory, subcategories, updatedCategories, updatedToolCategories]);

  // On tab change, restore saved category for that tab or default
  useEffect(() => {
    try {
      const key = activeTab === 'toolbox' ? 'koto_active_category_tools' : 'koto_active_category_prompts';
      const saved = localStorage.getItem(key);
      if (activeTab === 'prompts') {
        setActiveCategory(saved || 'all');
      } else {
        setActiveCategory(saved || 'all-tools');
      }
    } catch {
      setActiveCategory(activeTab === 'toolbox' ? 'all-tools' : 'all');
    }
  }, [activeTab]);

  // Auth subscription and initial load
  useEffect(() => {
    const sub = onAuthChange((u) => {
      setUser(u);
    });
    return () => {
      // best-effort cleanup for supabase v2 subscription wrapper
      try { 
        if (sub && typeof sub === 'object' && 'data' in sub) {
          const subscription = (sub as { data?: { subscription?: { unsubscribe?: () => void } } }).data?.subscription;
          subscription?.unsubscribe?.();
        }
      } catch (error) {
        console.warn('Error cleaning up subscription:', error);
      }
    };
  }, []);

  // Load user profile when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) {
        setUserProfile(null);
        return;
      }

      try {
        const profileData = await fetchUserProfile(user.id);
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  // Refresh user profile when window gains focus (user returns from profile settings)
  useEffect(() => {
    const handleFocus = async () => {
      if (user?.id) {
        try {
          const profileData = await fetchUserProfile(user.id);
          setUserProfile(profileData);
        } catch (error) {
          console.error('Error refreshing user profile:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id]);

  // Load categories and subcategories from database when user is authenticated
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.id) {
        setCategories([{
          id: 'all',
          name: 'All',
          count: 0,
          icon: Globe,
          expanded: false
        }]);
        setToolCategories([{
          id: 'all-tools',
          name: 'All Tools',
          count: 0,
          icon: Globe,
          expanded: false
        }]);
        setSubcategories([]);
        return;
      }

      try {
        const [categoryRows, subcategoryRows] = await Promise.all([
          fetchCategories(user.id),
          fetchSubcategories(user.id)
        ]);

        // Map subcategories from database
        const mappedSubcategories = subcategoryRows.map(row => ({
          id: row.id,
          name: row.name,
          parentId: row.category_id,
          count: 0 // Will be calculated dynamically
        }));

        // Separate prompt and tool categories based on database type field and sort by sort_order if present, otherwise created_at
        const promptRows = categoryRows.filter(row => row.type === 'prompt');
        const toolRows = categoryRows.filter(row => row.type === 'tool');

        const sortByOrder = (rows: typeof categoryRows) => {
          return [...rows].sort((a: any, b: any) => {
            const ao = a.sort_order ?? null;
            const bo = b.sort_order ?? null;
            if (ao != null && bo != null) return ao - bo;
            if (ao != null) return -1;
            if (bo != null) return 1;
            // fallback: by created_at
            const at = new Date(a.created_at).getTime();
            const bt = new Date(b.created_at).getTime();
            return at - bt;
          });
        };

        const mapRowToCategory = (row: any): Category => ({
          id: row.id,
          name: row.name,
          count: 0,
          icon: iconOptions.find(opt => opt.name === row.icon)?.icon || Globe,
          expanded: false,
          sortOrder: row.sort_order ?? null,
        });

        const promptCategories = sortByOrder(promptRows).map(mapRowToCategory);
        const toolCategoriesFromDb = sortByOrder(toolRows).map(mapRowToCategory);

        // Apply localStorage order if no sort_order in DB
        const applyLocalOrder = (list: typeof promptCategories, key: string) => {
          try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
            if (!raw) return list;
            const order: string[] = JSON.parse(raw);
            if (!Array.isArray(order) || order.length === 0) return list;
            const dict = Object.fromEntries(list.map((c) => [c.id, c] as const)) as Record<string, typeof list[number]>;
            const remaining = new Set(list.map(c => c.id));
            const arranged: typeof list = [];
            for (const id of order) {
              const c = dict[id];
              if (c) {
                arranged.push(c);
                remaining.delete(id);
              }
            }
            // Append any remaining new categories at the end in original order
            for (const c of list) {
              if (remaining.has(c.id)) arranged.push(c);
            }
            return arranged;
          } catch {
            return list;
          }
        };
        const anyPromptHasOrder = promptRows.some((r: any) => r.sort_order != null);
        const anyToolHasOrder = toolRows.some((r: any) => r.sort_order != null);
        const finalPromptCategories = anyPromptHasOrder ? promptCategories : applyLocalOrder(promptCategories, 'koto_order_prompt');
        const finalToolCategories = anyToolHasOrder ? toolCategoriesFromDb : applyLocalOrder(toolCategoriesFromDb, 'koto_order_tool');

        const normalizedPromptCategories = normalizeCategoryOrder(finalPromptCategories);
        const normalizedToolCategories = normalizeCategoryOrder(finalToolCategories);

        setCategories([
          {
            id: 'all',
            name: 'All',
            count: 0,
            icon: Globe,
            expanded: false,
            sortOrder: 0,
          },
          ...normalizedPromptCategories,
        ]);

        setToolCategories([
          {
            id: 'all-tools',
            name: 'All Tools',
            count: 0,
            icon: Globe,
            expanded: false,
            sortOrder: 0,
          },
          ...normalizedToolCategories,
        ]);

  
  

      setSubcategories(mappedSubcategories);
      } catch (error) {
        console.error('Failed to load categories from database:', error);
      }
    };

    loadCategories();
  }, [user]);

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
          isPublic: row.is_public || false,
        });
        const mapTool = (row: ToolRow): Tool => ({
          id: row.id,
          name: row.name,
          url: row.url,
          description: row.description || undefined,
          favicon: row.favicon || undefined,
          category: row.category || 'General',
          subcategory: row.subcategory || undefined,
          isPublic: row.is_public || false,
        });
        setPrompts(promptRows.map(mapPrompt));
        setTools(toolRows.map(mapTool));
      } catch (e) {
        console.error('Failed to load data from Supabase', e);
      }
    };
    load();
  }, [user]);

  // Real-time subscriptions for categories and subcategories
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to categories changes
    const categoriesChannel = subscribeToCategories(user.id, (payload) => {
      if (payload.eventType === 'INSERT') {

        const newCategory: Category = {

          id: payload.new.id,

          name: payload.new.name,

          count: 0,

          icon: iconOptions.find(opt => opt.name === payload.new.icon)?.icon || Globe,

          expanded: false,

          sortOrder: payload.new.sort_order ?? null,

        };



        if (payload.new.type === 'prompt') {

          setCategories(prev => mergeCategoryState(prev, newCategory, 'insert', 'all'));

        } else {

          setToolCategories(prev => mergeCategoryState(prev, newCategory, 'insert', 'all-tools'));

        }

      } else if (payload.eventType === 'UPDATE') {

        const updatedCategory: Category = {

          id: payload.new.id,

          name: payload.new.name,

          count: 0,

          icon: iconOptions.find(opt => opt.name === payload.new.icon)?.icon || Globe,

          expanded: false,

          sortOrder: payload.new.sort_order ?? null,

        };



        if (payload.new.type === 'prompt') {

          setCategories(prev => mergeCategoryState(prev, updatedCategory, 'update', 'all'));

        } else {

          setToolCategories(prev => mergeCategoryState(prev, updatedCategory, 'update', 'all-tools'));

        }

      } else if (payload.eventType === 'DELETE') {

        const removed: Category = {

          id: payload.old.id,

          name: '',

          count: 0,

          icon: Globe,

          expanded: false,

          sortOrder: null,

        };



        if (payload.old.type === 'prompt') {

          setCategories(prev => mergeCategoryState(prev, removed, 'delete', 'all'));

        } else {

          setToolCategories(prev => mergeCategoryState(prev, removed, 'delete', 'all-tools'));

        }

      }



    });

    // Subscribe to subcategories changes
    const subcategoriesChannel = subscribeToSubcategories(user.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        const newSubcategory = {
          id: payload.new.id,
          name: payload.new.name,
          parentId: payload.new.category_id,
          count: 0,
        };
        setSubcategories(prev => [...prev, newSubcategory]);
      } else if (payload.eventType === 'UPDATE') {
        const updatedSubcategory = {
          id: payload.new.id,
          name: payload.new.name,
          parentId: payload.new.category_id,
          count: 0,
        };
        setSubcategories(prev => prev.map(sub => 
          sub.id === payload.new.id ? updatedSubcategory : sub
        ));
      } else if (payload.eventType === 'DELETE') {
        setSubcategories(prev => prev.filter(sub => sub.id !== payload.old.id));
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      if (categoriesChannel) {
        unsubscribeFromChannel(categoriesChannel);
      }
      if (subcategoriesChannel) {
        unsubscribeFromChannel(subcategoriesChannel);
      }
    };
  }, [user?.id]);

  // Drag and drop handlers
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: 'prompt' | 'tool', item: Prompt | Tool) => {
    setDraggedItem({
      type,
      item
    });
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Sidebar reorder helpers
  const moveItem = <T,>(arr: T[], fromId: string, toId: string, getId: (x: T) => string, position: 'above' | 'below' = 'above') => {
    if (fromId === toId) return arr;
    const items = [...arr];
    const fromIndex = items.findIndex((x) => getId(x) === fromId);
    const toIndex = items.findIndex((x) => getId(x) === toId);
    if (fromIndex === -1 || toIndex === -1) return arr;
    const [moved] = items.splice(fromIndex, 1);
    const insertIndex = position === 'above' ? toIndex : toIndex + (fromIndex < toIndex ? 0 : 1);
    items.splice(insertIndex, 0, moved);
    return items;
  };

  const applySequentialOrder = (items: Category[]): Category[] => items.map((item, idx) => ({
    ...item,
    sortOrder: idx + 1,
  }));

  const normalizeCategoryOrder = (items: Category[]): Category[] => {
    return applySequentialOrder([
      ...items
    ].sort((a, b) => {
      const ao = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const bo = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.name.localeCompare(b.name);
    }));
  };

  const mergeCategoryState = (
    current: Category[],
    incoming: Category,
    action: 'insert' | 'update' | 'delete',
    headerId: string,
  ): Category[] => {
    const header = current.find((cat) => cat.id === headerId) ?? null;
    const rest = header ? current.filter((cat) => cat.id !== headerId) : [...current];
    let updated: Category[] = rest;

    if (action === 'insert') {
      updated = [...rest, incoming];
    } else if (action === 'update') {
      updated = rest.map((cat) => {
        if (cat.id !== incoming.id) return cat;
        return {
          ...incoming,
          expanded: cat.expanded,
        };
      });
    } else if (action === 'delete') {
      updated = rest.filter((cat) => cat.id !== incoming.id);
    }

    const normalized = normalizeCategoryOrder(updated);
    if (header) {
      return [{ ...header, sortOrder: 0 }, ...normalized];
    }
    return normalized;
  };

  const persistCategoryOrder = async (listType: 'prompts' | 'toolbox', list: Category[]) => {
    const orderIds = list.map((c) => c.id);
    const key = listType === 'prompts' ? 'koto_order_prompt' : 'koto_order_tool';

    try {
      localStorage.setItem(key, JSON.stringify(orderIds));
    } catch (storageError) {
      console.warn('Failed to persist category order locally', storageError);
    }

    if (!user?.id) {
      return;
    }

    const type = listType === 'prompts' ? 'prompt' : 'tool';
    await resequenceCategories(user.id, type, orderIds);
  };


  const handleSidebarCategoryDragStart = (e: React.DragEvent, id: string, listType: 'prompts' | 'toolbox') => {
    if (!sidebarReorderArmed) {
      // Not in reorder mode, ignore drag
      try { e.preventDefault(); } catch {}
      return;
    }
    e.stopPropagation();
    setDraggingCategoryId(id);
    setReorderListType(listType);
    try { e.dataTransfer.setData('text/plain', id); } catch {}
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleSidebarCategoryDragOver = (e: React.DragEvent, id: string) => {
    if (!draggingCategoryId) return;
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const pos = (e.clientY - rect.top) < rect.height / 2 ? 'above' : 'below';
    if (hoverCategoryId !== id) setHoverCategoryId(id);
    setHoverInsertPos(pos);
  };
  const handleSidebarCategoryDrop = async (e: React.DragEvent, id: string) => {
    if (!draggingCategoryId || !reorderListType) return;
    e.preventDefault();
    e.stopPropagation();
    if (draggingCategoryId === id) {
      setDraggingCategoryId(null); setHoverCategoryId(null); setHoverInsertPos(null); setReorderListType(null); setSidebarReorderArmed(false); return;
    }
    if (reorderListType === 'prompts') {
      const current = categories.filter((c) => c.id !== 'all');
      const previous = applySequentialOrder(current);
      const reordered = applySequentialOrder(
        moveItem(current, draggingCategoryId, id, (c) => c.id, hoverInsertPos ?? 'above'),
      );
      const header = categories[0] ? { ...categories[0], sortOrder: 0 } : undefined;
      if (header) {
        setCategories([header, ...reordered]);
      } else {
        setCategories(reordered);
      }
      try {
        await persistCategoryOrder('prompts', reordered);
      } catch (err) {
        console.error('Failed to persist project order', err);
        toast.error('Could not sync project order. Reverting.');
        if (header) {
          setCategories([header, ...previous]);
        } else {
          setCategories(previous);
        }
      }
    } else {
      const current = toolCategories.filter((c) => c.id !== 'all-tools');
      const previous = applySequentialOrder(current);
      const reordered = applySequentialOrder(
        moveItem(current, draggingCategoryId, id, (c) => c.id, hoverInsertPos ?? 'above'),
      );
      const header = toolCategories[0] ? { ...toolCategories[0], sortOrder: 0 } : undefined;
      if (header) {
        setToolCategories([header, ...reordered]);
      } else {
        setToolCategories(reordered);
      }
      try {
        await persistCategoryOrder('toolbox', reordered);
      } catch (err) {
        console.error('Failed to persist stack order', err);
        toast.error('Could not sync stack order. Reverting.');
        if (header) {
          setToolCategories([header, ...previous]);
        } else {
          setToolCategories(previous);
        }
      }
    }

    setDraggingCategoryId(null);
    setHoverCategoryId(null);
    setHoverInsertPos(null);
    setReorderListType(null);
    setSidebarReorderArmed(false);
  };
  const handleSidebarCategoryDragEnd = () => {
    setDraggingCategoryId(null);
    setHoverCategoryId(null);
    setHoverInsertPos(null);
    setReorderListType(null);
    setSidebarReorderArmed(false);
  };

  // Instant arm for sidebar reordering (no delay)
  const armSidebarReorder = (id: string) => {
    setSidebarReorderArmed(true);
    setDraggingCategoryId(id);
    setReorderListType(activeTab === 'prompts' ? 'prompts' : 'toolbox');
  };
  const cancelSidebarReorderArm = () => {
    setSidebarReorderArmed(false);
    setDraggingCategoryId(null);
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Clear dragged item and any visual feedback when drag ends
    setDraggedItem(null);
    setDragOverTarget(null);
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(targetId);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're actually leaving the target
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverTarget(null);
    }
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
      const newCategory = targetCategory ? targetCategory.id : (targetSubcategory?.parentId ? targetSubcategory.parentId : (draggedItem.item as Prompt).category);
      const newSubcategory = targetSubcategory ? targetSubcategory.id : undefined;
      
      // Update local state
      setPrompts(prev => prev.map(p => p.id === draggedItem.item.id ? {
        ...p,
        category: newCategory,
        subcategory: newSubcategory
      } : p));
      
      // Update database
      try {
        await updatePrompt(draggedItem.item.id, { category: newCategory, subcategory: newSubcategory ?? null });
      } catch (error) {
        console.error('Failed to update prompt in database:', error);
        toast.error('Failed to save changes to database');
        // Revert local state on error
        setPrompts(prev => prev.map(p => p.id === (draggedItem.item as Prompt).id ? draggedItem.item as Prompt : p));
      }
    } else if (draggedItem.type === 'tool' && activeTab === 'toolbox') {
      const newCategory = targetCategory ? targetCategory.id : (targetSubcategory?.parentId ? targetSubcategory.parentId : (draggedItem.item as Tool).category);
      const newSubcategory = targetSubcategory ? targetSubcategory.id : undefined;
      
      // Update local state
      setTools(prev => prev.map(t => t.id === draggedItem.item.id ? {
        ...t,
        category: newCategory,
        subcategory: newSubcategory
      } : t));
      
      // Update database
      try {
        await updateTool(draggedItem.item.id, { category: newCategory, subcategory: newSubcategory ?? null });
      } catch (error) {
        console.error('Failed to update tool in database:', error);
        toast.error('Failed to save changes to database');
        // Revert local state on error
        setTools(prev => prev.map(t => t.id === draggedItem.item.id ? draggedItem.item as Tool : t));
      }
    }
    setDraggedItem(null);
    setDragOverTarget(null);
    setIsDragging(false);
  };

  // Handle right-click on empty space in content area
  const handleContentContextMenu = (e: React.MouseEvent) => {
    // Only when right-click
    if (e.type !== 'contextmenu') return;
    // Ignore when interacting with inputs/buttons/interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, select, button, a, [role="button"], [data-card]')) return;

    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  // Close context menu on click elsewhere or escape/scroll
  useEffect(() => {
    if (!contextMenuOpen) return;
    const close = () => setContextMenuOpen(false);
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setContextMenuOpen(false);
    };
    window.addEventListener('click', close, { capture: true });
    window.addEventListener('contextmenu', close, { capture: true });
    window.addEventListener('scroll', close, { capture: true });
    window.addEventListener('resize', close, { capture: true });
    window.addEventListener('keydown', onKey, { capture: true });
    return () => {
      window.removeEventListener('click', close, { capture: true } as any);
      window.removeEventListener('contextmenu', close, { capture: true } as any);
      window.removeEventListener('scroll', close, { capture: true } as any);
      window.removeEventListener('resize', close, { capture: true } as any);
      window.removeEventListener('keydown', onKey, { capture: true } as any);
    };
  }, [contextMenuOpen]);
  const handleAddProject = async () => {
    if (!newProjectName.trim() || !user?.id) return;
    
    try {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: newProjectName,
        icon: selectedIcon.icon,
        tags: newProjectTags,
        subcategories: newProjectSubcategories,
        createdAt: new Date()
      };

      // Create category in database
      const categoryType = activeTab === 'prompts' ? 'prompt' : 'tool';
      const iconName = iconOptions.find(opt => opt.icon === selectedIcon.icon)?.name || 'Globe';
      
      const createdCategory = await createCategory({
        name: newProjectName,
        icon: iconName,
        type: categoryType,
        user_id: user.id
      }, user.id);

      if (createdCategory) {
        const newCategory: Category = {
          id: createdCategory.id,
          name: createdCategory.name,
          count: 0,
          icon: selectedIcon.icon,
          expanded: false,
        };

        // Update local state
        if (activeTab === 'prompts') {
          setCategories(prev => [...prev, newCategory]);
        } else {
          setToolCategories(prev => [...prev, newCategory]);
        }

        // Create subcategories in database
        if (activeTab === 'prompts' && newProjectSubcategories.length > 0) {
          const subcategoryPromises = newProjectSubcategories.map(subcat => 
            createSubcategory({
              name: subcat,
              category_id: createdCategory.id,
              user_id: user.id
            }, user.id)
          );
          
          const createdSubcategories = await Promise.all(subcategoryPromises);
          const newSubcats = createdSubcategories.filter(Boolean).map(sub => ({
            id: sub!.id,
            name: sub!.name,
            parentId: sub!.category_id,
            count: 0,
          }));
          
          setSubcategories(prev => [...prev, ...newSubcats]);
        }

        // Set the new project as active category
        setActiveCategory(createdCategory.id);

        // If returning to tool dialog, set the new category and reopen tool dialog
        if (returnToToolDialog) {
          setNewToolCategory(newCategory.id);
          setReturnToToolDialog(false);
          handleCloseAddProjectDialog();
          setShowNewToolDialog(true);
        } else {
          handleCloseAddProjectDialog();
        }

        toast.success('Project created successfully!');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
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
    handleOpenNewPromptDialog();
  };

  const handleOpenNewPromptDialog = () => {
    // Reset dialog state before opening
    setNewPromptTitle('');
    setNewPromptContent('');
    setNewPromptModel('GPT-4');
    setCustomModelName('');
    setNewPromptTags([]);
    setNewPromptCoverImage('');
    setNewPromptCoverFile(null);
    setNewPromptSelectedProject('');
    setShowNewPromptDialog(true);
  };
  const handleAddTool = () => {
    // Reset dialog state before opening
    setNewToolName('');
    setNewToolUrl('');
    setNewToolDescription('');
    setNewToolCategory('');
    setToolFavicon('');
    setIsLoadingToolData(false);
    setToolNameEdited(false);
    setToolDescEdited(false);
    setShowNewToolDialog(true);
  };
  const handleCreatePrompt = async () => {
    if (!newPromptTitle.trim() || !newPromptContent.trim()) return;
    
    // Require authentication
    if (!user?.id) {
      console.warn('You must be signed in to create prompts.');
// Show sign in dialog instead of profile menu since it's not defined
toast.error('Please sign in to continue', {
  description: 'You must be signed in to perform this action'
});
      return;
    }

    // Determine the correct category and subcategory for the new prompt
    let promptCategory: string = '';
    let promptSubcategory: string | undefined = undefined;
    
    // If a project is selected, use that as the category
    if (newPromptSelectedProject) {
      // value holds category id
      promptCategory = newPromptSelectedProject;
    } else if (activeCategory !== 'all') {
      // Check if it's a subcategory
      const subcategory = subcategories.find(sub => sub.id === activeCategory);
      if (subcategory) {
        // For subcategories, use the parent category id and store subcategory id
        promptCategory = subcategory.parentId;
        promptSubcategory = subcategory.id;
      } else {
        // For regular categories, use the category id
        promptCategory = activeCategory;
      }
    }
    // Fallback: if still empty, choose first prompt category (excluding 'all') if available
    if (!promptCategory) {
      const first = updatedCategories.find(cat => cat.id !== 'all');
      promptCategory = first ? first.id : 'uncategorized';
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

    // Reset form and close dialog
    handleCloseNewPromptDialog();
  };
  
  const handleCloseNewToolDialog = () => {
    console.log('handleCloseNewToolDialog called');
    console.log('Current showNewToolDialog state:', showNewToolDialog);
    setShowNewToolDialog(false);
    console.log('Setting showNewToolDialog to false');
    // Reset form state
    setNewToolName('');
    setNewToolUrl('');
    setNewToolDescription('');
    setNewToolCategory('');
    setToolFavicon('');
    setIsLoadingToolData(false);
    setToolNameEdited(false);
    setToolDescEdited(false);
    console.log('Form state reset complete');
  };

  const handleCloseNewPromptDialog = () => {
    console.log('handleCloseNewPromptDialog called');
    setShowNewPromptDialog(false);
    // Reset form state
    setNewPromptTitle('');
    setNewPromptContent('');
    setNewPromptModel('GPT-4');
    setCustomModelName('');
    setNewPromptTags([]);
    setNewPromptCoverImage('');
    setNewPromptCoverFile(null);
    setNewPromptSelectedProject('');
    console.log('Prompt form state reset complete');
  };

  const handleCloseAddProjectDialog = () => {
    console.log('handleCloseAddProjectDialog called');
    setShowAddProjectDialog(false);
    // Reset form state
    setNewProjectName('');
    setSelectedIcon(iconOptions[0]);
    setNewProjectTags([]);
    setNewProjectSubcategories([]);
    setNewTagInput('');
    setNewSubcategoryInput('');
    setIconSearchQuery('');
    console.log('Project form state reset complete');
  };

  const handleOpenAddProjectDialog = () => {
    // Reset dialog state before opening
    setNewProjectName('');
    setSelectedIcon(iconOptions[0]);
    setNewProjectTags([]);
    setNewProjectSubcategories([]);
    setNewTagInput('');
    setNewSubcategoryInput('');
    setIconSearchQuery('');
    setShowAddProjectDialog(true);
  };
  
  const handleCreateTool = async () => {
    if (!newToolName.trim() || !newToolUrl.trim()) return;
    
    // Require authentication
    if (!user?.id) {
      console.warn('You must be signed in to create tools.');
// Remove invalid state setter that doesn't exist
return;
      return;
    }
    
    try {
      const created = await createTool({
        name: newToolName,
        url: newToolUrl,
        description: newToolDescription || undefined,
        favicon: toolFavicon || undefined,
        // store category id; prefer selected, else current activeId (if a category), else first tool category
        category: (newToolCategory || (activeCategory !== 'all-tools' && !subcategories.find(s => s.id === activeCategory) ? activeCategory : (toolCategories.find(c => c.id !== 'all-tools')?.id || 'uncategorized'))),
      }, user.id);
      
      if (created) {
        const mapped: Tool = {
          id: created.id,
          name: created.name,
          url: created.url,
          description: created.description || undefined,
          favicon: created.favicon || undefined,
          category: created.category || 'General',
          subcategory: created.subcategory || undefined,
          isPublic: created.is_public || false,
        };
        setTools(prev => [mapped, ...prev]);
      }
    } catch (e) {
      console.error('Failed to create tool', e);
    }

    // Reset form and close dialog
    handleCloseNewToolDialog();
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
        setBackgroundOption('custom');
        // Save to localStorage to persist across reloads
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
    // For 'custom', keep the current backgroundImage
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
  }, [showNewPromptDialog, handleClipboardPaste]);
  const handleDoubleClick = (itemId: string, currentName: string) => {
    setEditingItem(itemId);
    setEditingName(currentName);
  };
  const handleRename = async (itemId: string, type: 'category' | 'subcategory') => {
    if (!editingName.trim()) return;
    
    if (type === 'category') {
      try {
        // Update category in database
        await updateCategory(itemId, { name: editingName.trim() });
        
        // Update local state
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
        
        toast.success('Project renamed successfully!');
      } catch (error) {
        console.error('Failed to update category:', error);
        toast.error('Failed to rename project');
      }
    } else {
      // Update subcategory in database
      try {
        await updateSubcategory(itemId, { name: editingName.trim() });
        setSubcategories(prev => prev.map(sub => sub.id === itemId ? {
          ...sub,
          name: editingName.trim()
        } : sub));
        toast.success('Stack renamed successfully!');
      } catch (error) {
        console.error('Failed to update subcategory:', error);
        toast.error('Failed to rename stack');
      }
    }
    setEditingItem(null);
    setEditingName('');
  };
  const handleAddSubcategoryToProject = async (parentId: string) => {
    if (!user?.id) {
      toast.error('Please sign in to create stacks');
      return;
    }

    try {
      // Create a new subcategory with a default name based on active tab
      const subcatName = activeTab === 'prompts' ? 'New subproject' : 'New substack';
      
      // Create subcategory in database
      const created = await createSubcategory({
        name: subcatName,
        category_id: parentId,
        user_id: user.id
      }, user.id);

      if (created) {
        const newSubcat: Subcategory = {
          id: created.id,
          name: created.name,
          parentId: created.category_id,
          count: 0,
        };
        
        setSubcategories(prev => [...prev, newSubcat]);
        
        // Automatically start editing the newly created subcategory
        setEditingItem(created.id);
        setEditingName(created.name);
        
        toast.success(`${activeTab === 'prompts' ? 'Subproject' : 'Substack'} created successfully!`);
      }
    } catch (error) {
      console.error('Failed to create subcategory:', error);
      toast.error(`Failed to create ${activeTab === 'prompts' ? 'subproject' : 'substack'}`);
      return;
    }

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

  // Delete a category (project/stack) and its subcategories in the database, then update local state
  const handleDeleteCategoryAndSubs = async (categoryId: string) => {
    if (!user?.id) {
      toast.error('Please sign in to delete');
      return;
    }

    try {
      // Delete subcategories first to satisfy potential FK constraints
      const subsToDelete = subcategories.filter(sub => sub.parentId === categoryId);
      if (subsToDelete.length > 0) {
        await Promise.all(subsToDelete.map(sub => deleteSubcategory(sub.id)));
      }

      // Delete the category
      await deleteCategory(categoryId);

      // Update local state
      setSubcategories(prev => prev.filter(sub => sub.parentId !== categoryId));
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setToolCategories(prev => prev.filter(cat => cat.id !== categoryId));

      // If it was the active category, reset to list view for current tab
      if (activeCategory === categoryId) {
        setActiveCategory(activeTab === 'prompts' ? 'all' : 'all-tools');
      }

      toast.success('Category deleted');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Share a category
  const handleShareCategory = async (categoryId: string) => {
    if (!user?.id) {
      toast.error('Please sign in to share');
      return;
    }

    try {
      const shareToken = await shareCategory(categoryId);
      const shareUrl = `${window.location.origin}/shared/category?token=${shareToken}`;
      
      // Copy to clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share project:', error);
      toast.error('Failed to create share link');
    }
  };

  // Share a subcategory
  const handleShareSubcategory = async (subcategoryId: string) => {
    if (!user?.id) {
      toast.error('Please sign in to share');
      return;
    }

    try {
      const shareToken = await shareSubcategory(subcategoryId);
      const shareUrl = `${window.location.origin}/shared/subcategory?token=${shareToken}`;
      
      // Copy to clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share subcategory:', error);
      toast.error('Failed to create share link');
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
    
    if (category) {
      return category.name;
    }
    
    // If category not found (during loading), try to get the stored name
    try {
      const nameKey = activeTab === 'toolbox' ? 'koto_active_category_name_tools' : 'koto_active_category_name_prompts';
      const storedName = localStorage.getItem(nameKey);
      if (storedName) {
        return storedName;
      }
    } catch {}
    
    // Final fallback
    return activeTab === 'prompts' ? 'AI Prompts' : 'A.I Tools';
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
        return tools.filter(t => t.subcategory === subcategory.id).length;
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

      // Auto-complete description based on common domains or fetched content
      if (!newToolDescription) {
        const lowerUrl = newToolUrl.toLowerCase();
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
        } else if (url.includes('perplexity.ai')) {
          description = 'AI-powered search engine that provides comprehensive answers with sources.';
        } else if (url.includes('poe.com')) {
          description = 'Platform for chatting with various AI models and bots.';
        } else if (url.includes('bard.google.com')) {
          description = 'Google\'s AI chatbot for creative collaboration and helpful conversations.';
        } else if (url.includes('bing.com/chat')) {
          description = 'Microsoft\'s AI-powered search and chat assistant.';
        } else if (url.includes('replicate.com')) {
          description = 'Platform for running and deploying machine learning models.';
        } else if (url.includes('leonardo.ai')) {
          description = 'AI-powered creative platform for generating and editing images.';
        } else if (url.includes('dalle.art') || url.includes('dall-e')) {
          description = 'AI system for creating realistic images and art from text descriptions.';
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
        } else if (url.includes('framer.com')) {
          description = 'Interactive design tool for creating prototypes and websites.';
        } else if (url.includes('invisionapp.com')) {
          description = 'Digital product design platform for prototyping and collaboration.';
        } else if (url.includes('behance.net')) {
          description = 'Creative portfolio platform for showcasing design work and projects.';
        } else if (url.includes('dribbble.com')) {
          description = 'Design community for discovering and connecting with creative professionals.';
        } else if (url.includes('unsplash.com')) {
          description = 'High-quality stock photography platform for creative projects.';
        } else if (url.includes('pexels.com')) {
          description = 'Free stock photos and videos for creative projects.';
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
        } else if (url.includes('stackoverflow.com')) {
          description = 'Developer community platform for programming questions and answers.';
        } else if (url.includes('codepen.io')) {
          description = 'Online code editor for frontend development and experimentation.';
        } else if (url.includes('jsfiddle.net')) {
          description = 'Online code playground for testing and sharing JavaScript code.';
        } else if (url.includes('codesandbox.io')) {
          description = 'Online development environment for web applications.';
        } else if (url.includes('replit.com')) {
          description = 'Online IDE and hosting platform for coding projects.';
        } else if (url.includes('gitlab.com')) {
          description = 'DevOps platform for software development and deployment.';
        } else if (url.includes('bitbucket.org')) {
          description = 'Git code hosting and collaboration platform for teams.';
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
          // Enhanced heuristic: analyze domain structure and common patterns
          try {
            const cleanDomain = urlObj.hostname.replace(/^www\.|^app\.|^my\.|^beta\.|^dev\./, '');
            const domainParts = cleanDomain.split('.');
            const siteName = domainParts[0];
            const tld = domainParts[domainParts.length - 1];
            
            // Analyze path for more context
            const pathParts = (urlObj.pathname || '/').split('/').filter(Boolean);
            const firstPath = pathParts[0];
            const secondPath = pathParts[1];
            
            // Build intelligent description based on domain patterns
            let description = '';
            
            // Check for common tool patterns in domain names
            if (siteName.includes('ai') || siteName.includes('ml') || siteName.includes('gpt')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — AI-powered tool for automation and intelligent tasks.`;
            } else if (siteName.includes('app') || siteName.includes('tool') || siteName.includes('hub')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — specialized application and utility platform.`;
            } else if (siteName.includes('cloud') || siteName.includes('host') || siteName.includes('deploy')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — cloud infrastructure and deployment services.`;
            } else if (siteName.includes('api') || siteName.includes('dev') || siteName.includes('code')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — development tools and API services.`;
            } else if (siteName.includes('data') || siteName.includes('analytics') || siteName.includes('insight')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — data analysis and business intelligence platform.`;
            } else if (siteName.includes('design') || siteName.includes('creative') || siteName.includes('art')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — creative design and visual content tools.`;
            } else if (siteName.includes('productivity') || siteName.includes('work') || siteName.includes('team')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — productivity and team collaboration platform.`;
            } else if (siteName.includes('market') || siteName.includes('shop') || siteName.includes('store')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — e-commerce and marketplace platform.`;
            } else if (siteName.includes('learn') || siteName.includes('edu') || siteName.includes('course')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — educational content and learning platform.`;
            } else if (siteName.includes('social') || siteName.includes('chat') || siteName.includes('connect')) {
              description = `${siteName.charAt(0).toUpperCase() + siteName.slice(1)} — social networking and communication platform.`;
            } else {
              // Generic but more intelligent description
              const name = siteName.charAt(0).toUpperCase() + siteName.slice(1);
              if (firstPath && firstPath.length > 2 && firstPath.length < 30) {
                const cleanPath = firstPath.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                description = `${name} — ${cleanPath} platform and services.`;
              } else if (secondPath && secondPath.length > 2 && secondPath.length < 30) {
                const cleanPath = secondPath.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                description = `${name} — ${cleanPath} tools and resources.`;
              } else {
                description = `${name} — comprehensive online platform and tools.`;
              }
            }
            
            // Add domain-specific context if available
            if (tld === 'ai') {
              description = description.replace(/\.$/, '') + ' powered by artificial intelligence.';
            } else if (tld === 'app') {
              description = description.replace(/\.$/, '') + ' - mobile and web application.';
            } else if (tld === 'io') {
              description = description.replace(/\.$/, '') + ' - innovative technology platform.';
            } else if (tld === 'co') {
              description = description.replace(/\.$/, '') + ' - company and business services.';
            }
            
            setNewToolDescription(description);
          } catch {
            // Last-resort fallback if everything fails
            const cleanDomain = urlObj.hostname.replace(/^www\.|^app\./, '');
            const siteName = cleanDomain.split('.')[0];
            const name = siteName.charAt(0).toUpperCase() + siteName.slice(1);
            setNewToolDescription(`${name} — helpful online tool and platform.`);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching tool data:', error);
    } finally {
      setIsLoadingToolData(false);
    }
  };

  // Debounced URL change handler
  useEffect(() => {
    // quick debounce for network fetch
    const timeoutId = setTimeout(() => {
      if (newToolUrl) {
        fetchToolData(newToolUrl);
      }
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [newToolUrl]);

  // Immediate reaction to URL typing: compute preliminary name/description fast
  useEffect(() => {
    if (!newToolUrl) {
      setToolFavicon('');
      if (!toolNameEdited) setNewToolName('');
      if (!toolDescEdited) setNewToolDescription('');
      return;
    }
    try {
      const urlObj = new URL(newToolUrl);
      const cleanDomain = urlObj.hostname.replace(/^www\.|^app\./, '');
      const siteName = cleanDomain.split('.')[0];
      const name = siteName ? siteName.charAt(0).toUpperCase() + siteName.slice(1) : '';
      if (!toolNameEdited && name) setNewToolName(name);
      if (!toolDescEdited) {
        const pathHint = (urlObj.pathname || '/').split('/').filter(Boolean)[0];
        const hint = pathHint && pathHint.length > 2 && pathHint.length < 24 ? pathHint.replace(/[-_]/g, ' ') : 'tool';
        setNewToolDescription(name ? `${name} — ${hint}.` : 'Online tool.');
      }
    } catch {
      // ignore invalid URL while typing
      if (!toolNameEdited) setNewToolName('');
      if (!toolDescEdited) setNewToolDescription('');
    }
  }, [newToolUrl]);

  // Missing handler functions for PromptDetailsModal
  const handleEditPrompt = async (prompt: Prompt) => {
    try {
      // persist
      const patch: Partial<PromptRow> = {
        title: prompt.title,
        content: prompt.content,
        model: prompt.model,
        tags: prompt.tags,
        category: prompt.category,
        subcategory: prompt.subcategory ?? undefined,
        cover_image: prompt.coverImage ?? undefined,
        is_public: prompt.isPublic ?? false,
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
        isPublic: updated.is_public || false,
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
          subcategory: editedTool.subcategory ?? undefined,
          is_public: editedTool.isPublic ?? false,
        });
        setTools(prev => prev.map(t => t.id === tool.id ? {
          id: updated.id,
          name: updated.name,
          url: updated.url,
          description: updated.description ?? undefined,
          favicon: updated.favicon ?? undefined,
          category: updated.category || 'General',
          subcategory: updated.subcategory || undefined,
          isPublic: updated.is_public ?? false,
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
        console.error('Failed to share stack:', error);
    toast.error('Failed to share stack', {
          description: 'Please try again later',
          duration: 3000,
        });
      }
    };

    const handleToggleVisibility = async (nextPublic: boolean) => {
      if (!tool) return;
      try {
        const { updateTool } = await import('../../lib/data');
        const updated = await updateTool(tool.id, { is_public: nextPublic });
        setTools(prev => prev.map(t => t.id === tool.id ? {
          id: updated.id,
          name: updated.name,
          url: updated.url,
          description: updated.description ?? undefined,
          favicon: updated.favicon ?? undefined,
          category: updated.category || 'General',
          subcategory: updated.subcategory || undefined,
          isPublic: updated.is_public ?? false,
        } : t));
        setEditedTool(prev => prev ? { ...prev, isPublic: nextPublic } : prev);
      } catch (e) {
        console.error('Failed to toggle tool visibility', e);
        toast.error('Failed to update visibility');
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
                    <p className="text-white/80 text-sm mt-1">
                      {updatedToolCategories.find(c => c.id === tool.category)?.name || 'General'}
                    </p>
                  </div>
                </div>

                {/* Header Actions - Only Close Button */}
                <div className="absolute top-4 right-4">
                  <motion.button onClick={onClose} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors">
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

                  {/* Public/Private Toggle */}
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Visibility
                      </label>
                      <div className="flex items-center space-x-4">
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
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4" style={{marginTop: '16px'}}>
                <div className="flex items-center justify-end space-x-3">
                  {!isEditing ? <>
                      {/* Visibility quick toggle */}
                      <div className="mr-auto">
                        <div className="inline-flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                          <button onClick={() => handleToggleVisibility(false)} className={`px-3 py-2 text-sm flex items-center gap-1 ${!tool.isPublic ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                            <Lock className="w-4 h-4" /> Private
                          </button>
                          <button onClick={() => handleToggleVisibility(true)} className={`px-3 py-2 text-sm flex items-center gap-1 ${tool.isPublic ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                            <Globe className="w-4 h-4" /> Public
                          </button>
                        </div>
                      </div>
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
                          <p>Share stack with others</p>
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
                      
                      <motion.button onClick={() => setShowDeleteConfirm(true)} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </motion.button>
                     </> : <>
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
                    </>}
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
                          <motion.button 
                            onClick={() => setShowDeleteConfirm(false)} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                          >
                            Cancel
                          </motion.button>
                          <motion.button 
                            onClick={handleDelete} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            Delete
                          </motion.button>
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
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
                          icon: editingProjectIcon || categoryList[categoryIndex].icon
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
                           activeTab === 'prompts' ? 'koto_categories' : 'koto_tool_categories',
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
              <Logo size="lg" className="text-white" />
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
    <TooltipProvider>
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
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    <ChevronLeft className={`w-4.5 h-4.5 text-slate-600 dark:text-slate-400 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Search */}
          {!sidebarCollapsed && <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder="Search prompts..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 text-sm placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-600"
                />
              </div>
            </div>}

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {!sidebarCollapsed && <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {activeTab === 'toolbox' ? 'STACKS' : 'PROJECTS'}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleOpenAddProjectDialog}
                    className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>}
              
              <div className="space-y-1">
                {/* All Button - Fixed on top with count */}
                <div className="mb-2">
                  <Button 
                    variant={((activeTab === 'prompts' && activeCategory === 'all') || (activeTab === 'toolbox' && activeCategory === 'all-tools')) ? "default" : "ghost"} 
                    onClick={() => setActiveCategory(activeTab === 'prompts' ? 'all' : 'all-tools')} 
                    className={`w-full justify-start space-x-2 h-auto py-2.5 max-w-[247px] ${((activeTab === 'prompts' && activeCategory === 'all') || (activeTab === 'toolbox' && activeCategory === 'all-tools')) ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <Globe className="w-4.5 h-4.5 flex-shrink-0" />
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
                  </Button>
                </div>

                {(activeTab === 'prompts' ? updatedCategories.filter(cat => cat.id !== 'all') : updatedToolCategories.filter(cat => cat.id !== 'all-tools')).map(category => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  const categorySubcategories = subcategories.filter(sub => sub.parentId === category.id);
                  const hasSubcategories = categorySubcategories.length > 0;
                  return <motion.div layout key={category.id} className="relative">
                      {/* Insertion indicator line for reorder */}
                      {draggingCategoryId && hoverCategoryId === category.id && hoverInsertPos === 'above' && (
                        <div className="absolute -top-1 left-2 right-2 h-0.5 bg-indigo-300 rounded-full" />
                      )}
                      {draggingCategoryId && hoverCategoryId === category.id && hoverInsertPos === 'below' && (
                        <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-indigo-300 rounded-full" />
                      )}
                      <div className="flex items-center group">
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          onDoubleClick={() => handleDoubleClick(category.id, category.name)}
                          onMouseDown={() => armSidebarReorder(category.id)}
                          onMouseUp={() => cancelSidebarReorderArm()}
                          onMouseLeave={() => cancelSidebarReorderArm()}
                          onTouchStart={() => armSidebarReorder(category.id)}
                          onTouchEnd={() => cancelSidebarReorderArm()}
                          draggable={sidebarReorderArmed && draggingCategoryId === category.id}
                          onDragStart={(e: React.DragEvent) => handleSidebarCategoryDragStart(e, category.id, activeTab === 'prompts' ? 'prompts' : 'toolbox')}
                          onDragOver={(e: React.DragEvent) => {
                            if (draggingCategoryId) {
                              handleSidebarCategoryDragOver(e, category.id);
                            } else {
                              handleDragOver(e, category.id);
                            }
                          }}
                          onDragLeave={(e: React.DragEvent) => {
                            if (draggingCategoryId) {
                              setHoverCategoryId(null); setHoverInsertPos(null);
                            } else {
                              handleDragLeave(e);
                            }
                          }}
                          onDrop={(e: React.DragEvent) => {
                            if (draggingCategoryId) {
                              handleSidebarCategoryDrop(e, category.id);
                            } else {
                              handleDrop(e, category.id);
                            }
                          }}
                          onDragEnd={handleSidebarCategoryDragEnd}
                          className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative max-w-[247px] ${
                            isActive
                              ? 'bg-slate-800 dark:bg-slate-700 text-white'
                              : dragOverTarget === category.id && isDragging
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-600 ring-opacity-50 shadow-lg transform scale-105'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
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
                                
                                {/* Category Actions Dropdown */}
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {/* Expand/collapse button for subcategories - always show if has subcategories */}
                                  {hasSubcategories && <div onClick={e => {
                              e.stopPropagation();
                              toggleCategoryExpansion(category.id);
                            }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer">
                                      {category.expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                    </div>}
                                  
                                  {/* Actions Dropdown */}
                                  <DropdownMenu>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                          <div 
                                            onClick={e => e.stopPropagation()}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all cursor-pointer"
                                          >
                                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                          </div>
                                        </DropdownMenuTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent side="right">
                                        <p>Projects actions</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <DropdownMenuContent align="end" className="w-48">
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddSubcategoryToProject(category.id);
                                      }}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Subcategory
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handleShareCategory(category.id);
                                      }}>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share project
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCategoryAndSubs(category.id);
                                        }}
                                        className="text-red-600 dark:text-red-400"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Category
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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
                        const subcategoryCount = activeTab === 'prompts' 
                          ? prompts.filter(p => p.subcategory === subcategory.id).length
                          : tools.filter(t => t.subcategory === subcategory.id).length;
                        return <button key={subcategory.id} onClick={() => setActiveCategory(subcategory.id)} onDoubleClick={() => handleDoubleClick(subcategory.id, subcategory.name)} onDragOver={(e: React.DragEvent) => handleDragOver(e, subcategory.id)} onDragLeave={handleDragLeave} onDrop={(e: React.DragEvent) => handleDrop(e, subcategory.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group max-w-[247px] ${activeCategory === subcategory.id ? 'bg-slate-700 dark:bg-slate-600 text-white' : dragOverTarget === subcategory.id && isDragging ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-600 ring-opacity-50 shadow-lg transform scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'}`}>
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
                            
                            {/* Subcategory Actions Dropdown */}
                            <DropdownMenu>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                    <div 
                                      onClick={e => e.stopPropagation()}
                                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all cursor-pointer"
                                    >
                                      <MoreHorizontal className="w-3 h-3 text-slate-400" />
                                    </div>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>Subcategory actions</p>
                                </TooltipContent>
                              </Tooltip>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareSubcategory(subcategory.id);
                                }}>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share Subcategory
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSubcategories(prev => prev.filter(sub => sub.id !== subcategory.id));
                                    // Reset to parent category if deleting active subcategory
                                    if (activeCategory === subcategory.id) {
                                      setActiveCategory(subcategory.parentId);
                                    }
                                  }}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Subcategory
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </button>;
                      })}
                          </motion.div>}
                      </AnimatePresence>
                    </motion.div>;
              })}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setShowSettingsDialog(true)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Settings className="w-4.5 h-4.5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="font-medium text-sm">Settings</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => {
                    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
                    setTheme(nextTheme);
                  }} className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                    {theme === 'light' ? <Sun className="w-4.5 h-4.5 flex-shrink-0" /> : theme === 'dark' ? <Moon className="w-4.5 h-4.5 flex-shrink-0" /> : <Monitor className="w-4.5 h-4.5 flex-shrink-0" />}
                    {!sidebarCollapsed && <span className="font-medium text-sm">{theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">
                  <p>Switch to {theme === 'light' ? 'Dark' : theme === 'dark' ? 'System' : 'Light'} theme</p>
                </TooltipContent>}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <HelpCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="font-medium text-sm">Help</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">
                  <p>Help & Support</p>
                </TooltipContent>}
              </Tooltip>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="h-full flex flex-col">
                {/* Mobile Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Logo size="custom-40" className="text-indigo-500" />
                      </div>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Koto</h1>
                    </div>
                    
                    <motion.button
                      onClick={() => setMobileMenuOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 min-w-[44px] min-h-[44px] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                </div>

                {/* Mobile Categories */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {/* All Items */}
                    <motion.button
                      onClick={() => {
                        setActiveCategory(activeTab === 'prompts' ? 'all' : 'all-tools');
                        setMobileMenuOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center space-x-3 px-3 py-3 min-h-[44px] rounded-lg text-left transition-colors ${
                        activeCategory === (activeTab === 'prompts' ? 'all' : 'all-tools')
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Package className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="font-medium text-sm">
                        {activeTab === 'prompts' ? 'All Prompts' : 'All Tools'}
                      </span>
                    </motion.button>

                    {/* Categories */}
                    {(activeTab === 'prompts' ? categories : toolCategories).map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setMobileMenuOpen(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center space-x-3 px-3 py-3 min-h-[44px] rounded-lg text-left transition-colors ${
                          activeCategory === category.id
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <category.icon className="w-4.5 h-4.5 flex-shrink-0" />
                        <span className="font-medium text-sm">{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="space-y-1">
                    <motion.button
                      onClick={() => {
                        setShowSettingsDialog(true);
                        setMobileMenuOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 px-3 py-3 min-h-[44px] rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Settings className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="font-medium text-sm">Settings</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 px-0">
        {/* Content Area */}
        <main className="flex-1 overflow-auto px-0">
          {/* Hero Section */}
          <div className={`relative h-64 overflow-hidden ${
            backgroundImage === 'none' 
              ? 'border-b border-slate-200 dark:border-slate-700' 
              : ''
          }`} style={{
            ...(backgroundImage !== 'none' && {
              backgroundImage: `url('${backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            })
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
                  {/* Mobile Menu Button - Only visible on mobile */}
                  <div className="md:hidden flex items-center">
                    <motion.button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 min-w-[44px] min-h-[44px] rounded-xl transition-colors mr-4 flex items-center justify-center"
                      aria-label="Toggle menu"
                    >
                      <Menu className="w-5 h-5" />
                    </motion.button>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex items-center flex-1 justify-center md:justify-start">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 inline-flex" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="flex space-x-1 md:space-x-2" style={{ alignItems: 'center' }}>
                      <motion.button 
                        onClick={() => setActiveTab('prompts')} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-6 py-3 md:py-4 min-h-[44px] rounded-xl text-sm font-medium transition-all ${activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Prompts</span>
                      </motion.button>
                      <motion.button 
                        onClick={() => setActiveTab('toolbox')} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-6 py-3 md:py-4 min-h-[44px] rounded-xl text-sm font-medium transition-all ${activeTab === 'toolbox' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                      >
                        <Wrench className="w-4 h-4" />
                        <span className="hidden sm:inline">Tool Box</span>
                      </motion.button>
                    </div>
                  </div>
                  </div>

                  {/* Profile Menu */}
                  <div className="h-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }} 
                          className="flex items-center space-x-0 md:space-x-3 pl-2 pr-2 md:pr-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-colors h-full"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                            {userProfile?.avatar_url ? (
                              <img 
                                src={userProfile.avatar_url} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Avatar failed to load:', userProfile.avatar_url, e);
                                }}
                              />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="text-left text-white hidden md:block">
                            <div className="text-sm font-medium">
                              {user ? (
                                userProfile?.display_name || 
                                user.user_metadata?.name || 
                                user.email || 
                                'Account'
                              ) : 'Login'}
                            </div>
                            <div className="text-xs text-white/80">{user ? 'Signed in' : 'Sign in to continue'}</div>
                          </div>
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48" align="end">
                        {!user && (
                          <>
                            <DropdownMenuItem onClick={async () => { await signInWithGitHub(); }}>
                              <User className="w-4 h-4 mr-2" />
                              Sign in with GitHub
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={async () => { await signInWithGoogle(); }}>
                              <User className="w-4 h-4 mr-2" />
                              Sign in with Google
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {user && (
                          <>
                            <DropdownMenuItem onClick={() => { setShowProfileSettingsDialog(true); }}>
                              <User className="w-4 h-4 mr-2" />
                              Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                          <Settings className="w-4 h-4 mr-2" />
                          App Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user ? (
                          <DropdownMenuItem onClick={async () => { await supaSignOut(); }} variant="destructive">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Help & Support
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* Header row handled above (tabs + login) */}

                {/* Second Row - Title and Actions */}
                <div className="flex items-center justify-between w-full" style={{
                alignItems: "end",
                width: "100%",
                maxWidth: "100%"
              }}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  paddingBottom: "16px",
                  paddingTop: "16px",
                  marginBottom: "0px",
                  rowGap: "8px",
                  paddingLeft: "16px",
                  paddingRight: "16px"
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
                      <h1 className="text-xl md:text-2xl font-bold">
                        {activeTab === 'prompts'
                          ? (activeCategory === 'all' ? 'All Prompts' : getCurrentCategoryName())
                          : (activeCategory === 'all-tools' ? 'All Tools' : getCurrentCategoryName())}
                      </h1>
                      {/* Edit icon - conditional rendering restored */}
                      {(activeTab === 'prompts' || activeTab === 'toolbox') && activeCategory && activeCategory !== 'all' && activeCategory !== 'all-tools' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Initialize simple edit modal state with current values
                                const categoryName = getCurrentCategoryName();
                                setSimpleEditName(categoryName);
                                
                                const categoryList = activeTab === 'prompts' ? updatedCategories : updatedToolCategories;
                                const category = categoryList.find(cat => cat.id === activeCategory);
                                
                                // Always set a fallback icon first (use icon name, not component)
                                const fallbackIconName = iconOptions.find(opt => opt.icon === iconOptions[0].icon)?.name || 'Globe';
                                setSimpleEditIcon(fallbackIconName);
                                
                                if (category && category.icon) {
                                  // Find the icon name from iconOptions or use emoji fallback
                                  const iconName = iconOptions.find(opt => opt.icon === category.icon)?.name || 'Globe';
                                  setSimpleEditIcon(iconName);
                                }
                                
                                // Force state update in next tick to avoid batching issues
                                setTimeout(() => {
                                  setShowSimpleEditModal(true);
                                }, 0);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 cursor-pointer ml-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit {activeTab === 'toolbox' ? 'Stack' : 'Project'}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {/* Share shortcut - positioned below edit button */}
                      {(activeTab === 'prompts' || activeTab === 'toolbox') && activeCategory && activeCategory !== 'all' && activeCategory !== 'all-tools' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Check if it's a subcategory
                                const subcategory = subcategories.find(sub => sub.id === activeCategory);
                                if (subcategory) {
                                  handleShareSubcategory(activeCategory);
                                } else {
                                  handleShareCategory(activeCategory);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 cursor-pointer ml-1"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share {activeTab === 'toolbox' ? 'stack' : 'project'}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className="text-white/80">
                      {getCurrentCategoryCount()} {activeTab === 'prompts' ? 'prompts' : 'tools'} available
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 md:space-x-4">
                    <motion.button onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg transition-colors">
                      <Plus className="w-4 h-4" />
                      <span className="hidden md:inline">{activeTab === 'prompts' ? 'Add Prompt' : 'Add Tool'}</span>
                    </motion.button>
                    
                    <motion.button onClick={() => setShowAddProjectDialog(true)} whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="bg-white/20 hover:bg-white/30 text-white px-3 md:px-6 py-3 rounded-xl font-medium flex items-center space-x-2 backdrop-blur-sm transition-colors">
                      <Plus className="w-4 h-4" />
                      <span className="hidden md:inline">{activeTab === 'toolbox' ? 'Add Stack' : 'Add Project'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="py-6 px-0 relative" onContextMenu={handleContentContextMenu}>
            {/* Drag overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-900/10 backdrop-blur-[1px] z-10 pointer-events-none rounded-lg" />
            )}
            <div className="w-[96%] mx-auto">
              {/* Show prompts/tools if they exist, otherwise show empty state */}
              {(activeTab === 'prompts' ? filteredPrompts.length > 0 : filteredTools.length > 0) ? <div className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 w-full transition-all duration-300 ${isDragging ? 'scale-[0.98]' : 'scale-100'}`}>
                  {activeTab === 'prompts' ? filteredPrompts.map(prompt => <div data-card="true" key={prompt.id} className={`mb-4 w-full transition-all duration-200 ${draggedItem?.item?.id === prompt.id ? 'opacity-50 transform rotate-2 scale-95' : 'opacity-100 transform rotate-0 scale-100'}`} style={{ breakInside: 'avoid' }}>
                          <PromptCard 
                            title={prompt.title} 
                            description={prompt.content} 
                            tags={prompt.tags} 
                            model={prompt.model} 
                            coverImage={prompt.coverImage} 
                            onClick={() => handlePromptClick(prompt)} 
                            isDragging={draggedItem?.item?.id === prompt.id}
                            onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, 'prompt', prompt)}
                            onDragEnd={handleDragEnd}
                          />
                        </div>) : filteredTools.map(tool => <div data-card="true" key={tool.id} className={`mb-4 w-full transition-all duration-200 ${draggedItem?.item?.id === tool.id ? 'opacity-50 transform rotate-2 scale-95' : 'opacity-100 transform rotate-0 scale-100'}`} style={{ breakInside: 'avoid' }}>
                          <ToolCard 
                            name={tool.name}
                            description={tool.description}
                            category={tool.category}
                            stack={updatedToolCategories.find(cat => cat.id === tool.category)?.name}
                            substack={tool.subcategory ? subcategories.find(sub => sub.id === tool.subcategory)?.name : undefined}
                            url={tool.url}
                            isDragging={draggedItem?.item?.id === tool.id}
                            favicon={tool.favicon}
                            onClick={() => handleToolClick(tool)}
                            onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, 'tool', tool)}
                            onDragEnd={handleDragEnd}
                          />
                        </div>)}
                </div> : (/* Empty State for New User */
            <div className="text-center py-12 w-full" data-empty-area="true">
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

      {/* Right-click context shortcut */}
      <AnimatePresence>
        {contextMenuOpen && (
          <motion.div
            className="fixed z-[60]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x, transformOrigin: 'top left' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-[200px] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <button
                onClick={() => {
                  setContextMenuOpen(false);
                  if (activeTab === 'prompts') {
                    handleAddPrompt();
                  } else {
                    handleAddTool();
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{activeTab === 'prompts' ? 'Add Prompt' : 'Add Tool'}</span>
              </button>
              <div className="h-px bg-slate-200 dark:bg-slate-700" />
              <button
                onClick={() => {
                  setContextMenuOpen(false);
                  handleOpenAddProjectDialog();
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>{activeTab === 'toolbox' ? 'Add Stack' : 'Add Project'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Dialog */}
      <AnimatePresence>
        {showAddProjectDialog && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
              }} onClick={handleCloseAddProjectDialog}>
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
                  <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {activeTab === 'toolbox' ? 'Stack' : 'Project'} Name
                  </Label>
                  <Input 
                    type="text" 
                    value={newProjectName} 
                    onChange={e => setNewProjectName(e.target.value)} 
                    placeholder={`Enter ${activeTab === 'toolbox' ? 'stack' : 'project'} name`} 
                    className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
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
                  
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800">
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

                {/* Subcategories/Subprojects */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Sub{activeTab === 'toolbox' ? 'stacks' : 'projects'}
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <Input
                      type="text"
                      value={newSubcategoryInput}
                      onChange={(e) => setNewSubcategoryInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubcategory()}
                      placeholder={`Add sub${activeTab === 'toolbox' ? 'stacks' : 'projects'}...`}
                      className="flex-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSubcategory}
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newProjectSubcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newProjectSubcategories.map((subcat) => (
                        <Badge
                          key={subcat}
                          variant="secondary"
                          className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                          {subcat}
                          <button
                            type="button"
                            onClick={() => removeSubcategory(subcat)}
                            className="ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={handleCloseAddProjectDialog}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddProject} 
                    disabled={!newProjectName.trim()}
                  >
                    Add {activeTab === 'toolbox' ? 'Stack' : 'Project'}
                  </Button>
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
              }} onClick={handleCloseNewPromptDialog}>
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
                  <Label htmlFor="prompt-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Title
                  </Label>
                  <Input
                    id="prompt-title"
                    type="text"
                    value={newPromptTitle}
                    onChange={e => setNewPromptTitle(e.target.value)}
                    placeholder="Enter prompt title"
                    className="w-full"
                  />
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="prompt-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Content
                  </Label>
                  <Textarea
                    id="prompt-content"
                    value={newPromptContent}
                    onChange={e => setNewPromptContent(e.target.value)}
                    placeholder="Enter prompt content"
                    rows={4}
                    className="w-full"
                  />
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

                {/* Project Selection - Only show if projects exist */}
                {updatedCategories.length > 0 && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Add to Project (optional)
                    </label>
                    <select 
                      value={newPromptSelectedProject} 
                      onChange={e => setNewPromptSelectedProject(e.target.value)} 
                      className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select a project...</option>
                      {updatedCategories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-3 w-4 h-4 text-slate-500 pointer-events-none" />
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
                      {newPromptTags.map(tag => <Badge key={tag} variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-xs rounded-full">
                          {tag}
                          <button onClick={() => removePromptTag(tag)} className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>)}
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
                  <Button 
                    variant="ghost" 
                    onClick={handleCloseNewPromptDialog}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePrompt} 
                    disabled={!newPromptTitle.trim() || !newPromptContent.trim()}
                  >
                    Create Prompt
                  </Button>
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
                    <input 
                      type="url" 
                      value={newToolUrl} 
                      onChange={e => {
                        setNewToolUrl(e.target.value);
                        // URL drives auto fields; reset edit flags to allow refresh
                        setToolNameEdited(false);
                        setToolDescEdited(false);
                      }} 
                      placeholder="https://example.com" 
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                    />
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
                    <input 
                      type="text" 
                      value={newToolName} 
                      onChange={e => { setNewToolName(e.target.value); setToolNameEdited(true); }} 
                      placeholder="Enter tool name" 
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                    />
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
                  <textarea 
                    value={newToolDescription} 
                    onChange={e => { setNewToolDescription(e.target.value); setToolDescEdited(true); }} 
                    placeholder="Enter tool description (will auto-complete based on URL)" 
                    rows={3} 
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                  />
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
                        {updatedToolCategories.filter(cat => cat.id !== 'all-tools').map(category => <option key={category.id} value={category.id}>
                            {category.name}
                          </option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    
                    <button onClick={() => {
                  setReturnToToolDialog(true);
                  setShowNewToolDialog(false);
                  handleOpenAddProjectDialog();
                }} className="w-full flex items-center justify-center space-x-2 px-3 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Add new stack</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleCloseNewToolDialog()}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTool} 
                    disabled={!newToolName.trim() || !newToolUrl.trim()}
                  >
                    Create Tool
                  </Button>
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
                      <Monitor className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-slate-400" />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">System</div>
                    </button>
                  </div>
                </div>

                {/* Background Photo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Header Background
                  </label>
                  <div className="space-y-4">
                    {/* Background Options */}
                    <div className="space-y-3">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Choose background option:</div>
                      
                      {/* Default Background Option */}
                      <label className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="backgroundOption" 
                          value="default" 
                          checked={backgroundOption === 'default'}
                          onChange={() => handleBackgroundOptionChange('default')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-700 dark:text-slate-300">Default Background</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Use the default Koto background image</div>
                        </div>
                        <div className="w-12 h-8 rounded border border-slate-200 dark:border-slate-600 overflow-hidden">
                          <img src="/koto-background-image-default.webp" alt="Default" className="w-full h-full object-cover" />
                        </div>
                      </label>
                      
                      {/* Custom Background Option */}
                      <label className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="backgroundOption" 
                          value="custom" 
                          checked={backgroundOption === 'custom'}
                          onChange={() => handleBackgroundOptionChange('custom')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-700 dark:text-slate-300">Custom Background</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Upload your own background image</div>
                        </div>
                        {backgroundOption === 'custom' && backgroundImage !== 'none' && backgroundImage !== '/koto-background-image-default.webp' && (
                          <div className="w-12 h-8 rounded border border-slate-200 dark:border-slate-600 overflow-hidden">
                            <img src={backgroundImage} alt="Custom" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </label>
                      
                      {/* No Background Option */}
                      <label className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="backgroundOption" 
                          value="none" 
                          checked={backgroundOption === 'none'}
                          onChange={() => handleBackgroundOptionChange('none')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                           <div className="font-medium text-slate-700 dark:text-slate-300">No Background</div>
                           <div className="text-sm text-slate-500 dark:text-slate-400">Transparent background with bottom border</div>
                         </div>
                        <div className="w-12 h-8 rounded border border-slate-200 dark:border-slate-600 bg-transparent border-b-2 border-b-slate-300 dark:border-b-slate-600"></div>
                      </label>
                    </div>
                    
                    {/* Custom Upload Section */}
                    {backgroundOption === 'custom' && (
                      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" id="background-upload" />
                        <label htmlFor="background-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Click to upload custom photo
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              Recommended: 1920x512px, WebP or JPEG
                            </div>
                          </div>
                        </label>
                        
                        {backgroundImage !== 'none' && backgroundImage !== '/koto-background-image-default.webp' && (
                          <div className="relative">
                            <img src={backgroundImage} alt="Background preview" className="w-full h-20 object-cover rounded-lg" />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleBackgroundOptionChange('default')} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove custom background</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSettingsDialog(false)}
                >
                  Close
                </Button>
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

      {/* Profile Settings Modal */}
      <ProfileSettingsDialog
        open={showProfileSettingsDialog}
        onOpenChange={setShowProfileSettingsDialog}
        userId={user?.id || null}
        initialProfile={userProfile}
        onSaved={(p) => setUserProfile(p)}
      />

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
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800">
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
      
      {/* Floating Action Buttons - Mobile/Tablet Only */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 md:hidden z-40">
        {/* Add Prompt/Tool FAB */}
        <motion.button
          onClick={() => activeTab === 'prompts' ? handleAddPrompt() : handleAddTool()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 min-w-[48px] min-h-[48px] rounded-full shadow-lg flex items-center justify-center transition-colors"
          aria-label={activeTab === 'prompts' ? 'Add new prompt' : 'Add new tool'}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
        
        {/* Add Project FAB */}
        <motion.button
                          onClick={handleOpenAddProjectDialog}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-12 h-12 min-w-[48px] min-h-[48px] rounded-full shadow-lg flex items-center justify-center transition-colors border border-white/20"
          aria-label="Add new project"
        >
          <FolderPlus className="w-5 h-5" />
        </motion.button>
      </div>
      
      </div>
    </TooltipProvider>
  );
};

export default KotoDashboard;