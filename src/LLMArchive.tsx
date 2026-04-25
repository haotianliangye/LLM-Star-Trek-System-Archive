/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { auth, db } from './firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });

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
    x: 10, y: 45,
    archive: '基本粒子：Token',
    metaphor: '"符号的碎片，在被赋予能量前只是虚无的编号。"',
    desc: '原始符号的碎片（词、子词），每个 token 都有一个整数 ID。经由 Embedding，ID 被唤醒为初始向量——所以 Token 只是名字，向量才是真正的语义实体。'
  },
  {
    id: 'embedding', en: 'EMBEDDING', cn: '[传送门]', icon: '🚪', color: '#3B82F6',
    x: 20, y: 45,
    archive: '定位工具：Embedding',
    metaphor: '"将离散羊群精准驱赶到宇宙坐标的星际传送牧羊人。"',
    desc: '把离散符号投射到 Latent Space 中的精确坐标。牧羊人把羊群赶到宇宙草场的特定角落。后续操作都建立在这些向量坐标之上。'
  },
  {
    id: 'vector', en: 'VECTOR', cn: '[原子]', icon: '◈', color: '#E11D48',
    x: 30, y: 45,
    archive: '基本粒子：Vector',
    metaphor: '"指引方向的浮点数箭头，语义宇宙的量化本质。"',
    desc: '语义宇宙的最小单位——一个有序的浮点数列表。几何上它是从原点指向某点的箭头：方向编码语义类别，长度编码强度。一切信息变换的原子操作。'
  },
  {
    id: 'clip', en: 'CLIP', cn: '[翻译官]', icon: '▣', color: '#C026D3',
    x: 30, y: 30,
    archive: '跨模态翻译：CLIP (Contrastive Language-Image Pre-training)',
    metaphor: '"打破维度壁垒的星际翻译官，让图与文在同一坐标系下共舞。"',
    desc: '训练视觉和文本编码器，用对比学习强制匹配的图文向量在 Latent Space 中占据同一坐标。以文搜图、零样本分类的基础。'
  },
  {
    id: 'latent', en: 'LATENT SPACE', cn: '[宇宙容器]', icon: '🌌', color: '#9333EA',
    x: 40, y: 45,
    archive: '宇宙本身：Latent Space',
    metaphor: '"一切皆有可能的平滑连续的高维空间。"',
    desc: '一个连读的高维向量空间。每个点就是向量。真实数据聚集成“语义星云”，空白区域无边无际。空间平滑且连续。'
  },
  {
    id: 'transformer', en: 'TRANSFORMER', cn: '[超级文明]', icon: '👾', color: '#EAB308',
    x: 60, y: 45,
    archive: '核心文明：Transformer',
    metaphor: '"占据宇宙最大片区域的超级文明，通过注意力机制在空间中导航。"',
    desc: '已经演化成熟的星际超级文明。输入 prompt，文明就在空间中沿路径不断生成下个 token 的向量。内核是多层注意力与前馈变换。'
  },
  {
    id: 'mamba', en: 'MAMBA', cn: '[流体文明]', icon: '🐍', color: '#16A34A',
    x: 40, y: 15,
    archive: '新宇宙动力学：Mamba',
    metaphor: '"摈弃所有人的互相注视，选择如流体般贯穿时间之矢的高效航行者。"',
    desc: '状态空间模型。序列视作连续信号，通过系统以递归形式高效更新内部状态，实现线性时间复杂度。像流过宇宙流体场。'
  },
  {
    id: 'speculative', en: 'SPECULATIVE', cn: '[预测舰]', icon: '📡', color: '#F43F5E',
    x: 90, y: 30,
    archive: '星际航行：投机解码',
    metaphor: '"快速插旗的侦察艇与后方暴力查验的主力旗舰完美配合。"',
    desc: '用小模型（侦察艇）快速猜想下一串 token，大模型（主力舰）一次性验证。只修正插错的，吞吐量大幅提升。'
  },
  {
    id: 'flash_attn', en: 'FLASH ATTN', cn: '[加速中继]', icon: '⚡\uFE0F', color: '#F97316',
    x: 90, y: 15,
    archive: '星际航行：FlashAttention',
    metaphor: '"局域广播中继，打破显存读写瓶颈的极速通道。"',
    desc: '通过分块技巧大幅减少显存访问。建立局域星际广播中继，节省信号通道，使长序列注意力极速攀升。'
  },
  {
    id: 'attention', en: 'ATTENTION', cn: '[探照灯]', icon: '🔦', color: '#06B6D4',
    x: 70, y: 30,
    archive: '微观机制：Attention',
    metaphor: '"恒星间的互相照亮与拉扯，用光斑指引下一次跃迁。"',
    desc: 'Q 与所有 K 做点积得到权重，再对 V 加权求和。让每颗星星动态决定向哪些邻居借力更新位置。'
  },
  {
    id: 'kv_cache', en: 'KV CACHE', cn: '[航行日志]', icon: '💾', color: '#14B8A6',
    x: 80, y: 45,
    archive: '微观机制：KV Cache (Key-Value Cache)',
    metaphor: '"母舰上刻录着每一颗途经星辰坐标的隐秘航行日志。"',
    desc: '新 token 只需计算自己的 QKV，并读取已暂存的 KV 缓存。飞船不必每次重绘星图，只需看日志和眼前。'
  },
  {
    id: 'moe', en: 'MoE', cn: '[专家特遣队]', icon: '👥', color: '#D97706',
    x: 90, y: 60,
    archive: '高效多任务：MoE (Mixture of Experts)',
    metaphor: '"庞大的休眠专家库与永远只唤醒最适合者的智能调度台。"',
    desc: '门控网络动态激活得分最高的少数专家计算，其余休眠。每次只唤醒需要的飞船。'
  },
  {
    id: 'reasoning', en: 'REASONING', cn: '[思维推演]', icon: '🚀', color: '#EA580C',
    x: 90, y: 75,
    archive: '深度探索：推理',
    metaphor: '"从单线链式跃迁到多路并发树探索的思维路线规划。"',
    desc: '从 Few-shot 看星图，到 CoT 链式跃迁，ToT 派多舰并行树搜索，再到 Self-Consistency 星际议会投票。'
  },
  {
    id: 'lora', en: 'LoRA', cn: '[便签贴]', icon: '🏷\uFE0F', color: '#64748B',
    x: 80, y: 15,
    archive: '文明新技能：LoRA (Low-Rank Adaptation)',
    metaphor: '"贴在时间坐标轴上的轻量级导航便签，不触碰古老的主体星图。"',
    desc: '冻结原始权重，附加极小矩阵。不修改城市地图，只在路口贴热插拔的微小方向便签。'
  },
  {
    id: 'rlhf', en: 'RLHF/DPO', cn: '[航向校准]', icon: '⚖\uFE0F', color: '#10B981',
    x: 80, y: 75,
    archive: '人类偏好：RLHF (Reinforcement Learning from Human Feedback) / DPO (Direct Preference Optimization)',
    metaphor: '"造物主下达的强制干预，纠正即将滑向深渊的有害轨道。"',
    desc: '人类评委或直接偏好打分，修正答案向量落向的“好区域”。文明内部重新规划星路对齐偏好。'
  },
  {
    id: 'rag', en: 'RAG', cn: '[外接馆]', icon: '📚', color: '#F59E0B',
    x: 20, y: 75,
    archive: '外置记忆库：RAG (Retrieval-Augmented Generation)',
    metaphor: '"游离在星云边缘的阿卡夏记录，随时以钩爪抓取所需的上古卷轴。"',
    desc: '把相关典籍化作向量存入数据库。提问前抛出钩爪引出档案暂存入工作记忆。外化长期记忆。'
  },
  {
    id: 'quantize', en: 'QUANTIZE', cn: '[压缩星图]', icon: '📉', color: '#0D9488',
    x: 80, y: 30,
    archive: '参数压缩：量化',
    metaphor: '"舍弃精微数据精度，换取极致便携的粗粒度参数网格。"',
    desc: '精度压至 INT8/INT4，把模型权重矩阵和 KV Cache 改为低精度网格索引。以极微的精度损失大幅节省推理显存并加快速度。'
  },
  {
    id: 'diffusion', en: 'DIFFUSION', cn: '[雕刻家]', icon: '🎨', color: '#D946EF',
    x: 40, y: 64,
    archive: '多模态生成：Diffusion',
    metaphor: '"从混沌的白噪音乱石堆中，一点点凿出惊世骇俗的形状。"',
    desc: '从纯噪声出发，在文本条件引导下逐步去噪重构像素。从混沌石料凿出雕像。'
  },
  {
    id: 'rope', en: 'RoPE', cn: '[位置编码]', icon: '🧭', color: '#14B8A6',
    x: 60, y: 15,
    archive: '微观机制：RoPE (Rotary Position Embedding)',
    metaphor: '"赋予无序符号以时间刻度，让词汇在星际空间中拥有绝对方向与相对距离。"',
    desc: '旋转位置编码，通过将词嵌入向量在复数空间中旋转特定的角度，为模型注入绝对位置信息，同时天然保持相对位置的衰减特性。'
  },
  {
    id: 'ffn', en: 'FFN', cn: '[前馈网络]', icon: '🧠', color: '#F43F5E',
    x: 70, y: 60,
    archive: '微观机制：FFN (Feed-Forward Network)',
    metaphor: '"藏在庞大星云深处的知识仓库，每一次激活都是一次记忆的提取。"',
    desc: 'Transformer中除了Attention之外的另一大核心基石。Attention负责找寻线索，而FFN（或者MLP）负责在参数中回忆起训练时见过的知识。'
  },
  {
    id: 'rmsnorm', en: 'RMSNorm', cn: '[层归一化]', icon: '📏', color: '#8B5CF6',
    x: 70, y: 15,
    archive: '微观机制：RMSNorm (Root Mean Square Normalization)',
    metaphor: '"平抑能量波动的星路稳定器，确保深层跃迁不会迷失在数值爆炸的黑洞中。"',
    desc: '一种高效的层归一化方法，去除了均值计算，只按均方根缩放，极大提升了模型在大规模堆叠层数时的训练稳定性和计算速度。'
  },
  {
    id: 'sft', en: 'SFT', cn: '[指令微调]', icon: '🎯', color: '#22C55E',
    x: 60, y: 64,
    archive: '人类偏好：SFT (Supervised Fine-Tuning)',
    metaphor: '"教导混沌文明理解人类问询的第一所学校。"',
    desc: '通过提供高质量的 (指令, 回复) 数据对，将一个单纯只会玩“文字接龙”的基础模型，引导成为听懂人类指令对话的助手（Supervised Fine-Tuning）。'
  },
  {
    id: 'dit', en: 'DiT', cn: '[架构跃迁]', icon: '🧬', color: '#FCD34D',
    x: 50, y: 60,
    archive: '架构融合：DiT (Diffusion Transformer)',
    metaphor: '"借用超级文明的核心高能引擎，驱动混沌乱石的精细雕刻机。"',
    desc: 'Diffusion Transformer (DiT)。将 Transformer 的宏大架构引入扩散模型，替代传统的 U-Net 后，使得模型在图像与视频生成上获得了惊人的规模扩展能力（Scaling Law），成为诸如视频生成巨兽 Sora 等的底层基柱。'
  },
  {
    id: 'hybrid', en: 'HYBRID', cn: '[混合文明]', icon: '☯️', color: '#EC4899',
    x: 50, y: 30,
    archive: '架构融合：Hybrid',
    metaphor: '"将恒星的爆发力与流体的无尽续航完美交织的新型星际联合体。"',
    desc: '混合架构（如 Jamba）。融合了 Transformer 强大的高并发注意力理解能力和 Mamba 极低推理成本的线性状态空间机制。在不同层交替使用两种架构，达到既能打又能跑的终极全能态。'
  },
  {
    id: 'agent', en: 'AGENT', cn: '[自主星舰]', icon: '🤖', color: '#3B82F6',
    x: 50, y: 75,
    archive: '自主行动：Agent (Reasoning and Acting)',
    metaphor: '"配备独立决策大脑与工具舱的星际探索飞船，能自主规划航线并采集资源。"',
    desc: '基于 ReAct (Reasoning and Action) 框架，让大模型不仅能推导下一步，还能调用外部工具（如 RAG）并观察结果，自主完成复杂的多步任务。'
  }
];

