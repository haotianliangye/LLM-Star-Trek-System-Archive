/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- DATA DEFINITIONS ---

interface ConceptNode {
  id: string;
  en: string;
  cn: string;
  icon: string;
  color: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  archive: string;
  metaphor: string;
  desc: string;
}

const CONCEPTS: ConceptNode[] = [
  {
    id: 'token', en: 'TOKEN', cn: '[符号碎片]', icon: 'abc', color: '#9CA3AF',
    x: 8, y: 40,
    archive: '基本粒子：Token',
    metaphor: '"符号的碎片，在被赋予能量前只是虚无的编号。"',
    desc: '原始符号的碎片（词、子词），每个 token 都有一个整数 ID。经由 Embedding，ID 被唤醒为初始向量——所以 Token 只是名字，向量才是真正的语义实体。'
  },
  {
    id: 'vector', en: 'VECTOR', cn: '[原子]', icon: '◈', color: '#E11D48',
    x: 18, y: 40,
    archive: '基本粒子：Vector',
    metaphor: '"指引方向的浮点数箭头，语义宇宙的量化本质。"',
    desc: '语义宇宙的最小单位——一个有序的浮点数列表。几何上它是从原点指向某点的箭头：方向编码语义类别，长度编码强度。一切信息变换的原子操作。'
  },
  {
    id: 'clip', en: 'CLIP', cn: '[翻译官]', icon: '▣', color: '#C026D3',
    x: 18, y: 21,
    archive: '跨模态翻译：CLIP',
    metaphor: '"打破维度壁垒的星际翻译官，让图与文在同一坐标系下共舞。"',
    desc: '训练视觉和文本编码器，用对比学习强制匹配的图文向量在 Latent Space 中占据同一坐标。以文搜图、零样本分类的基础。'
  },
  {
    id: 'embedding', en: 'EMBEDDING', cn: '[传送门]', icon: '🚪', color: '#3B82F6',
    x: 28, y: 40,
    archive: '定位工具：Embedding',
    metaphor: '"将离散羊群精准驱赶到宇宙坐标的星际传送牧羊人。"',
    desc: '把离散符号投射到 Latent Space 中的精确坐标。牧羊人把羊群赶到宇宙草场的特定角落。后续操作都建立在这些向量坐标之上。'
  },
  {
    id: 'latent', en: 'LATENT SPACE', cn: '[宇宙容器]', icon: '🌌', color: '#9333EA',
    x: 40, y: 40,
    archive: '宇宙本身：Latent Space',
    metaphor: '"一切皆有可能的平滑连续的高维空间。"',
    desc: '一个连读的高维向量空间。每个点就是向量。真实数据聚集成“语义星云”，空白区域无边无际。空间平滑且连续。'
  },
  {
    id: 'transformer', en: 'TRANSFORMER', cn: '[超级文明]', icon: '👾', color: '#EAB308',
    x: 58, y: 40,
    archive: '核心文明：Transformer',
    metaphor: '"占据宇宙最大片区域的超级文明，通过注意力机制在空间中导航。"',
    desc: '已经演化成熟的星际超级文明。输入 prompt，文明就在空间中沿路径不断生成下个 token 的向量。内核是多层注意力与前馈变换。'
  },
  {
    id: 'mamba', en: 'MAMBA', cn: '[流体文明]', icon: '🐍', color: '#16A34A',
    x: 40, y: 7,
    archive: '新宇宙动力学：Mamba',
    metaphor: '"摈弃所有人的互相注视，选择如流体般贯穿时间之矢的高效航行者。"',
    desc: '状态空间模型。序列视作连续信号，通过系统以递归形式高效更新内部状态，实现线性时间复杂度。像流过宇宙流体场。'
  },
  {
    id: 'speculative', en: 'SPECULATIVE', cn: '[预测舰]', icon: '📡', color: '#F43F5E',
    x: 88, y: 28,
    archive: '星际航行：投机解码',
    metaphor: '"快速插旗的侦察艇与后方暴力查验的主力旗舰完美配合。"',
    desc: '用小模型（侦察艇）快速猜想下一串 token，大模型（主力舰）一次性验证。只修正插错的，吞吐量大幅提升。'
  },
  {
    id: 'flash_attn', en: 'FLASH ATTN', cn: '[加速中继]', icon: '⚡\uFE0F', color: '#F97316',
    x: 88, y: 7,
    archive: '星际航行：FlashAttention',
    metaphor: '"局域广播中继，打破显存读写瓶颈的极速通道。"',
    desc: '通过分块技巧大幅减少显存访问。建立局域星际广播中继，节省信号通道，使长序列注意力极速攀升。'
  },
  {
    id: 'attention', en: 'ATTENTION', cn: '[探照灯]', icon: '🔦', color: '#06B6D4',
    x: 70, y: 28,
    archive: '微观机制：Attention',
    metaphor: '"恒星间的互相照亮与拉扯，用光斑指引下一次跃迁。"',
    desc: 'Q 与所有 K 做点积得到权重，再对 V 加权求和。让每颗星星动态决定向哪些邻居借力更新位置。'
  },
  {
    id: 'kv_cache', en: 'KV CACHE', cn: '[航行日志]', icon: '💾', color: '#14B8A6',
    x: 78, y: 49,
    archive: '微观机制：KV Cache',
    metaphor: '"母舰上刻录着每一颗途经星辰坐标的隐秘航行日志。"',
    desc: '新 token 只需计算自己的 QKV，并读取已暂存的 KV 缓存。飞船不必每次重绘星图，只需看日志和眼前。'
  },
  {
    id: 'moe', en: 'MOE', cn: '[专家特遣队]', icon: '👥', color: '#D97706',
    x: 88, y: 62,
    archive: '高效多任务：MoE',
    metaphor: '"庞大的休眠专家库与永远只唤醒最适合者的智能调度台。"',
    desc: '门控网络动态激活得分最高的少数专家计算，其余休眠。每次只唤醒需要的飞船。'
  },
  {
    id: 'reasoning', en: 'REASONING', cn: '[推理路径]', icon: '🚀', color: '#EA580C',
    x: 88, y: 79,
    archive: '深度探索：推理',
    metaphor: '"从单线链式跃迁到多路并发树探索的思维路线规划。"',
    desc: '从 Few-shot 看星图，到 CoT 链式跃迁，ToT 派多舰并行树搜索，再到 Self-Consistency 星际议会投票。'
  },
  {
    id: 'lora', en: 'LoRA', cn: '[便签贴]', icon: '🏷\uFE0F', color: '#64748B',
    x: 78, y: 7,
    archive: '文明新技能：LoRA',
    metaphor: '"贴在时间坐标轴上的轻量级导航便签，不触碰古老的主体星图。"',
    desc: '冻结原始权重，附加极小矩阵。不修改城市地图，只在路口贴热插拔的微小方向便签。'
  },
  {
    id: 'rlhf', en: 'RLHF/DPO', cn: '[航向校准]', icon: '⚖\uFE0F', color: '#10B981',
    x: 66, y: 79,
    archive: '人类偏好：对齐',
    metaphor: '"造物主下达的强制干预，纠正即将滑向深渊的有害轨道。"',
    desc: '人类评委或直接偏好打分，修正答案向量落向的“好区域”。文明内部重新规划星路对齐偏好。'
  },
  {
    id: 'rag', en: 'RAG', cn: '[外接馆]', icon: '📚', color: '#F59E0B',
    x: 18, y: 79,
    archive: '外置记忆库：RAG',
    metaphor: '"游离在星云边缘的阿卡夏记录，随时以钩爪抓取所需的上古卷轴。"',
    desc: '把相关典籍化作向量存入数据库。提问前抛出钩爪引出档案暂存入工作记忆。外化长期记忆。'
  },
  {
    id: 'quantize', en: 'QUANTIZE', cn: '[压缩星图]', icon: '📉', color: '#0D9488',
    x: 30, y: 79,
    archive: '星际航行：量化',
    metaphor: '"舍弃精微坐标系数换取极致便携的粗粒度三维网格。"',
    desc: '精度压至 INT8/INT4，把高精星图改为网格索引。略微偏移但大幅节省显存空间。'
  },
  {
    id: 'diffusion', en: 'DIFFUSION', cn: '[雕刻家]', icon: '🎨', color: '#D946EF',
    x: 40, y: 79,
    archive: '多模态生成：Diffusion',
    metaphor: '"从混沌的白噪音乱石堆中，一点点凿出惊世骇俗的形状。"',
    desc: '从纯噪声出发，在文本条件引导下逐步去噪重构像素。从混沌石料凿出雕像。'
  },
  {
    id: 'rope', en: 'RoPE', cn: '[位置编码]', icon: '🧭', color: '#14B8A6',
    x: 56, y: 7,
    archive: '微观机制：RoPE',
    metaphor: '"赋予无序符号以时间刻度，让词汇在星际空间中拥有绝对方向与相对距离。"',
    desc: '旋转位置编码，通过将词嵌入向量在复数空间中旋转特定的角度，为模型注入绝对位置信息，同时天然保持相对位置的衰减特性。'
  },
  {
    id: 'ffn', en: 'FFN', cn: '[前馈网络]', icon: '🧠', color: '#F43F5E',
    x: 70, y: 62,
    archive: '微观机制：FFN',
    metaphor: '"藏在庞大星云深处的知识仓库，每一次激活都是一次记忆的提取。"',
    desc: 'Transformer中除了Attention之外的另一大核心基石。Attention负责找寻线索，而FFN（或者MLP）负责在参数中回忆起训练时见过的知识。'
  },
  {
    id: 'rmsnorm', en: 'RMSNorm', cn: '[层归一化]', icon: '📏', color: '#8B5CF6',
    x: 64, y: 7,
    archive: '微观机制：RMSNorm',
    metaphor: '"平抑能量波动的星路稳定器，确保深层跃迁不会迷失在数值爆炸的黑洞中。"',
    desc: '一种高效的层归一化方法，去除了均值计算，只按均方根缩放，极大提升了模型在大规模堆叠层数时的训练稳定性和计算速度。'
  },
  {
    id: 'sft', en: 'SFT', cn: '[指令微调]', icon: '🎯', color: '#22C55E',
    x: 58, y: 62,
    archive: '人类偏好：SFT',
    metaphor: '"教导混沌文明理解人类问询的第一所学校。"',
    desc: '通过提供高质量的 (指令, 回复) 数据对，将一个单纯只会玩“文字接龙”的基础模型，引导成为听懂人类指令对话的助手（Supervised Fine-Tuning）。'
  },
  {
    id: 'dit', en: 'DiT', cn: '[架构跃迁]', icon: '🧬', color: '#FCD34D',
    x: 48, y: 62,
    archive: '架构融合：DiT',
    metaphor: '"借用超级文明的核心高能引擎，驱动混沌乱石的精细雕刻机。"',
    desc: 'Diffusion Transformer (DiT)。将 Transformer 的宏大架构引入扩散模型，替代传统的 U-Net 后，使得模型在图像与视频生成上获得了惊人的规模扩展能力（Scaling Law），成为诸如视频生成巨兽 Sora 等的底层基柱。'
  },
  {
    id: 'hybrid', en: 'HYBRID', cn: '[混合文明]', icon: '☯️', color: '#EC4899',
    x: 48, y: 28,
    archive: '架构融合：Hybrid',
    metaphor: '"将恒星的爆发力与流体的无尽续航完美交织的新型星际联合体。"',
    desc: '混合架构（如 Jamba）。融合了 Transformer 强大的高并发注意力理解能力和 Mamba 极低推理成本的线性状态空间机制。在不同层交替使用两种架构，达到既能打又能跑的终极全能态。'
  }
];

