import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import PromptCard from './PromptCard';
import NewPromptDialog from './NewPromptDialog';
import NewToolDialog from './NewToolDialog';
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
  logo: string;
  category: string;
  url: string;
  mpid?: string;
}
interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
  mpid?: string;
}
const KotoDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>('prompts');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [showNewToolDialog, setShowNewToolDialog] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([{
    id: '1',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['writing', 'creative', 'storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-15'),
    mpid: "3c0dbd9b-6272-4472-9836-a1adca7efb92"
  }, {
    id: '2',
    title: 'Code Review Helper',
    content: 'Review my code for best practices, security issues, and optimization opportunities.',
    tags: ['coding', 'review', 'optimization'],
    model: 'Claude-3',
    category: 'Development',
    createdAt: new Date('2024-01-14'),
    mpid: "6b1b5f5d-d38b-4d66-9bdb-0d9255a3c15c"
  }]);
  const [tools, setTools] = useState<Tool[]>([{
    id: '1',
    name: 'Figma',
    logo: '🎨',
    category: 'Design',
    url: 'https://figma.com',
    mpid: "e235b830-541f-49e2-be64-38d27aad8137"
  }, {
    id: '2',
    name: 'GitHub',
    logo: '💻',
    category: 'Development',
    url: 'https://github.com',
    mpid: "806cf927-bfd0-4de1-ba02-b088b2d400bd"
  }, {
    id: '3',
    name: 'Notion',
    logo: '📝',
    category: 'Productivity',
    url: 'https://notion.so',
    mpid: "1b152cd7-b879-44d2-a183-6b4888401203"
  }]);
  const categories: Category[] = [{
    id: 'all',
    name: 'All',
    count: prompts.length,
    color: 'bg-gray-100 text-gray-700',
    mpid: "ad5e502c-f221-408e-831a-3ff2b376e41a"
  }, {
    id: 'writing',
    name: 'Writing',
    count: prompts.filter(p => p.category === 'Writing').length,
    color: 'bg-blue-100 text-blue-700',
    mpid: "336825b8-433e-41ce-8800-6e79f27d0515"
  }, {
    id: 'development',
    name: 'Development',
    count: prompts.filter(p => p.category === 'Development').length,
    color: 'bg-green-100 text-green-700',
    mpid: "9b18802f-d8e7-48b5-bb9c-37249af642b1"
  }, {
    id: 'design',
    name: 'Design',
    count: 3,
    color: 'bg-purple-100 text-purple-700',
    mpid: "05ea39a2-56dc-4c2a-82bc-d6f9364191ae"
  }, {
    id: 'marketing',
    name: 'Marketing',
    count: 5,
    color: 'bg-orange-100 text-orange-700',
    mpid: "48b9faf5-b57d-4687-9473-5ae4f175b5d5"
  }, {
    id: 'productivity',
    name: 'Productivity',
    count: 2,
    color: 'bg-indigo-100 text-indigo-700',
    mpid: "6eed443e-3507-4c79-b613-5005077740aa"
  }];
  const toolCategories: Category[] = [{
    id: 'all',
    name: 'All',
    count: tools.length,
    color: 'bg-gray-100 text-gray-700',
    mpid: "dfe70b38-0483-4994-a96e-13c198f272c2"
  }, {
    id: 'design',
    name: 'Design',
    count: tools.filter(t => t.category === 'Design').length,
    color: 'bg-purple-100 text-purple-700',
    mpid: "0173ae29-ba34-4e03-a5da-8c5db8dbbc63"
  }, {
    id: 'development',
    name: 'Development',
    count: tools.filter(t => t.category === 'Development').length,
    color: 'bg-green-100 text-green-700',
    mpid: "9dccf147-637e-451c-affa-ca5a37ee92ba"
  }, {
    id: 'productivity',
    name: 'Productivity',
    count: tools.filter(t => t.category === 'Productivity').length,
    color: 'bg-indigo-100 text-indigo-700',
    mpid: "30933339-6a95-43b5-b1ff-aa702b6dcd5a"
  }];
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || prompt.category.toLowerCase() === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category.toLowerCase() === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const handleSavePrompt = (promptData: Omit<Prompt, 'id' | 'createdAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPrompts(prev => [newPrompt, ...prev]);
    setShowNewPromptDialog(false);
  };
  const handleUpdatePromptCover = (promptId: string, coverImage: string) => {
    setPrompts(prev => prev.map(prompt => prompt.id === promptId ? {
      ...prompt,
      coverImage
    } : prompt));
  };
  const handleSaveTool = (toolData: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...toolData,
      id: Date.now().toString()
    };
    setTools(prev => [newTool, ...prev]);
    setShowNewToolDialog(false);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <div className="h-screen w-full bg-gray-50 flex overflow-hidden" data-magicpath-id="0" data-magicpath-path="KotoDashboard.tsx">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} activeTab={activeTab} onTabChange={setActiveTab} tools={tools} data-magicpath-id="1" data-magicpath-path="KotoDashboard.tsx" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" data-magicpath-id="2" data-magicpath-path="KotoDashboard.tsx">
        {/* Header */}
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onMenuToggle={() => setMobileMenuOpen(true)} data-magicpath-id="3" data-magicpath-path="KotoDashboard.tsx" />

        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4" data-magicpath-id="4" data-magicpath-path="KotoDashboard.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="5" data-magicpath-path="KotoDashboard.tsx">
            <div className="flex items-center space-x-4" data-magicpath-id="6" data-magicpath-path="KotoDashboard.tsx">
              {activeTab === 'prompts' ? <motion.button onClick={() => setShowNewPromptDialog(true)} className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} data-magicpath-id="7" data-magicpath-path="KotoDashboard.tsx">
                  <Plus className="w-4 h-4 mr-2" data-magicpath-id="8" data-magicpath-path="KotoDashboard.tsx" />
                  Add Prompt
                </motion.button> : <motion.button onClick={() => setShowNewToolDialog(true)} className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} data-magicpath-id="9" data-magicpath-path="KotoDashboard.tsx">
                  <Link className="w-4 h-4 mr-2" data-magicpath-id="10" data-magicpath-path="KotoDashboard.tsx" />
                  Add Tool
                </motion.button>}
            </div>
            
            <motion.button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors" whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} data-magicpath-id="11" data-magicpath-path="KotoDashboard.tsx">
              <FolderPlus className="w-4 h-4 mr-2" data-magicpath-id="12" data-magicpath-path="KotoDashboard.tsx" />
              Add Category
            </motion.button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3" data-magicpath-id="13" data-magicpath-path="KotoDashboard.tsx">
          <div className="flex items-center space-x-2 overflow-x-auto" data-magicpath-id="14" data-magicpath-path="KotoDashboard.tsx">
            {(activeTab === 'prompts' ? categories : toolCategories).map(category => <motion.button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : category.color}`} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} data-magicpath-id="15" data-magicpath-path="KotoDashboard.tsx">
                <span data-magicpath-id="16" data-magicpath-path="KotoDashboard.tsx">{category.name}</span>
                <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-50 rounded-full text-xs" data-magicpath-id="17" data-magicpath-path="KotoDashboard.tsx">
                  {category.count}
                </span>
              </motion.button>)}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6" data-magicpath-id="18" data-magicpath-path="KotoDashboard.tsx">
          <div className="max-w-7xl mx-auto" data-magicpath-id="19" data-magicpath-path="KotoDashboard.tsx">
            {activeTab === 'prompts' ? <>
                <div className="flex items-center justify-between mb-6" data-magicpath-id="20" data-magicpath-path="KotoDashboard.tsx">
                  <div data-magicpath-id="21" data-magicpath-path="KotoDashboard.tsx">
                    <h1 className="text-2xl font-semibold text-gray-900" data-magicpath-id="22" data-magicpath-path="KotoDashboard.tsx">
                      {activeCategory === 'all' ? 'All Prompts' : `${categories.find(c => c.id === activeCategory)?.name} Prompts`}
                    </h1>
                    <p className="text-gray-600 mt-1" data-magicpath-id="23" data-magicpath-path="KotoDashboard.tsx">
                      {filteredPrompts.length} prompts available
                    </p>
                  </div>
                </div>

                {/* Prompts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="24" data-magicpath-path="KotoDashboard.tsx">
                  {filteredPrompts.map(prompt => <PromptCard key={prompt.id} prompt={prompt} onUpdateCover={coverImage => handleUpdatePromptCover(prompt.id, coverImage)} data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="KotoDashboard.tsx" />)}
                </div>

                {filteredPrompts.length === 0 && <div className="text-center py-12" data-magicpath-id="26" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-gray-400 text-lg mb-2" data-magicpath-id="27" data-magicpath-path="KotoDashboard.tsx">
                      No prompts found
                    </div>
                    <p className="text-gray-500" data-magicpath-id="28" data-magicpath-path="KotoDashboard.tsx">
                      Try adjusting your search or create a new prompt
                    </p>
                  </div>}
              </> : <>
                <div className="mb-6" data-magicpath-id="29" data-magicpath-path="KotoDashboard.tsx">
                  <h1 className="text-2xl font-semibold text-gray-900" data-magicpath-id="30" data-magicpath-path="KotoDashboard.tsx">
                    {activeCategory === 'all' ? 'All Tools' : `${toolCategories.find(c => c.id === activeCategory)?.name} Tools`}
                  </h1>
                  <p className="text-gray-600 mt-1" data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx">
                    Your favorite tools and resources
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="32" data-magicpath-path="KotoDashboard.tsx">
                  {filteredTools.map(tool => <motion.a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group" whileHover={{
                y: -2
              }} whileTap={{
                scale: 0.98
              }} data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="33" data-magicpath-path="KotoDashboard.tsx">
                      <div className="flex items-center justify-between mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="KotoDashboard.tsx">
                        <div className="text-3xl" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="logo:unknown" data-magicpath-id="35" data-magicpath-path="KotoDashboard.tsx">
                          {tool.logo}
                        </div>
                        <div className="text-gray-400 group-hover:text-indigo-500 transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="36" data-magicpath-path="KotoDashboard.tsx">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="37" data-magicpath-path="KotoDashboard.tsx">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="KotoDashboard.tsx" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="39" data-magicpath-path="KotoDashboard.tsx">
                        {tool.name}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="40" data-magicpath-path="KotoDashboard.tsx">
                        {tool.category}
                      </span>
                    </motion.a>)}
                </div>

                {filteredTools.length === 0 && <div className="text-center py-12" data-magicpath-id="41" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-gray-400 text-lg mb-2" data-magicpath-id="42" data-magicpath-path="KotoDashboard.tsx">
                      No tools found
                    </div>
                    <p className="text-gray-500" data-magicpath-id="43" data-magicpath-path="KotoDashboard.tsx">
                      Try adjusting your search or add a new tool
                    </p>
                  </div>}
              </>}
          </div>
        </main>
      </div>

      {/* New Prompt Dialog */}
      <NewPromptDialog open={showNewPromptDialog} onClose={() => setShowNewPromptDialog(false)} onSave={handleSavePrompt} data-magicpath-id="44" data-magicpath-path="KotoDashboard.tsx" />

      {/* New Tool Dialog */}
      <NewToolDialog open={showNewToolDialog} onClose={() => setShowNewToolDialog(false)} onSave={handleSaveTool} data-magicpath-id="45" data-magicpath-path="KotoDashboard.tsx" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence data-magicpath-id="46" data-magicpath-path="KotoDashboard.tsx">
        {mobileMenuOpen && <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setMobileMenuOpen(false)} data-magicpath-id="47" data-magicpath-path="KotoDashboard.tsx" />}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;