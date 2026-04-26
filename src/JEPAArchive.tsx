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
  { id: 'input_video', en: 'INPUT VIDEO / IMAGE', cn: '[原始感官]', icon: '👁️', color: '#3B82F6', x: 10, y: 35, archive: 'Data: Input', metaphor: '"未被加工的原始光子流。"', desc: '原始图像或视频序列，AI系统的“视网膜”感受到的像素矩阵。' },
  { id: 'masking', en: 'MASKING STRATEGY', cn: '[时空遮蔽]', icon: '⬛', color: '#14B8A6', x: 25, y: 35, archive: 'Data: Masking', metaphor: '"人为制造的记忆盲区。"', desc: '将输入划分为“可见的上下文(Context)”和“被隐藏的目标(Target)”。在V-JEPA中，这涉及复杂的时空管道遮蔽策略。' },
  { id: 'context_enc', en: 'CONTEXT ENCODER', cn: '[语境编码器]', icon: '🧠', color: '#9333EA', x: 40, y: 15, archive: 'Core: Context Encoder', metaphor: '"从残缺碎片中提取宏观意义的大脑皮层。"', desc: '核心神经网络模块（通常是ViT），只处理未被遮蔽的内容，输出对应的隐层表征向量 (s_x)。' },
  { id: 'target_enc', en: 'TARGET ENCODER', cn: '[目标编码器]', icon: '🎯', color: '#E11D48', x: 40, y: 55, archive: 'Core: Target Encoder', metaphor: '"用逐渐沉淀的直觉去凝视真相的眼睛。"', desc: '处理被隐藏目标部分的神经网络。它的参数不接收梯度，而是通过Context Encoder参数的指数移动平均(EMA)缓慢更新。输出目标表征(s_y)。' },
  { id: 'predictor', en: 'PREDICTOR', cn: '[世界模型引擎]', icon: '🔮', color: '#F59E0B', x: 70, y: 15, archive: 'Core: Predictor', metaphor: '"能够在脑海中推演平行宇宙走向的预言家。"', desc: 'JEPA的灵魂组件。它接收上下文表征(s_x)和有关缺失区域的位置信息，直接在潜空间(Latent Space)中推断目标表征(s_y\')，而不是像传统模型那样去重构像素。' },
  { id: 'latent_space', en: 'LATENT SPACE', cn: '[高维抽象界]', icon: '🌌', color: '#C026D3', x: 70, y: 55, archive: 'Core: Latent Representation', metaphor: '"剥离了像素伪装的纯粹语义宇宙。"', desc: '所有的预测与对比都发生在这个抽象空间。避免了预测复杂却无意义的背景细节（比如随风飘动的树叶），迫使模型理解深层物理和语义核心。' },
  { id: 'loss_func', en: 'PREDICTIVE LOSS', cn: '[认知误差度量]', icon: '⚖️', color: '#10B981', x: 85, y: 55, archive: 'Objective: Loss', metaphor: '"衡量推演与直觉之间差距的标尺。"', desc: '通常简单的 L1 或 L2 损失。计算 Predictor 输出的预测表征(s_y\')与 Target Encoder 提取的真实目标表征(s_y)之间的距离。' },
  { id: 'ema', en: 'EMA UPDATE', cn: '[慢思考学习]', icon: '⏳', color: '#8B5CF6', x: 55, y: 35, archive: 'Mechanism: EMA', metaphor: '"一种防止大脑突然崩溃、缓慢积累经验的稳健派哲学。"', desc: '指数移动平均 (Exponential Moving Average)。为了防止模型学习到 trivial 方案（坍缩），只有上下文编码器通过梯度反向传播更新，目标编码器则平滑复制前者的参数。' },
  { id: 'ijepa', en: 'I-JEPA', cn: '[静态图景推演]', icon: '🖼️', color: '#FCD34D', x: 25, y: 80, archive: 'Variant: I-JEPA', metaphor: '"只凭惊鸿一瞥，便能在脑中补全巨幅画卷。"', desc: '图片领域的先驱，通过预测图片中缺失区块的潜空间表征，大幅超越像素重构模型（如MAE）的高层语义提取能力。' },
  { id: 'vjepa', en: 'V-JEPA', cn: '[时空法则推演]', icon: '🎞️', color: '#EC4899', x: 40, y: 80, archive: 'Variant: V-JEPA', metaphor: '"掌握了物理学基础直觉的视频预言系统。"', desc: '基于视频的扩充版本。不再预测短期运动，而是在长期时空块上进行预测，为体现出直观物理定律（如物体的惯性与碰撞）构建了强大的理解。' },
  { id: 'collapse', en: 'REPRESENTATION COLLAPSE', cn: '[坍缩危机]', icon: '🕳️', color: '#EF4444', x: 85, y: 15, archive: 'Challenge: Collapse', metaphor: '"停止思考，用一成不变的答案应对所有问题的终极惰性。"', desc: '自监督学习的心魔：当没有负样本时，模型把所有输入映射到常数向量，使损失为0但却学不到知识。JEPA通过EMA与预测器打破这种平衡。' },
  { id: 'world_model', en: 'WORLD MODEL', cn: '[世界模型]', icon: '🌍', color: '#22C55E', x: 85, y: 80, archive: 'Vision: World Model', metaphor: '"像人类婴儿一样，通过观察和想象理解物理世界的因果法则。"', desc: 'Yann LeCun 的终极愿景"自主机器代理"(Autonomous Machine Intelligence)的核心。让机器掌握“常识”，懂得如何推演动作和规划未来。' }
];

