"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Loader2, Globe, Sparkles } from 'lucide-react';
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
  mpid?: string;
}
const NewToolDialog: React.FC<NewToolDialogProps> = ({
  open,
  onClose,
  onSave
}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('smileys');
  const categories = ['Design', 'Development', 'Productivity', 'Marketing', 'Analytics', 'Communication', 'Finance', 'Education'];
  const emojiCategories = [{
    id: 'smileys',
    name: 'Smileys',
    icon: '😀',
    mpid: "a721f726-f033-477c-9515-6af860762c21"
  }, {
    id: 'people',
    name: 'People',
    icon: '👤',
    mpid: "00ff88b6-8a37-44aa-ad0f-c23754ac9125"
  }, {
    id: 'animals',
    name: 'Animals',
    icon: '🐶',
    mpid: "8d8bb16e-6758-4c0b-8606-fd14a73eef78"
  }, {
    id: 'food',
    name: 'Food',
    icon: '🍎',
    mpid: "f4a6e8b1-13d4-4d78-9cb4-78b05a2bedbe"
  }, {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    mpid: "14dc75b1-f7af-4a48-b6b1-611136a34c08"
  }, {
    id: 'activities',
    name: 'Activities',
    icon: '⚽',
    mpid: "a8bb0665-6246-433d-8076-dedd6154253e"
  }, {
    id: 'objects',
    name: 'Objects',
    icon: '💡',
    mpid: "3c21f7c1-f39d-47ed-be3d-bda6e0257ac7"
  }, {
    id: 'symbols',
    name: 'Symbols',
    icon: '❤️',
    mpid: "47e55f79-4faa-4b30-b7de-af38c93a4c8e"
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
          const domain = new URL(newUrl).hostname.replace('www.', '');
          const siteName = domain.split('.')[0];

          // Basic auto-fill based on common sites
          const siteInfo = getSiteInfo(domain);
          setName(siteInfo.name || siteName.charAt(0).toUpperCase() + siteName.slice(1));
          setCategory(siteInfo.category || 'Productivity');
          setLogo(siteInfo.logo || '🔗');
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
      logo: string;
      description: string;
    }> = {
      'figma.com': {
        name: 'Figma',
        category: 'Design',
        logo: '🎨',
        description: 'Collaborative interface design tool'
      },
      'github.com': {
        name: 'GitHub',
        category: 'Development',
        logo: '💻',
        description: 'Code hosting and collaboration platform'
      },
      'notion.so': {
        name: 'Notion',
        category: 'Productivity',
        logo: '📝',
        description: 'All-in-one workspace for notes and collaboration'
      },
      'slack.com': {
        name: 'Slack',
        category: 'Communication',
        logo: '💬',
        description: 'Team communication and collaboration'
      },
      'trello.com': {
        name: 'Trello',
        category: 'Productivity',
        logo: '📋',
        description: 'Visual project management tool'
      },
      'canva.com': {
        name: 'Canva',
        category: 'Design',
        logo: '🎨',
        description: 'Easy-to-use design platform'
      }
    };
    return siteMap[domain] || {
      name: '',
      category: '',
      logo: '',
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
  return <AnimatePresence data-magicpath-id="0" data-magicpath-path="NewToolDialog.tsx">
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-magicpath-id="1" data-magicpath-path="NewToolDialog.tsx">
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black bg-opacity-50" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={handleClose} data-magicpath-id="2" data-magicpath-path="NewToolDialog.tsx" />

          {/* Dialog */}
          <motion.div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden" initial={{
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
      }} data-magicpath-id="3" data-magicpath-path="NewToolDialog.tsx">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200" data-magicpath-id="4" data-magicpath-path="NewToolDialog.tsx">
              <div className="flex items-center space-x-3" data-magicpath-id="5" data-magicpath-path="NewToolDialog.tsx">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center" data-magicpath-id="6" data-magicpath-path="NewToolDialog.tsx">
                  <Link className="w-5 h-5 text-indigo-600" data-magicpath-id="7" data-magicpath-path="NewToolDialog.tsx" />
                </div>
                <div data-magicpath-id="8" data-magicpath-path="NewToolDialog.tsx">
                  <h2 className="text-xl font-semibold text-gray-900" data-magicpath-id="9" data-magicpath-path="NewToolDialog.tsx">Add New Tool</h2>
                  <p className="text-sm text-gray-500" data-magicpath-id="10" data-magicpath-path="NewToolDialog.tsx">Paste a URL for automatic info filling</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="11" data-magicpath-path="NewToolDialog.tsx">
                <X className="w-5 h-5 text-gray-500" data-magicpath-id="12" data-magicpath-path="NewToolDialog.tsx" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6" data-magicpath-id="13" data-magicpath-path="NewToolDialog.tsx">
              {/* URL Input */}
              <div data-magicpath-id="14" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="15" data-magicpath-path="NewToolDialog.tsx">
                  Website URL *
                </label>
                <div className="relative" data-magicpath-id="16" data-magicpath-path="NewToolDialog.tsx">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-magicpath-id="17" data-magicpath-path="NewToolDialog.tsx">
                    <Globe className="h-5 w-5 text-gray-400" data-magicpath-id="18" data-magicpath-path="NewToolDialog.tsx" />
                  </div>
                  <input type="url" id="url" value={url} onChange={e => handleUrlChange(e.target.value)} placeholder="https://example.com" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required data-magicpath-id="19" data-magicpath-path="NewToolDialog.tsx" />
                  {isAnalyzing && <div className="absolute inset-y-0 right-0 pr-3 flex items-center" data-magicpath-id="20" data-magicpath-path="NewToolDialog.tsx">
                      <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" data-magicpath-id="21" data-magicpath-path="NewToolDialog.tsx" />
                    </div>}
                </div>
                {isAnalyzing && <div className="mt-2 flex items-center text-sm text-indigo-600" data-magicpath-id="22" data-magicpath-path="NewToolDialog.tsx">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Analyzing website and auto-filling information...
                  </div>}
              </div>

              {/* Name Input */}
              <div data-magicpath-id="23" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="24" data-magicpath-path="NewToolDialog.tsx">
                  Tool Name *
                </label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Figma" className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required data-magicpath-id="25" data-magicpath-path="NewToolDialog.tsx" />
              </div>

              {/* Category Select */}
              <div data-magicpath-id="26" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="27" data-magicpath-path="NewToolDialog.tsx">
                  Category *
                </label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required data-magicpath-id="28" data-magicpath-path="NewToolDialog.tsx">
                  <option value="" data-magicpath-id="29" data-magicpath-path="NewToolDialog.tsx">Select a category</option>
                  {categories.map(cat => <option key={cat} value={cat} data-magicpath-uuid={(cat as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="NewToolDialog.tsx">
                      {cat}
                    </option>)}
                </select>
              </div>

              {/* Logo Input */}
              <div data-magicpath-id="31" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="32" data-magicpath-path="NewToolDialog.tsx">
                  Logo (Emoji)
                </label>
                <div className="relative" data-magicpath-id="33" data-magicpath-path="NewToolDialog.tsx">
                  <div className="flex items-center space-x-3" data-magicpath-id="34" data-magicpath-path="NewToolDialog.tsx">
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-12 h-12 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 hover:scale-105 active:scale-95" data-magicpath-id="35" data-magicpath-path="NewToolDialog.tsx">
                      {logo || '🔗'}
                    </button>
                    <input type="text" id="logo" value={logo} onChange={e => setLogo(e.target.value)} placeholder="Tap to choose emoji" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50" maxLength={2} readOnly data-magicpath-id="36" data-magicpath-path="NewToolDialog.tsx" />
                  </div>

                  {/* iOS-style Emoji Picker */}
                  <AnimatePresence data-magicpath-id="37" data-magicpath-path="NewToolDialog.tsx">
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
                }} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50" data-magicpath-id="38" data-magicpath-path="NewToolDialog.tsx">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-100 bg-gray-50" data-magicpath-id="39" data-magicpath-path="NewToolDialog.tsx">
                          <div className="relative" data-magicpath-id="40" data-magicpath-path="NewToolDialog.tsx">
                            <input type="text" placeholder="Search emojis..." value={emojiSearchQuery} onChange={e => setEmojiSearchQuery(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" data-magicpath-id="41" data-magicpath-path="NewToolDialog.tsx" />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" data-magicpath-id="42" data-magicpath-path="NewToolDialog.tsx">
                              🔍
                            </div>
                          </div>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex overflow-x-auto bg-gray-50 border-b border-gray-100" data-magicpath-id="43" data-magicpath-path="NewToolDialog.tsx">
                          {emojiCategories.map(cat => <button key={cat.id} type="button" onClick={() => setSelectedEmojiCategory(cat.id)} className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${selectedEmojiCategory === cat.id ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`} data-magicpath-uuid={(cat as any)["mpid"] ?? "unsafe"} data-magicpath-id="44" data-magicpath-path="NewToolDialog.tsx">
                              <span className="text-lg mr-1" data-magicpath-uuid={(cat as any)["mpid"] ?? "unsafe"} data-magicpath-field="icon:string" data-magicpath-id="45" data-magicpath-path="NewToolDialog.tsx">{cat.icon}</span>
                              <span className="hidden sm:inline" data-magicpath-uuid={(cat as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:string" data-magicpath-id="46" data-magicpath-path="NewToolDialog.tsx">{cat.name}</span>
                            </button>)}
                        </div>

                        {/* Emoji Grid */}
                        <div className="p-4 max-h-64 overflow-y-auto" data-magicpath-id="47" data-magicpath-path="NewToolDialog.tsx">
                          <div className="grid grid-cols-8 gap-2" data-magicpath-id="48" data-magicpath-path="NewToolDialog.tsx">
                            {filteredEmojis.map((emoji, index) => <motion.button key={`${emoji}-${index}`} type="button" onClick={() => {
                        setLogo(emoji);
                        setShowEmojiPicker(false);
                      }} className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-colors" whileHover={{
                        scale: 1.2
                      }} whileTap={{
                        scale: 0.9
                      }} data-magicpath-uuid={(emoji as any)["mpid"] ?? "unsafe"} data-magicpath-id="49" data-magicpath-path="NewToolDialog.tsx">
                                {emoji}
                              </motion.button>)}
                          </div>
                          {filteredEmojis.length === 0 && <div className="text-center py-8 text-gray-500" data-magicpath-id="50" data-magicpath-path="NewToolDialog.tsx">
                              <div className="text-2xl mb-2" data-magicpath-id="51" data-magicpath-path="NewToolDialog.tsx">🔍</div>
                              <p className="text-sm" data-magicpath-id="52" data-magicpath-path="NewToolDialog.tsx">No emojis found</p>
                            </div>}
                        </div>

                        {/* Recently Used (placeholder) */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50" data-magicpath-id="53" data-magicpath-path="NewToolDialog.tsx">
                          <p className="text-xs text-gray-500 mb-2" data-magicpath-id="54" data-magicpath-path="NewToolDialog.tsx">Recently Used</p>
                          <div className="flex space-x-2" data-magicpath-id="55" data-magicpath-path="NewToolDialog.tsx">
                            {['🎨', '💻', '📱', '🚀', '💡', '🔧'].map((emoji, index) => <button key={index} type="button" onClick={() => {
                        setLogo(emoji);
                        setShowEmojiPicker(false);
                      }} className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 rounded-lg transition-colors" data-magicpath-id="56" data-magicpath-path="NewToolDialog.tsx">
                                {emoji}
                              </button>)}
                          </div>
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                </div>
              </div>

              {/* Description Input */}
              <div data-magicpath-id="57" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="58" data-magicpath-path="NewToolDialog.tsx">
                  Description
                </label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of what this tool does..." rows={3} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none" data-magicpath-id="59" data-magicpath-path="NewToolDialog.tsx" />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4" data-magicpath-id="60" data-magicpath-path="NewToolDialog.tsx">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="61" data-magicpath-path="NewToolDialog.tsx">
                  Cancel
                </button>
                <motion.button type="submit" disabled={!name || !url || !category || isAnalyzing} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} data-magicpath-id="62" data-magicpath-path="NewToolDialog.tsx">
                  Add Tool
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>}
    </AnimatePresence>;
};
export default NewToolDialog;