const ZONES = [
  { id: 'data', cn: '数据区', en: 'DATA/MAPPING', color: '#3B82F6', nodes: ['token', 'embedding', 'vector', 'clip'] },
  { id: 'arch', cn: '架构区', en: 'ARCHITECTURES', color: '#9333EA', nodes: ['transformer', 'mamba', 'diffusion', 'dit', 'hybrid'] },
  { id: 'mech', cn: '微观机理', en: 'MECHANISMS', color: '#F43F5E', nodes: ['attention', 'ffn', 'moe', 'rope', 'rmsnorm'] },
  { id: 'eng', cn: '工程优化', en: 'ENGINEERING', color: '#14B8A6', nodes: ['kv_cache', 'flash_attn', 'quantize', 'speculative', 'lora'] },
  { id: 'train', cn: '训练范式', en: 'TRAINING/ALIGN', color: '#10B981', nodes: ['sft', 'rlhf'] },
  { id: 'sys', cn: '系统层', en: 'SYSTEM/APP', color: '#F59E0B', nodes: ['rag', 'reasoning', 'agent'] }
];

const LINKS = [
  { source: 'token', target: 'embedding' },
  { source: 'embedding', target: 'vector' },
  { source: 'clip', target: 'vector', dashed: true },
  { source: 'vector', target: 'latent' },
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
  { source: 'reasoning', target: 'agent', dashed: true },
  { source: 'rag', target: 'agent', dashed: true },
  { source: 'latent', target: 'rag', dashed: true },
  { source: 'latent', target: 'diffusion', dashed: true },
  { source: 'diffusion', target: 'dit', dashed: true },
  { source: 'transformer', target: 'dit', dashed: true },
  { source: 'transformer', target: 'hybrid', dashed: true },
  { source: 'mamba', target: 'hybrid', dashed: true },
  { source: 'transformer', target: 'quantize', dashed: true },
  { source: 'kv_cache', target: 'quantize', dashed: true },
  { source: 'clip', target: 'diffusion', dashed: true },
  { source: 'rag', target: 'transformer', dashed: true }
];