const LINKS = [
  { source: 'token', target: 'vector' },
  { source: 'clip', target: 'vector', dashed: true },
  { source: 'vector', target: 'embedding' },
  { source: 'embedding', target: 'latent' },
  { source: 'latent', target: 'transformer', dashed: true },
  { source: 'latent', target: 'mamba', dashed: true },
  { source: 'transformer', target: 'attention' },
  { source: 'transformer', target: 'kv_cache' },
  { source: 'transformer', target: 'ffn' },
  { source: 'transformer', target: 'rope' },
  { source: 'transformer', target: 'rmsnorm' },
  { source: 'ffn', target: 'moe', dashed: true },
  { source: 'attention', target: 'flash_attn', dashed: true },
  { source: 'transformer', target: 'speculative', dashed: true },
  { source: 'transformer', target: 'lora', dashed: true },
  { source: 'transformer', target: 'sft', dashed: true },
  { source: 'sft', target: 'rlhf' },
  { source: 'rlhf', target: 'reasoning', dashed: true },
  { source: 'latent', target: 'rag', dashed: true },
  { source: 'latent', target: 'quantize', dashed: true },
  { source: 'latent', target: 'diffusion', dashed: true },
  { source: 'diffusion', target: 'dit', dashed: true },
  { source: 'transformer', target: 'dit', dashed: true },
  { source: 'transformer', target: 'hybrid', dashed: true },
  { source: 'mamba', target: 'hybrid', dashed: true }
];

