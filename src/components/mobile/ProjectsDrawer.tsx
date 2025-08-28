import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, ChevronRight, MoreVertical, Folder, FolderPlus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Logo from '../Logo';

interface Project {
  id: string;
  name: string;
  iconName: string;
  tags: string[];
  subcategories: string[];
}

interface Category {
  id: string;
  name: string;
  count: number;
  icon?: any;
  iconName?: string;
  expanded?: boolean;
}

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'prompts' | 'tools';
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onNewProject: () => void;
  categories: Category[];
  subcategories?: any[];
}

const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  selectedCategory,
  onCategorySelect,
  onNewProject,
  categories: propCategories,
  subcategories = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  // Filter categories based on type
  const categories = propCategories.filter(cat => {
    if (activeTab === 'prompts') {
      return cat.type === 'prompt';
    } else {
      return cat.type === 'tool';
    }
  }).map(cat => ({
    id: cat.id,
    name: cat.name,
    count: cat.prompt_count || cat.tool_count || 0,
    iconName: cat.icon_name,
    expanded: false
  }));

  // Filter categories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categories, searchQuery]);

  // Calculate total count
  const totalCount = categories.reduce((acc, category) => acc + (category.count || 0), 0);

  // Toggle category expansion (local state only for UI)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle category actions (these would need to be passed as props for database operations)
  const handleDeleteCategory = (categoryId: string) => {
    // This should be handled by parent component with database operations
    console.log('Delete category:', categoryId);
  };

  const handleRenameCategory = (categoryId: string, newName: string) => {
    // This should be handled by parent component with database operations
    console.log('Rename category:', categoryId, newName);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'prompts' ? 'Projects' : 'Stacks'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {activeTab === 'prompts' ? 'PROJECTS' : 'STACKS'}
              </h3>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={`Search ${activeTab === 'prompts' ? 'projects' : 'stacks'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
              />
            </div>
            {/* All button */}
            <div className="mb-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                className={`w-full justify-between h-auto py-3 ${
                  selectedCategory === 'all' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => onCategorySelect('all')}
              >
                <span className="font-medium">All</span>
                <Badge variant="secondary" className="ml-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                  {totalCount}
                </Badge>
              </Button>
            </div>

            {/* Categories */}
            <div className="space-y-1">
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                {/* Category Header */}
                <div className="flex items-center group">
                  <Button
                    variant="ghost"
                    className="flex-1 justify-start p-2 h-auto text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <Folder className="h-4 w-4" />
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="ml-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                        {category.count || 0}
                      </Badge>
                    </div>
                  </Button>
                  
                  {/* Category Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        const newName = prompt('Enter new category name:', category.name);
                        if (newName && newName.trim()) {
                          handleRenameCategory(category.id, newName.trim());
                        }
                      }}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Subcategories placeholder - can be expanded later */}
                {expandedCategories.has(category.id) && (
                  <div className="ml-6 space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 py-2">
                      No items in this {activeTab === 'prompts' ? 'project' : 'stack'}
                    </div>
                  </div>
                )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FolderPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm mb-2">
                  {searchQuery ? `No ${activeTab} found` : (activeTab === 'prompts' ? 'No projects yet' : 'No stacks yet')}
                </p>
                <p className="text-xs">
                  {searchQuery ? 'Try a different search term.' : `Create your first ${activeTab === 'prompts' ? 'project' : 'stack'} to get started`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <Button
            onClick={onNewProject}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New {activeTab === 'prompts' ? 'Project' : 'Stack'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProjectsDrawer;