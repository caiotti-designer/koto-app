import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquare, Wrench, Settings, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
interface Tool {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
}
interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  activeTab: 'prompts' | 'toolbox';
  onTabChange: (tab: 'prompts' | 'toolbox') => void;
  tools: Tool[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileMenuOpen,
  onCloseMobileMenu,
  activeTab,
  onTabChange,
  tools,
  darkMode,
  onToggleDarkMode
}) => {
  const sidebarVariants = {
    expanded: {
      width: 280
    },
    collapsed: {
      width: 80
    }
  };
  const mobileSidebarVariants = {
    open: {
      x: 0
    },
    closed: {
      x: -320
    }
  };
  const navItems = [{
    id: 'prompts',
    label: 'Prompts',
    icon: MessageSquare,
    tab: 'prompts' as const
  }, {
    id: 'toolbox',
    label: 'Tool Box',
    icon: Wrench,
    tab: 'toolbox' as const
  }] as any[];
  const bottomItems = [{
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }, {
    id: 'darkmode',
    label: darkMode ? 'Light Mode' : 'Dark Mode',
    icon: darkMode ? () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg> : () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>,
    onClick: onToggleDarkMode
  }, {
    id: 'help',
    label: 'Help',
    icon: HelpCircle
  }] as any[];
  const SidebarContent = () => <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {(!collapsed || mobileMenuOpen) && <motion.div initial={{
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
                <h1 className="text-xl font-bold text-gray-900">Koto</h1>
              </motion.div>}
          </AnimatePresence>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={mobileMenuOpen ? onCloseMobileMenu : onToggleCollapse}
          >
            {mobileMenuOpen ? <ChevronLeft className="w-5 h-5 text-gray-600" /> : collapsed ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map(item => <Button 
            key={item.id} 
            variant={activeTab === item.tab ? "default" : "ghost"} 
            onClick={() => onTabChange(item.tab)} 
            className={`w-full justify-start space-x-3 h-auto py-3 ${activeTab === item.tab ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-gray-700'}`}
          >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {(!collapsed || mobileMenuOpen) && <motion.span initial={{
              opacity: 0,
              x: -10
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -10
            }} className="font-medium">
                    {item.label}
                  </motion.span>}
              </AnimatePresence>
            </Button>)}
        </div>

        {/* Quick Tools Section */}
        {activeTab === 'toolbox' && (!collapsed || mobileMenuOpen) && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
              Quick Access
            </h3>
            <div className="space-y-1">
              {tools.slice(0, 3).map(tool => <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group">
                  <span className="text-lg">{tool.logo}</span>
                  <span className="text-sm font-medium flex-1">{tool.name}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                </a>)}
            </div>
          </motion.div>}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          {bottomItems.map(item => <Button 
            key={item.id} 
            variant="ghost" 
            className="w-full justify-start space-x-3 h-auto py-3 text-gray-700"
          >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {(!collapsed || mobileMenuOpen) && <motion.span initial={{
              opacity: 0,
              x: -10
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -10
            }} className="font-medium">
                    {item.label}
                  </motion.span>}
              </AnimatePresence>
            </Button>)}
        </div>
      </div>
    </div>;
  return <>
      {/* Desktop Sidebar */}
      <motion.aside variants={sidebarVariants} animate={collapsed ? 'collapsed' : 'expanded'} transition={{
      duration: 0.3,
      ease: 'easeInOut'
    }} className="hidden md:block h-full flex-shrink-0">
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && <motion.aside variants={mobileSidebarVariants} initial="closed" animate="open" exit="closed" transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }} className="fixed left-0 top-0 h-full w-80 z-50 md:hidden">
            <SidebarContent />
          </motion.aside>}
      </AnimatePresence>
    </>;
};
export default Sidebar;