// --- COMPONENTS ---

const Starfield = () => {
  const [stars, setStars] = useState<{id: number, left: string, top: string, size: number, delay: number, dur: number, color: string}[]>([]);

  useEffect(() => {
    const colors = ['#fff', '#fff', '#4ade80', '#22d3ee', '#f472b6', '#fcd34d'];
    const generated = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1,
      delay: Math.random() * 5,
      dur: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c001a]">
      {stars.map((star) => (
        <div 
          key={star.id} 
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            animation: `twinkle ${star.dur}s ease-in-out ${star.delay}s infinite alternate`
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [nodes, setNodes] = useState<ConceptNode[]>(CONCEPTS);
  const [activeNodeId, setActiveNodeId] = useState<string>('latent');
  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStartPos = useRef<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingNodeId(id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newX = ((e.clientX - rect.left) / rect.width) * 100;
    let newY = ((e.clientY - rect.top) / rect.height) * 100;
    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));
    
    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, node: ConceptNode) => {
    if (draggingNodeId === node.id) {
       try {
         (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
       } catch (err) {}
       setDraggingNodeId(null);
       
       if (dragStartPos.current) {
          const dx = e.clientX - dragStartPos.current.x;
          const dy = e.clientY - dragStartPos.current.y;
          if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
             setActiveNodeId(node.id);
             setIsPanelOpen(true);
          }
       }
    }
  };

  // Chat state
  const [chatLog, setChatLog] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // When active Node changes, reset chat memory and log
  useEffect(() => {
    setChatLog([]);
    chatRef.current = null;

    if (isPanelOpen) {
      setTimeout(() => {
        const el = document.getElementById(`node-${activeNode.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 100); // Slight delay to allow transition to start/finish
    }
  }, [activeNode.id, isPanelOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const query = inputValue.trim();
    setInputValue("");
    setChatLog(prev => [...prev, { role: 'user', text: query }, { role: 'model', text: "" }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) {
        chatRef.current = ai.chats.create({
          model: "gemini-3.1-flash-lite-preview",
          config: {
            maxOutputTokens: 8192,
            systemInstruction: `You are the Cosmic AI Oracle, an ancient and highly advanced intelligence residing within the LLM Star Atlas. The user is asking about [${activeNode.en} - ${activeNode.cn}]. Reply playfully in a retro sci-fi 8-bit aesthetic. Use space/cyberpunk metaphors. IMPORTANT: You MUST reply in Chinese as the default language.`
          }
        });
      }
      const streamResponse = await chatRef.current.sendMessageStream({ message: query });
      
      let fullText = "";
      for await (const chunk of streamResponse) {
         fullText += chunk.text;
         setChatLog(prev => {
            const newLog = [...prev];
            newLog[newLog.length - 1].text = fullText;
            return newLog;
         });
      }
    } catch (error: any) {
      console.error(error);
      setChatLog(prev => {
         const newLog = [...prev];
         newLog[newLog.length - 1].text = `[ERROR: UPLINK FAILED. ${error?.message || error}]`;
         return newLog;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen w-screen relative font-mono text-[#00ff41] bg-[#0c001a] overflow-hidden flex">
      
      {/* Backgrounds */}
      <Starfield />
      <div className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%'
      }}></div>

      {/* Main Map Viewer Area */}
      <div className="flex-1 relative overflow-auto z-10 bg-black/40 transition-all duration-300">
        
        {/* HUD Overlay */}
        <div 
          onClick={() => setIsInfoModalOpen(true)}
          className="sticky top-4 left-4 z-20 inline-block border-2 border-white bg-black p-1 shadow-[0_0_10px_rgba(255,255,255,0.5)] cursor-pointer hover:bg-green-900/40 transition-colors group"
        >
          <div className="border border-[#00ff41] px-2 py-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00ff41] group-hover:bg-[#00ff41] animate-pulse"></div>
            <span className="text-cyan-400 group-hover:text-[#00ff41] transition-colors text-[10px] font-pixel tracking-wider">SYSTEM ONLINE // TOTAL CONCEPT MAPPED</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => setNodes(CONCEPTS)}
          className="absolute bottom-6 left-6 z-50 bg-black/80 border-2 border-cyan-400 text-cyan-400 px-4 py-2 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,65,0.5)] hover:bg-cyan-400 hover:text-black transition-all cursor-pointer group"
        >
          <span className="font-pixel text-[14px] leading-none translate-y-[2px]">[</span>
          <span className="font-sans font-bold text-[14px] leading-none tracking-widest mx-1 whitespace-nowrap">
            一键还原
          </span>
          <span className="font-pixel text-[14px] leading-none translate-y-[2px]">]</span>
        </button>

        {/* The Scrollable Map Canvas */}
        <div 
          ref={containerRef}
          className="relative w-full h-full min-w-[900px] min-h-[750px]"
          onPointerDown={() => setIsPanelOpen(false)}
        >
          
          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {LINKS.map((link, idx) => {
              const src = nodes.find(c => c.id === link.source);
              const tgt = nodes.find(c => c.id === link.target);
              if (!src || !tgt) return null;
              
              const isRelatedToActive = isPanelOpen && (link.source === activeNode?.id || link.target === activeNode?.id);
              const isRelatedToDrag = draggingNodeId && (link.source === draggingNodeId || link.target === draggingNodeId);
              const isHighlighted = isRelatedToActive || isRelatedToDrag;
              const draggingNode = nodes.find(n => n.id === draggingNodeId);
              const highlightColor = (isRelatedToDrag && draggingNode) ? draggingNode.color : activeNode.color;

              return (
                <line 
                  key={idx}
                  x1={`${src.x}%`} y1={`${src.y}%`}
                  x2={`${tgt.x}%`} y2={`${tgt.y}%`}
                  stroke={isHighlighted ? highlightColor : (link.dashed ? '#4B5563' : '#6B7280')}
                  strokeWidth={isHighlighted ? "4" : "2"}
                  strokeDasharray={link.dashed ? "4 4" : "none"}
                  className={`transition-all duration-300 ${isHighlighted ? 'opacity-100' : (isPanelOpen || draggingNodeId ? 'opacity-20' : 'opacity-60')}`}
                  style={isHighlighted ? { filter: `drop-shadow(0 0 8px ${highlightColor})` } : {}}
                />
              );
            })}
          </svg>

          {/* Nodes Layer */}
          {nodes.map((node) => {
            const isActive = activeNode.id === node.id;
            return (
              <div 
                id={`node-${node.id}`}
                key={node.id}
                onPointerDown={(e) => handlePointerDown(e, node.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(e, node)}
                className={`absolute w-32 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-[grab] active:cursor-[grabbing] group transition-transform duration-200 ${draggingNodeId === node.id ? 'z-50 scale-110' : 'z-10 hover:z-20'} ${(isActive && isPanelOpen && draggingNodeId !== node.id) ? 'scale-110' : ''}`}
                style={{ top: `${node.y}%`, left: `${node.x}%`, touchAction: 'none' }}
              >
                {/* Visual Icon Box */}
                <div 
                   className={`w-14 h-14 bg-black flex items-center justify-center text-2xl shadow-xl transition-all duration-300
                    ${node.id === 'transformer' || node.id === 'latent' ? 'w-20 h-20 text-4xl' : ''}
                    ${isActive ? 'shadow-[0_0_20px_currentColor]' : ''}
                   `}
                   style={{ 
                     borderWidth: '4px',
                     borderColor: node.color,
                     color: node.color,
                     boxShadow: isActive ? `0 0 25px ${node.color}80, inset 0 0 10px ${node.color}40` : 'none'
                   }}
                >
                  <span className={node.icon.length > 2 ? 'font-pixel text-[10px] text-white flex items-center h-full break-all p-1 text-center leading-none' : ''}>
                    {node.icon}
                  </span>
                </div>

                {/* Data Label */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 border-2 border-white bg-black p-1.5 flex flex-col items-center justify-center min-w-[90px]">
                  <span className="font-pixel text-[9px] md:text-[11px] text-white tracking-widest leading-none whitespace-nowrap">
                    {node.en}
                  </span>
                  <span className="flex items-center justify-center mt-1.5" style={{color: node.color}}>
                    <span className="font-pixel text-[8px] md:text-[10px] opacity-80 leading-none mb-[1px]">[</span>
                    <span className="font-sans font-bold text-[10px] md:text-[12px] leading-none tracking-widest mx-0.5 whitespace-nowrap">
                      {node.cn.replace(/\[|\]/g, '')}
                    </span>
                    <span className="font-pixel text-[8px] md:text-[10px] opacity-80 leading-none mb-[1px]">]</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal / Detail Panel Area */}
      <div className={`shrink-0 z-[100] bg-black transition-all duration-300 ease-in-out overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.8)] ${isPanelOpen ? 'w-full sm:w-[450px] lg:w-[500px] border-l-4 border-cyan-400' : 'w-0 border-l-0 border-cyan-400'}`}>
        <div className="w-screen sm:w-[450px] lg:w-[500px] h-full flex flex-col relative bg-black">
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b-2 border-cyan-400">
           <div className="font-pixel text-[10px] text-cyan-400">OBJECT_ID: {activeNode.en}</div>
           <button 
            onClick={() => setIsPanelOpen(false)}
            className="bg-[#e11d48] border border-white text-white font-pixel text-[12px] px-3 py-1 hover:bg-white hover:text-[#e11d48] transition-colors"
          >
            X
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col relative overflow-y-auto overflow-x-hidden space-y-6 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent">
          
          {/* Main Title Block */}
          <div className="flex bg-yellow-400/20 p-2 border-2 border-yellow-400 items-center justify-start gap-4">
            <div className="w-16 h-16 flex items-center justify-center text-4xl bg-[#b48600]">
              <span className="text-indigo-500">{activeNode.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-widest font-sans">{activeNode.en}</h2>
          </div>

          <div className="h-[2px] bg-cyan-400 w-full opacity-60"></div>

          {/* Archive Block */}
          <div>
            <div className="inline-block bg-cyan-400 text-black px-2 py-1 font-bold text-xs tracking-wider mb-2">ARCHIVE</div>
            <div className="bg-[#0f172a] text-white p-3 border-l-4 border-white font-mono text-sm">
              {activeNode.archive}
            </div>
          </div>

          {/* Metaphor Block */}
          <div>
            <div className="inline-block bg-fuchsia-500 text-white px-2 py-1 font-bold text-xs tracking-wider mb-2">METAPHOR</div>
            <div className="bg-fuchsia-950/40 text-fuchsia-300 p-3 italic border-l-4 border-fuchsia-500 text-sm break-words">
              {activeNode.metaphor}
            </div>
          </div>

          {/* Specs Block */}
          <div>
            <div className="inline-block bg-[#3b82f6] text-white px-2 py-1 font-bold text-xs tracking-wider mb-2">DETAILED_SPECS</div>
            <div className="text-blue-400 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {activeNode.desc}
            </div>
          </div>

          {/* Oracle Link (Chat) */}
          <div className="flex-1 flex flex-col border-2 border-yellow-400 relative mt-4">
            <div className="absolute -top-3 left-2 bg-yellow-400 text-black px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
              ORACLE_LINK ✨
            </div>
            
            <div className="flex-1 flex flex-col bg-black/60 pt-4 overflow-hidden min-h-[150px]">
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 font-mono text-xs max-h-[300px]">
                {chatLog.length === 0 && (
                  <div className="text-yellow-600 animate-pulse text-center pt-8">
                    INITIALIZING QUANTUM UPLINK...
                  </div>
                )}
                {chatLog.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[8px] text-gray-500 mb-1">{msg.role === 'user' ? 'GUEST_USER' : 'ORACLE_CORE'}</span>
                    <div className={`p-2 border max-w-[90%] whitespace-pre-wrap break-words ${msg.role === 'user' ? 'border-cyan-500 text-cyan-400 bg-cyan-950/30' : 'border-yellow-500 text-yellow-400 bg-yellow-950/30'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="p-2 bg-yellow-400/10 border-t border-yellow-400 flex gap-2">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="REQUEST AI ANALYSIS..."
                  className="flex-1 bg-black border border-white text-white font-mono text-xs px-2 py-2 outline-none focus:border-yellow-400"
                  disabled={isTyping}
                />
                <button 
                  type="submit"
                  disabled={isTyping || !inputValue.trim()}
                  className="bg-yellow-400 text-black font-bold text-xs px-4 py-2 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  RUN
                </button>
              </form>
            </div>
          </div>
          
        </div>

        {/* Bottom Status Bar */}
        <div className="h-6 shrink-0 bg-black border-t border-cyan-400 flex items-center justify-between px-4">
           <div className="text-cyan-400 text-[8px] font-pixel">_UPLINK_READY</div>
           <div className="text-cyan-400 text-[8px] font-pixel">DATABANK : {activeNode.id.toUpperCase()}</div>
        </div>
        </div>
      </div>

      {/* Info Modal */}
      {isInfoModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsInfoModalOpen(false)}>
          <div 
            className="max-w-2xl w-full bg-black border-2 border-green-500 p-6 shadow-[0_0_20px_rgba(0,255,65,0.3)] relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-4 right-4 text-green-500 hover:text-white font-pixel text-xl"
            >
              [X]
            </button>

            <div className="font-pixel text-green-500 text-base md:text-lg mb-6 border-b border-green-500/50 pb-2">
              <span className="animate-pulse">_</span> LLM Star Trek System Archive
            </div>

            <div className="space-y-6 font-sans text-gray-300 text-sm md:text-base leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <section>
                <h3 className="font-pixel text-green-400 mb-2">【 设定 】</h3>
                <p>
                  本项目是一个具象化、可交互的大语言模型（LLM）与深度学习核心概念拓扑图。我们将晦涩难懂的 AI 底层机器架构，隐喻为一场浩瀚的“星际航行”。在这里，数据是星辰，算法是航线，而各种模型则是演化出的不同文明。
                  其作用在于帮助探索者构建对 AI 运行逻辑的全局观直觉，支持自由拖拽排列星区，您也可以随时点击对应节点开启“通讯通道”，获取更硬核的技术解析。
                </p>
              </section>

              <section>
                <h3 className="font-pixel text-green-400 mb-2">【 核心作用 】</h3>
                <ul className="list-none space-y-2">
                  <li><span className="text-cyan-400 font-pixel">· 概念可视化：</span>将零散的 AI 术语转化为可视化的星图节点，消除理解门槛。</li>
                  <li><span className="text-cyan-400 font-pixel">· 脉络梳理：</span>通过连线揭示技术之间的依赖与递进关系（如：算法如何一步步从 Token 转化为具有推理能力的智能体）。</li>
                  <li><span className="text-cyan-400 font-pixel">· 沉浸式速查：</span>自由拖拽节点进行沙盘推演，点击即可调阅每项技术的“航行日志”与“现实隐喻”，也可以在底下对话框与LLM对话讨论。迷失时可随时使用左下角 [一键还原] 重置星际坐标。</li>
                </ul>
              </section>

              <section>
                <h3 className="font-pixel text-green-400 mb-2">【 基础概念引擎解析 】</h3>
                <p className="mb-4">为了安全航行，请领航员熟悉以下四大星区：</p>
                <div className="space-y-4">
                  <div>
                    <strong className="text-cyan-400 block mb-1">1. 物质起源（处理基础）</strong>
                    <p>一切智能始于 Token [符号碎片]，它们不仅是文字，也是图像与声音的碎片。经由 Embedding [传送门] 算法，这些碎片被转化为机器唯一能理解的数学实体——Vector [向量原子]，并被投射到极高维度的 Latent Space [宇宙容器] 中。</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block mb-1">2. 核心动力（Transformer 架构）</strong>
                    <p>Transformer [超级文明] 是当前宇宙的主宰架构。它的内部运转依赖：Attention [探照灯] 在茫茫星海中寻找词汇间的动态关联；以及 FFN [前馈网络] 从千万亿参数中提取训练时沉淀的死知识。</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block mb-1">3. 文明驯化（训练与对齐）</strong>
                    <p>野生的模型充满混沌。我们需要通过 SFT [指令微调] 教导它们听懂人类对话，再使用 RLHF/DPO [航向校准] 强行干预，使其价值观与人类偏好（安全、有用）对齐。</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block mb-1">4. 航速突破与外挂（工程优化与扩展）</strong>
                    <p>为打破物理极限，我们发明了 KV Cache [航行日志] 和 Flash Attention [加速中继] 来加速生成；利用 MoE [专家特遣队] 降低能耗；更能通过 RAG [外接馆] 让飞船随时查阅外部的实时数据库，通过LoRA[便签贴]，轻量级改写方向以及 KV Cache[航行日志]，记忆过往路径等精妙战术。</p>
                  </div>
                </div>
              </section>

              <section className="border-t border-dashed border-gray-700 pt-6 mt-6">
                <h3 className="font-pixel text-green-400 mb-2">【 文明演进与未来展望 】</h3>
                <div className="space-y-4">
                  <p>
                    <strong className="text-cyan-400">MAMBA（流体文明）：</strong> 作为下一代文明的有力承接者，MAMBA（状态空间模型 SSM）摈弃了超级文明 Transformer 那种“全员互相注视”所带来的庞大算力负荷。它如流体般贯穿时间之矢，通过状态的高效压缩与更新，以极端的轻盈实现了线性时间复杂度，成为超长尺度航行的完美破局者。
                  </p>
                  <p>
                    <strong className="text-cyan-400">架构展望：</strong> 星位图的演化从未停止。未来，Transformer 绝对的爆发力与 Mamba 无限的续航能力或将走向深度融合（混合架构）。配合 MoE（专家特遣队）的动态调度，乃至新型非线性预测计算，硅基生命将在无垠的参数太空中，找到更优雅的终极形态。
                  </p>
                </div>
              </section>

              <div className="text-right pt-8 pb-4 font-pixel text-gray-500 text-xs">
                —— Designed & Developed by Bitoky（wechat: bitoky）
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


