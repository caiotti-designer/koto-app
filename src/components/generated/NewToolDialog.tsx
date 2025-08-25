"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Loader2, Globe, Sparkles, Plus, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useTheme } from '../../contexts/ThemeContext';
interface NewToolDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (toolData: {
    name: string;
    url: string;
    category: string;
    logo: string;
    description?: string;
  }) => void;
  onAddStack?: () => void;
  availableStacks?: Array<{ id: string; name: string; }>;
}
const NewToolDialog: React.FC<NewToolDialogProps> = ({
  open,
  onClose,
  onSave,
  onAddStack,
  availableStacks = []
}) => {
  const { theme } = useTheme();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showStackDropdown, setShowStackDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('smileys');
  const categories = ['Design', 'Development', 'Productivity', 'Marketing', 'Analytics', 'Communication', 'Finance', 'Education'];
  const emojiCategories = [{
    id: 'smileys',
    name: 'Smileys',
    icon: '😀'
  }, {
    id: 'people',
    name: 'People',
    icon: '👤'
  }, {
    id: 'animals',
    name: 'Animals',
    icon: '🐶'
  }, {
    id: 'food',
    name: 'Food',
    icon: '🍎'
  }, {
    id: 'travel',
    name: 'Travel',
    icon: '✈️'
  }, {
    id: 'activities',
    name: 'Activities',
    icon: '⚽'
  }, {
    id: 'objects',
    name: 'Objects',
    icon: '💡'
  }, {
    id: 'symbols',
    name: 'Symbols',
    icon: '❤️'
  }] as any[];
  const emojiData = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
    people: ['👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇', '🚶', '🧍', '🧎', '🏃', '💃', '🕺', '🕴️', '👯', '🧖', '🧗', '🏇', '⛷️', '🏂', '🏌️', '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🚵', '🤸', '🤼', '🤽', '🤾', '🤹', '🧘', '🛀', '🛌'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚉', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚟', '🚠', '🚡', '⛴️', '🛥️', '🚤', '⛵', '🛶', '🚣', '🛟', '⚓', '⛽', '🚧', '🚨', '🚥', '🚦', '🛑', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🛖', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤸', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🪘', '🎹', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🎲', '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴', '🎯', '🎳'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🪚', '🔩', '⚙️', '🪤', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪠', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🪆', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🪅', '🎊', '🎉', '🪩', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '🪧', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📅', '📆', '📇', '🗃️', '🗳️', '🗄️', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  };
  const filteredEmojis = emojiSearchQuery ? emojiData[selectedEmojiCategory].filter(emoji =>
  // Simple search - could be enhanced with emoji names/keywords
  emoji.includes(emojiSearchQuery)) : emojiData[selectedEmojiCategory];
  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);

    // Auto-fill logic when URL is pasted
    if (newUrl && newUrl.startsWith('http')) {
      setIsAnalyzing(true);

      // Simulate AI analysis delay
      setTimeout(() => {
        // Extract domain name for basic info
        try {
          const urlObj = new URL(newUrl);
          const domain = urlObj.hostname.replace('www.', '');
          const siteName = domain.split('.')[0];

          // Get favicon URL using Google's favicon service
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

          // Basic auto-fill based on common sites
          const siteInfo = getSiteInfo(domain);
          setName(siteInfo.name || siteName.charAt(0).toUpperCase() + siteName.slice(1));
          setCategory(siteInfo.category || 'Productivity');
          setLogo(faviconUrl); // Use favicon URL instead of emoji
          setDescription(siteInfo.description || `A useful tool from ${domain}`);
        } catch (error) {
          console.error('Error parsing URL:', error);
        }
        setIsAnalyzing(false);
      }, 1500);
    }
  };
  const getSiteInfo = (domain: string) => {
    const siteMap: Record<string, {
      name: string;
      category: string;
      description: string;
    }> = {
      'figma.com': {
        name: 'Figma',
        category: 'Design',
        description: 'Collaborative interface design tool'
      },
      'github.com': {
        name: 'GitHub',
        category: 'Development',
        description: 'Code hosting and collaboration platform'
      },
      'notion.so': {
        name: 'Notion',
        category: 'Productivity',
        description: 'All-in-one workspace for notes and collaboration'
      },
      'slack.com': {
        name: 'Slack',
        category: 'Communication',
        description: 'Team communication and collaboration'
      },
      'trello.com': {
        name: 'Trello',
        category: 'Productivity',
        description: 'Visual project management tool'
      },
      'canva.com': {
        name: 'Canva',
        category: 'Design',
        description: 'Easy-to-use design platform'
      }
    };
    return siteMap[domain] || {
      name: '',
      category: '',
      description: ''
    };
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && url && category) {
      onSave({
        name,
        url,
        category,
        logo: logo || '🔗',
        description
      });
      handleClose();
    }
  };
  const handleClose = () => {
    setUrl('');
    setName('');
    setCategory('');
    setLogo('');
    setDescription('');
    setIsAnalyzing(false);
    onClose();
  };
  return <AnimatePresence>
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={handleClose} />

          {/* Dialog */}
          <motion.div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col" initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} transition={{
        type: "spring",
        duration: 0.3
      }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <Link className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Tool</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Paste a URL for automatic info filling</p>
                </div>
              </div>
              <Button onClick={handleClose} variant="ghost" size="icon" className="p-2">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </Button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* URL Input */}
              <div>
                <Label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Website URL *
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                  </div>
                  <Input type="url" id="url" value={url} onChange={e => handleUrlChange(e.target.value)} placeholder="https://example.com" className="block w-full pl-10 pr-3 py-3 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400" required />
                  {isAnalyzing && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
                    </div>}
                </div>
                {isAnalyzing && <div className="mt-2 flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Analyzing website and auto-filling information...
                  </div>}
              </div>

              {/* Name Input */}
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Tool Name *
                </Label>
                <Input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Figma" className="block w-full px-3 py-3 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400" required />
              </div>

              {/* Description Input */}
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of what this tool does..." rows={3} className="block w-full px-3 py-3 resize-none bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400" />
              </div>

              {/* Stack Selection */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Stacks
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white appearance-none">
                      <option value="">Select a stack</option>
                      {availableStacks.map(stack => <option key={stack.id} value={stack.name}>
                          {stack.name}
                        </option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  
                  {onAddStack && <button type="button" onClick={onAddStack} className="w-full flex items-center justify-center space-x-2 px-3 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-gray-400 dark:hover:border-slate-500 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Add new stack</span>
                    </button>}
                </div>
              </div>

              {/* Logo Input */}
              <div>
                <Label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Logo (Favicon)
                </Label>
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl flex items-center justify-center overflow-hidden">
                      {logo && logo.startsWith('http') ? (
                        <img 
                          src={logo} 
                          alt="Site favicon" 
                          className="w-8 h-8 rounded-lg" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }} 
                        />
                      ) : (
                        <span className="text-2xl">{logo || '🔗'}</span>
                      )}
                    </div>
                    <Button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} variant="outline" className="text-sm px-3 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg">
                      Choose Emoji
                    </Button>
                    <Input type="text" id="logo" value={logo} onChange={e => setLogo(e.target.value)} placeholder="Auto-filled from URL or enter custom" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400" />
                  </div>

                  {/* iOS-style Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && <motion.div initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }} transition={{
                  type: "spring",
                  duration: 0.3
                }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        {/* Emoji picker backdrop */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEmojiPicker(false)} />
                        
                        {/* Emoji picker content */}
                        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden w-full max-w-md max-h-[80vh]">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700">
                          <div className="relative">
                            <input type="text" placeholder="Search emojis..." value={emojiSearchQuery} onChange={e => setEmojiSearchQuery(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500">
                              🔍
                            </div>
                          </div>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex overflow-x-auto bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-600">
                          {emojiCategories.map(cat => <button key={cat.id} type="button" onClick={() => setSelectedEmojiCategory(cat.id)} className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${selectedEmojiCategory === cat.id ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800' : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-600'}`}>
                              <span className="text-lg mr-1">{cat.icon}</span>
                              <span className="hidden sm:inline">{cat.name}</span>
                            </button>)}
                        </div>

                        {/* Emoji Grid */}
                        <div className="p-4 max-h-64 overflow-y-auto">
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {filteredEmojis.map((emoji, index) => <motion.button key={`${emoji}-${index}`} type="button" onClick={() => {
                          setLogo(emoji);
                          setShowEmojiPicker(false);
                        }} className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" whileHover={{
                          scale: 1.2
                        }} whileTap={{
                          scale: 0.9
                        }}>
                                {emoji}
                              </motion.button>)}
                          </div>
                          {filteredEmojis.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                              <div className="text-2xl mb-2">🔍</div>
                              <p className="text-sm">No emojis found</p>
                            </div>}
                        </div>

                        {/* Recently Used (placeholder) */}
                        <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700">
                          <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Recently Used</p>
                          <div className="flex space-x-2">
                            {['🎨', '💻', '📱', '🚀', '💡', '🔧'].map((emoji, index) => <button key={index} type="button" onClick={() => {
                          setLogo(emoji);
                          setShowEmojiPicker(false);
                        }} className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                {emoji}
                              </button>)}
                          </div>
                        </div>
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of what this tool does..." rows={3} className="block w-full px-3 py-3 resize-none bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400" />
              </div>



              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button type="button" onClick={handleClose} variant="ghost" className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Cancel
                </Button>
                <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                  <Button type="submit" disabled={!name || !url || !category || isAnalyzing} className="px-6 py-2">
                    Add Tool
                  </Button>
                </motion.div>
              </div>
            </form>
            </div>
          </motion.div>
        </div>}
    </AnimatePresence>;
};
export default NewToolDialog;