// --- COMPONENTS ---

// Computes convex hull using Monotone chain algorithm
function getConvexHull(points: [number, number][]): [number, number][] {
  if (points.length <= 3) return points;
  
  const sorted = [...points].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) => 
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower: [number, number][] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper: [number, number][] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const point = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

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

export default function LLMArchive({ showInfoModal, onCloseInfoModal }: { showInfoModal: boolean, onCloseInfoModal: () => void }) {
  const [nodes, setNodes] = useState<ConceptNode[]>(CONCEPTS);
  const [activeNodeId, setActiveNodeId] = useState<string>('latent');
  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, loading]);
  
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

  // Scroll to active node when panel opens
  useEffect(() => {
    if (isPanelOpen) {
      setTimeout(() => {
        const el = document.getElementById(`node-${activeNode.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 100);
    }
  }, [isPanelOpen, activeNode.id]);

  // Fetch initial chats
  useEffect(() => {
    chatRef.current = null;
    setChatLog([]);
    setIsTyping(false);

    if (!user) return;

    let isValid = true; // Guard to prevent race conditions during node switching

    const fetchChats = async () => {
      const q = query(
        collection(db, 'chat_messages'),
        where('userId', '==', user.uid),
        where('nodeId', '==', activeNode.id),
        orderBy('createdAt', 'asc')
      );
      try {
        const snapshot = await getDocs(q);
        if (!isValid) return;

        const msgs = snapshot.docs.map(d => ({ role: d.data().role as 'user'|'model', text: d.data().text }));
        setChatLog(msgs);
        
        chatRef.current = ai.chats.create({
          model: "gemini-3.1-flash-lite-preview",
          config: {
            maxOutputTokens: 8192,
            systemInstruction: `You are the Cosmic AI Oracle, an ancient and highly advanced intelligence residing within the LLM Star Atlas. The user is asking about [${activeNode.en} - ${activeNode.cn}]. Reply playfully in a retro sci-fi 8-bit aesthetic. Use space/cyberpunk metaphors. IMPORTANT: You MUST reply in Chinese as the default language.`
          },
          history: msgs.map(m => ({
            role: m.role,
            parts: [{text: m.text}]
          }))
        });
      } catch (e) {
        console.error("Error fetching chats", e);
      }
    };

    fetchChats();
    return () => { isValid = false; };
  }, [activeNode.id, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const activeNodeRef = useRef(activeNode.id);
  useEffect(() => {
    activeNodeRef.current = activeNode.id;
  }, [activeNode.id]);

  const handleChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const queryInput = inputValue.trim();
    const currentNodeId = activeNode.id;
    setInputValue("");
    setChatLog(prev => [...prev, { role: 'user', text: queryInput }, { role: 'model', text: "" }]);
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
      const streamResponse = await chatRef.current.sendMessageStream({ message: queryInput });
      
      let fullText = "";
      for await (const chunk of streamResponse) {
         // Stop rendering if user switched node
         if (activeNodeRef.current !== currentNodeId) break;

         if (chunk.text) {
           fullText += chunk.text;
           setChatLog(prev => {
              if (prev.length === 0) return prev;
              const newLog = [...prev];
              newLog[newLog.length - 1] = { ...newLog[newLog.length - 1], text: fullText };
              return newLog;
           });
         }
      }

      // Even if aborted mid-stream due to node switch, we save what was generated to Firebase
      if (user) {
         await addDoc(collection(db, 'chat_messages'), {
            userId: user.uid,
            nodeId: currentNodeId,
            role: 'user',
            text: queryInput,
            createdAt: serverTimestamp()
         });
         await addDoc(collection(db, 'chat_messages'), {
            userId: user.uid,
            nodeId: currentNodeId,
            role: 'model',
            text: fullText,
            createdAt: serverTimestamp()
         });
      }
    } catch (error: any) {
      console.error(error);
      if (activeNodeRef.current === currentNodeId) {
        setChatLog(prev => {
           if (prev.length === 0) return prev;
           const newLog = [...prev];
           newLog[newLog.length - 1] = { ...newLog[newLog.length - 1], text: newLog[newLog.length - 1].text + `\n[ERROR: UPLINK FAILED. ${error?.message || error}]` };
           return newLog;
        });
      }
    } finally {
      if (activeNodeRef.current === currentNodeId) {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="h-full w-full relative font-mono text-[#00ff41] bg-[#0c001a] overflow-hidden flex">
      
      {/* Backgrounds */}
      <Starfield />
      <div className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%'
      }}></div>

      {/* Main Map Viewer Area */}
      <div className="flex-1 relative overflow-auto z-10 bg-black/40 transition-all duration-300">
        
        {/* Reset Button */}
        <button
          onClick={() => setNodes(CONCEPTS)}
          className="fixed bottom-8 left-8 z-50 bg-black/80 border-2 border-cyan-400 text-cyan-400 px-4 py-2 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,65,0.5)] hover:bg-cyan-400 hover:text-black transition-all cursor-pointer group"
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
          {/* SVG Zones Sub-Layer (using viewBox for precise hull scaling) */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {ZONES.map((zone) => {
              const activeNodes = nodes.filter(n => zone.nodes.includes(n.id));
              if (activeNodes.length === 0) return null;
              
              // Pad each node with 8 control points to create organic rounded shape around it
              const paddingX = 4;
              const paddingY = 6;
              const points: [number, number][] = [];
              activeNodes.forEach(n => {
                points.push([n.x - paddingX, n.y - paddingY]);
                points.push([n.x + paddingX, n.y - paddingY]);
                points.push([n.x + paddingX, n.y + paddingY]);
                points.push([n.x - paddingX, n.y + paddingY]);
                points.push([n.x, n.y - paddingY]);
                points.push([n.x, n.y + paddingY]);
                points.push([n.x - paddingX, n.y]);
                points.push([n.x + paddingX, n.y]);
              });

              const hull = getConvexHull(points);
              const pathData = hull.length > 0 ? "M " + hull.map(p => `${p[0]},${p[1]}`).join(" L ") + " Z" : "";

              return (
                <g key={zone.id}>
                  {pathData && (
                    <path 
                      d={pathData}
                      fill={`${zone.color}15`}
                      stroke={`${zone.color}25`}
                      strokeWidth="50"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeDasharray="10 15"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* SVG Connections & Text Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Zones Text Layer */}
            {ZONES.map((zone) => {
              const activeNodes = nodes.filter(n => zone.nodes.includes(n.id));
              if (activeNodes.length === 0) return null;
              
              // Find top-left-most region considering padded extents for the label
              const minX = Math.min(...activeNodes.map(n => n.x)) - 6;
              const minY = Math.min(...activeNodes.map(n => n.y)) - 8;

              return (
                <text key={`label-${zone.id}`} x={`${minX + 1}%`} y={`${minY + 2}%`} fill={zone.color} className="opacity-80">
                  <tspan className="font-pixel text-[12px]" dominantBaseline="hanging">[{zone.en}]</tspan>
                  <tspan className="font-sans text-[12px] font-bold tracking-widest" dx="8" dominantBaseline="hanging" dy="-2">{zone.cn}</tspan>
                </text>
              );
            })}

            {/* Links Layer */}
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
      <div className={`shrink-0 z-[100] bg-black transition-all duration-300 ease-in-out border-l-4 border-cyan-400 overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.8)] ${isPanelOpen ? 'w-full sm:w-[400px]' : 'w-0 border-l-0'}`}>
        <div className="w-full sm:w-[400px] h-full flex flex-col relative bg-black">
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b-2 border-cyan-400 shrink-0">
           <div className="font-pixel text-[10px] text-cyan-400">OBJECT_ID: {activeNode.en}</div>
           <button 
            onClick={() => setIsPanelOpen(false)}
            className="bg-[#e11d48] border border-white text-white font-pixel text-[12px] px-3 py-1 hover:bg-white hover:text-[#e11d48] transition-colors relative z-[101]"
          >
            X
          </button>
        </div>

        <div className="flex-1 p-4 md:p-6 flex flex-col relative overflow-y-auto space-y-6 flex-nowrap">
          
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
              {!user ? (
                 <div className="flex-1 flex flex-col items-center justify-center p-4">
                   <div className="text-yellow-600 mb-4 text-center font-pixel text-[10px] animate-pulse">
                     _ESTABLISHING_SECURE_LINK_<br/>
                     <span className="text-gray-500 mt-2 block">Acquiring temporal identity...</span>
                   </div>
                 </div>
              ) : (
                <>
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
                </>
              )}
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

    </div>
  );
}