const ZONES = [
  { id: 'data', cn: '数据管线', en: 'DATA PIPELINE', color: '#3B82F6', nodes: ['input_video', 'masking'] },
  { id: 'core', cn: 'JEPA核心架构', en: 'CORE ARCHITECTURE', color: '#9333EA', nodes: ['context_enc', 'target_enc', 'predictor', 'latent_space', 'ema'] },
  { id: 'obj', cn: '优化目标与挑战', en: 'OBJECTIVE & CRISIS', color: '#10B981', nodes: ['loss_func', 'collapse'] },
  { id: 'var', cn: '模型变体与愿景', en: 'VARIANTS & VISION', color: '#F59E0B', nodes: ['ijepa', 'vjepa', 'world_model'] }
];

interface ConnectionLink {
  source: string;
  target: string;
  dashed?: boolean;
  connectionDesc?: string;
}

const LINKS: ConnectionLink[] = [
  { source: 'input_video', target: 'masking', connectionDesc: '原始光子流/感官输入进入遮蔽策略管道，被物理拆分。' },
  { source: 'masking', target: 'context_enc', connectionDesc: '可见的上下文部分被输入到 Context Encoder。' },
  { source: 'masking', target: 'target_enc', connectionDesc: '被遮挡的目标部分被输入到 Target Encoder（仅提供给这部分以获取真实目标表示）。' },
  { source: 'masking', target: 'predictor', dashed: true, connectionDesc: '遮罩位置信息的元数据被送入 Predictor，作为推演的坐标和索引。' },
  { source: 'context_enc', target: 'predictor', connectionDesc: 'Context Encoder 提取出的上下文高维表征送入 Predictor 作为推理的依据。' },
  { source: 'context_enc', target: 'ema', dashed: true, connectionDesc: '慢思考学习机制：使用 Context Encoder 正在训练的梯度和权重作为源动力。' },
  { source: 'ema', target: 'target_enc', dashed: true, connectionDesc: '目标编码器的权重不由反向传播控制，而是通过 EMA 从 Context Encoder 缓慢同步过来，防止模型坍缩。' },
  { source: 'target_enc', target: 'latent_space', connectionDesc: 'Target Encoder 将目标区域转化为高维的 Latent 表示。' },
  { source: 'predictor', target: 'latent_space', connectionDesc: 'Predictor 在抽象维度中，推演出目标区域可能对应的 Latent 表示。' },
  { source: 'latent_space', target: 'loss_func', connectionDesc: '预测器推演出的潜空间目标表征，与目标编码器提取出的真实潜空间目标表征，在这里计算距离差异。' },
  { source: 'loss_func', target: 'predictor', dashed: true, connectionDesc: '误差回传，主要用于更新 predictor 的推演能力。' },
  { source: 'loss_func', target: 'context_enc', dashed: true, connectionDesc: '误差回传，同样用于更新 context encoder 提取关键信息的质量。' },
  { source: 'collapse', target: 'loss_func', dashed: true, connectionDesc: 'Loss 如果收敛到 0，不仅代表预测准确，也可能陷入 Representation Collapse 的坍缩状态。' },
  { source: 'collapse', target: 'ema', dashed: true, connectionDesc: 'EMA更新机制是抵抗自监督学习中模型发生表示坍缩（Representation Collapse）的核心武器。' },
  { source: 'ijepa', target: 'masking', dashed: true, connectionDesc: 'I-JEPA 在单帧图像上实现了块状遮蔽机制。' },
  { source: 'vjepa', target: 'masking', dashed: true, connectionDesc: 'V-JEPA 将遮蔽机制扩展至时空维度（如遮除视频中的多帧局部）。' },
  { source: 'loss_func', target: 'world_model', dashed: true, connectionDesc: '这种基于抽象空间预测的 Loss，驱使网络学会了物理法则，从而向宏大的 World Model 愿景迈进。' }
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

export default function App({ showInfoModal, onCloseInfoModal }: { showInfoModal: boolean, onCloseInfoModal: () => void }) {
  const [nodes, setNodes] = useState<ConceptNode[]>(CONCEPTS);
  const [activeNodeId, setActiveNodeId] = useState<string>('input_video');
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
  const [isConnectionsExpanded, setIsConnectionsExpanded] = useState(false);
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
    setIsConnectionsExpanded(false);

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
            systemInstruction: `You are the Cosmic AI Oracle, an ancient and highly advanced intelligence residing within the JEPA Architecture Database. The user is asking about [${activeNode.en} - ${activeNode.cn}]. Reply playfully in a retro sci-fi 8-bit aesthetic. Use space/cyberpunk metaphors. IMPORTANT: You MUST reply in Chinese as the default language.`
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
            systemInstruction: `You are the Cosmic AI Oracle, an ancient and highly advanced intelligence residing within the JEPA Architecture Database. The user is asking about [${activeNode.en} - ${activeNode.cn}]. Reply playfully in a retro sci-fi 8-bit aesthetic. Use space/cyberpunk metaphors. IMPORTANT: You MUST reply in Chinese as the default language.`
          }
        });
      }
      let fullText = "";
      const delays = [1000, 2000, 4000];
      
      for (let attempt = 0; attempt <= 3; attempt++) {
        try {
          const streamResponse = await chatRef.current.sendMessageStream({ message: queryInput });
          fullText = "";
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
          break; // Success! Break out of the retry loop.
        } catch (error: any) {
          const isRetryable =
            error?.status === 429 || error?.status === 503 ||
            String(error).includes('429') || String(error).includes('503') ||
            String(error).includes('UNAVAILABLE') || String(error).includes('high demand');
          
          if (isRetryable && attempt < 3) {
            console.warn(`[Oracle retry] caught temp error, retrying in ${delays[attempt]}ms...`);
            await new Promise(r => setTimeout(r, delays[attempt]));
            continue;
          }
          throw error;
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
          className="fixed bottom-8 left-8 z-50 bg-black/80 border-2 border-green-500 text-green-500 px-4 py-2 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,65,0.5)] hover:bg-green-500 hover:text-black transition-all cursor-pointer group"
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
      <div className={`shrink-0 z-[100] bg-black transition-all duration-300 ease-in-out overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.8)] ${isPanelOpen ? 'w-full sm:w-[400px] border-l-4 border-cyan-400' : 'w-0 border-l-0'}`}>
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

        <div className="flex-1 p-4 md:p-5 flex flex-col relative overflow-y-auto space-y-4 flex-nowrap">
          
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
            <div className="inline-block bg-cyan-400 text-black px-2 py-1 font-bold text-xs tracking-wider mb-1">ARCHIVE</div>
            <div className="bg-[#0f172a] text-white p-2 border-l-4 border-white font-mono text-sm">
              {activeNode.archive}
            </div>
          </div>

          {/* Metaphor Block */}
          <div>
            <div className="inline-block bg-fuchsia-500 text-white px-2 py-1 font-bold text-xs tracking-wider mb-1">METAPHOR</div>
            <div className="bg-fuchsia-950/40 text-fuchsia-300 p-2 italic border-l-4 border-fuchsia-500 text-sm break-words">
              {activeNode.metaphor}
            </div>
          </div>

          {/* Specs Block */}
          <div>
            <div className="inline-block bg-[#3b82f6] text-white px-2 py-1 font-bold text-xs tracking-wider mb-1">DETAILED_SPECS</div>
            <div className="text-blue-400 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {activeNode.desc}
            </div>
          </div>

          {/* Related Connections Block */}
          {(() => {
            const relatedLinks = LINKS.filter(l => (l.source === activeNode.id || l.target === activeNode.id) && l.connectionDesc);
            if (relatedLinks.length === 0) return null;
            return (
              <div>
                <button
                  onClick={() => setIsConnectionsExpanded(!isConnectionsExpanded)}
                  className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] transition-colors text-black px-2 py-1 font-bold text-xs tracking-wider mb-1"
                >
                  CONNECTIONS 
                  <span>{isConnectionsExpanded ? '▼' : '▶'}</span>
                </button>
                {isConnectionsExpanded && (
                  <div className="bg-[#052e16] p-2 border-l-4 border-[#10b981] text-[#6ee7b7] text-sm space-y-2">
                    {relatedLinks.map((link, i) => {
                      const isSource = link.source === activeNode.id;
                      const otherNodeId = isSource ? link.target : link.source;
                      const otherNode = CONCEPTS.find(n => n.id === otherNodeId);
                      if (!otherNode) return null;
                      
                      return (
                        <div key={i} className="flex flex-col">
                          <span className="font-bold text-[#34d399]">
                            {isSource ? 'Out \u2794' : 'In \u2190'} [{otherNode.en}]
                          </span>
                          <span className="text-xs text-[#a7f3d0] mt-1">{link.connectionDesc}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

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
