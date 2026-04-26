import React, { useState } from 'react';
import LLMArchive from './LLMArchive';
import JEPAArchive from './JEPAArchive';
import InfoModal from './components/InfoModal';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<'llm' | 'jepa'>('llm');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="h-screen w-screen relative bg-[#0c001a] overflow-hidden flex flex-col font-mono text-[#00ff41]">
      {/* Top Terminal Tabs Navigation */}
      <div className="flex-none p-2 border-b-2 border-cyan-400/50 bg-black/80 flex items-center z-[999]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div 
            onClick={() => setShowInfoModal(true)}
            className="h-8 font-pixel text-[12px] text-cyan-400 border border-cyan-400 px-3 flex items-center shadow-[0_0_8px_rgba(34,211,238,0.3)] bg-black/50 cursor-pointer hover:bg-cyan-900/40 transition-colors group gap-1"
          >
            <div className="flex items-end h-4 gap-[2px] opacity-80 group-hover:opacity-100 group-hover:text-[#00ff41] transition-colors">
              <div className="w-[3px] h-full bg-red-500 group-hover:bg-[#00ff41] animate-eq-1 transition-colors"></div>
              <div className="w-[3px] h-full bg-red-500 group-hover:bg-[#00ff41] animate-eq-2 transition-colors"></div>
              <div className="w-[3px] h-full bg-red-500 group-hover:bg-[#00ff41] animate-eq-3 transition-colors"></div>
              <div className="w-[3px] h-full bg-red-500 group-hover:bg-[#00ff41] animate-eq-4 transition-colors"></div>
              <div className="w-[3px] h-full bg-red-500 group-hover:bg-[#00ff41] animate-eq-5 transition-colors"></div>
            </div>
            {/* Optional: if you want the text to completely disappear, comment or remove following span */}
          </div>
          
          <button
            onClick={toggleLanguage}
            className="h-8 font-pixel text-[12px] text-yellow-400 border border-yellow-400 px-3 flex items-center justify-center gap-1 shadow-[0_0_8px_rgba(250,204,21,0.3)] bg-black/50 cursor-pointer hover:bg-yellow-900/40 transition-colors"
          >
            <span className="mt-[2px]">[</span>
            <span className={`mt-[2px] ${language !== 'zh' ? '-translate-y-[1px]' : ''}`}>{language === 'zh' ? 'EN' : '中'}</span>
            <span className="mt-[2px]">]</span>
          </button>

          <button
          onClick={() => setActiveTab('llm')}
          className={`cursor-pointer h-8 flex items-center px-4 border transition-all ${
            activeTab === 'llm' 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
              : 'bg-transparent border-gray-600 text-gray-400 hover:border-cyan-400/50 hover:text-cyan-400/80'
          }`}
        >
          <span className="font-sans font-bold text-[14px] leading-none tracking-widest whitespace-nowrap mt-[2px] flex items-center gap-1.5">
            <span className="animate-pulse text-[24px] font-normal leading-[14px] relative -top-[1px]">◆</span> LLM
          </span>
        </button>

        <button
          onClick={() => setActiveTab('jepa')}
          className={`cursor-pointer h-8 flex items-center px-4 border transition-all ${
            activeTab === 'jepa' 
              ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
              : 'bg-transparent border-gray-600 text-gray-400 hover:border-purple-400/50 hover:text-purple-400/80'
          }`}
        >
          <span className="font-sans font-bold text-[14px] leading-none tracking-widest whitespace-nowrap mt-[2px] flex items-center gap-1.5">
            <span className="animate-pulse text-[24px] font-normal leading-[14px] relative -top-[1px]">◇</span> JEPA
          </span>
        </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'llm' ? (
          <LLMArchive />
        ) : (
          <JEPAArchive />
        )}
      </div>

      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
    </div>
  );
}
