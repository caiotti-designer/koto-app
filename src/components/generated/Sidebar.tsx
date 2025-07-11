import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquare, Wrench, Settings, HelpCircle, ExternalLink } from 'lucide-react';
interface Tool {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
  mpid?: string;
}
interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  activeTab: 'prompts' | 'toolbox';
  onTabChange: (tab: 'prompts' | 'toolbox') => void;
  tools: Tool[];
  mpid?: string;
}
const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileMenuOpen,
  onCloseMobileMenu,
  activeTab,
  onTabChange,
  tools
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
    tab: 'prompts' as const,
    mpid: "7d313e07-6980-41f8-ac94-d0e2b1411a58"
  }, {
    id: 'toolbox',
    label: 'Tool Box',
    icon: Wrench,
    tab: 'toolbox' as const,
    mpid: "35d328bb-2621-43ec-a1ac-0f80d4717787"
  }] as any[];
  const bottomItems = [{
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    mpid: "3d7e61ff-a5b2-4a5c-8334-303b1182ef99"
  }, {
    id: 'help',
    label: 'Help',
    icon: HelpCircle,
    mpid: "7285715b-a0b8-4cd1-af27-d59c2aa99351"
  }] as any[];
  const SidebarContent = () => <div className="h-full flex flex-col bg-white border-r border-gray-200" data-magicpath-id="0" data-magicpath-path="Sidebar.tsx">
      {/* Header */}
      <div className="p-6 border-b border-gray-200" data-magicpath-id="1" data-magicpath-path="Sidebar.tsx">
        <div className="flex items-center justify-between" data-magicpath-id="2" data-magicpath-path="Sidebar.tsx">
          <AnimatePresence mode="wait" data-magicpath-id="3" data-magicpath-path="Sidebar.tsx">
            {(!collapsed || mobileMenuOpen) && <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="flex items-center space-x-3" data-magicpath-id="4" data-magicpath-path="Sidebar.tsx">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center" data-magicpath-id="5" data-magicpath-path="Sidebar.tsx">
                  <span className="text-white font-bold text-lg" data-magicpath-id="6" data-magicpath-path="Sidebar.tsx">K</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900" data-magicpath-id="7" data-magicpath-path="Sidebar.tsx">Koto</h1>
              </motion.div>}
          </AnimatePresence>
          
          <button onClick={mobileMenuOpen ? onCloseMobileMenu : onToggleCollapse} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="8" data-magicpath-path="Sidebar.tsx">
            {mobileMenuOpen ? <ChevronLeft className="w-5 h-5 text-gray-600" data-magicpath-id="9" data-magicpath-path="Sidebar.tsx" /> : collapsed ? <ChevronRight className="w-5 h-5 text-gray-600" data-magicpath-id="10" data-magicpath-path="Sidebar.tsx" /> : <ChevronLeft className="w-5 h-5 text-gray-600" data-magicpath-id="11" data-magicpath-path="Sidebar.tsx" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" data-magicpath-id="12" data-magicpath-path="Sidebar.tsx">
        <div className="space-y-2" data-magicpath-id="13" data-magicpath-path="Sidebar.tsx">
          {navItems.map(item => <button key={item.id} onClick={() => onTabChange(item.tab)} className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${activeTab === item.tab ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-gray-700 hover:bg-gray-100'}`} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="14" data-magicpath-path="Sidebar.tsx">
              <item.icon className="w-5 h-5 flex-shrink-0" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="15" data-magicpath-path="Sidebar.tsx" />
              <AnimatePresence mode="wait" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="16" data-magicpath-path="Sidebar.tsx">
                {(!collapsed || mobileMenuOpen) && <motion.span initial={{
              opacity: 0,
              x: -10
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -10
            }} className="font-medium" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="17" data-magicpath-path="Sidebar.tsx">
                    {item.label}
                  </motion.span>}
              </AnimatePresence>
            </button>)}
        </div>

        {/* Quick Tools Section */}
        {activeTab === 'toolbox' && (!collapsed || mobileMenuOpen) && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mt-8" data-magicpath-id="18" data-magicpath-path="Sidebar.tsx">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3" data-magicpath-id="19" data-magicpath-path="Sidebar.tsx">
              Quick Access
            </h3>
            <div className="space-y-1" data-magicpath-id="20" data-magicpath-path="Sidebar.tsx">
              {tools.slice(0, 3).map(tool => <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group">
                  <span className="text-lg" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="logo:unknown" data-magicpath-id="21" data-magicpath-path="Sidebar.tsx">{tool.logo}</span>
                  <span className="text-sm font-medium flex-1" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="22" data-magicpath-path="Sidebar.tsx">{tool.name}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="23" data-magicpath-path="Sidebar.tsx" />
                </a>)}
            </div>
          </motion.div>}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200" data-magicpath-id="24" data-magicpath-path="Sidebar.tsx">
        <div className="space-y-2" data-magicpath-id="25" data-magicpath-path="Sidebar.tsx">
          {bottomItems.map(item => <button key={item.id} className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="Sidebar.tsx">
              <item.icon className="w-5 h-5 flex-shrink-0" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="Sidebar.tsx" />
              <AnimatePresence mode="wait" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="28" data-magicpath-path="Sidebar.tsx">
                {(!collapsed || mobileMenuOpen) && <motion.span initial={{
              opacity: 0,
              x: -10
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -10
            }} className="font-medium" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="29" data-magicpath-path="Sidebar.tsx">
                    {item.label}
                  </motion.span>}
              </AnimatePresence>
            </button>)}
        </div>
      </div>
    </div>;
  return <>
      {/* Desktop Sidebar */}
      <motion.aside variants={sidebarVariants} animate={collapsed ? 'collapsed' : 'expanded'} transition={{
      duration: 0.3,
      ease: 'easeInOut'
    }} className="hidden md:block h-full flex-shrink-0" data-magicpath-id="30" data-magicpath-path="Sidebar.tsx">
        <SidebarContent data-magicpath-id="31" data-magicpath-path="Sidebar.tsx" />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence data-magicpath-id="32" data-magicpath-path="Sidebar.tsx">
        {mobileMenuOpen && <motion.aside variants={mobileSidebarVariants} initial="closed" animate="open" exit="closed" transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }} className="fixed left-0 top-0 h-full w-80 z-50 md:hidden" data-magicpath-id="33" data-magicpath-path="Sidebar.tsx">
            <SidebarContent data-magicpath-id="34" data-magicpath-path="Sidebar.tsx" />
          </motion.aside>}
      </AnimatePresence>
    </>;
};
export default Sidebar;