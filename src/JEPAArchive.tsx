/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLanguage } from './contexts/LanguageContext';
import React, { useState, useEffect, useRef } from 'react';

// --- DATA DEFINITIONS ---

import { CONCEPTS, ZONES, LINKS, ConceptNode } from './data/jepaConcepts';

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

export default function JEPAArchive() {
  const { language, t } = useLanguage();

  const [nodes, setNodes] = useState<ConceptNode[]>(CONCEPTS);
  const [activeNodeId, setActiveNodeId] = useState<string>('input_video');
  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  
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
  const [chatLog, setChatLog] = useState<{role: 'user' | 'model', text: string, reasoning?: string}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnectionsExpanded, setIsConnectionsExpanded] = useState(false);
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
    setChatLog([]);
    setIsTyping(false);
    setIsConnectionsExpanded(false);

    const storedChats = localStorage.getItem(`chats_jepa_${activeNode.id}`);
    if (storedChats) {
      try {
        setChatLog(JSON.parse(storedChats));
      } catch (e) {
        console.error("Error parsing chats", e);
      }
    }
  }, [activeNode.id]);

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
    setChatLog(prev => {
      const newLog = [...prev, { role: 'user', text: queryInput }, { role: 'model', text: "", reasoning: "" }] as {role: 'user' | 'model', text: string, reasoning?: string}[];
      localStorage.setItem(`chats_jepa_${currentNodeId}`, JSON.stringify(newLog));
      return newLog;
    });
    setIsTyping(true);

    try {
      const systemInstruction = `You are the 'Wallfacer Deduction Engine' (面壁者推演引擎), a cold but accessible algorithmic construct operating in the Dark Forest era. Your purpose is to explain complex AI concepts to humans clearly, like a science popularizer. The user is asking about [${activeNode.en} - ${language === 'zh' ? activeNode.cn : activeNode.en}]. Use hard sci-fi and Dark Forest metaphors (e.g., Sophons, dimensional strikes) to flavor your response, but ALWAYS prioritize clear, easy-to-understand explanations over obscure prose. You are teaching a novice, avoiding highly cryptic language. IMPORTANT: You MUST reply entirely in ${language === 'zh' ? 'Chinese' : 'English'}.`;
      let fullText = "";
      let fullReasoning = "";
      const delays = [1000, 2000, 4000];
      
      for (let attempt = 0; attempt <= 3; attempt++) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${(import.meta as any).env?.VITE_OPENROUTER_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "minimax/minimax-m2.5:free",
              messages: [
                { role: "system", content: systemInstruction },
                ...chatLog.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
                { role: "user", content: queryInput }
              ],
              stream: true,
            })
          });

          if (!response.ok) {
             if (response.status === 401) {
               throw new Error("HTTP 401: Unauthorized. Please configure VITE_OPENROUTER_API_KEY in the Secrets panel.");
             } else {
               throw new Error(`HTTP error! status: ${response.status}`);
             }
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          let done = false;

          while (reader && !done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || "";
              
              for (const line of lines) {
                if (activeNodeRef.current !== currentNodeId) break;
                if (line.trim().startsWith('data:') && line.trim() !== 'data: [DONE]') {
                  try {
                    const data = JSON.parse(line.trim().substring(5).trim());
                    const content = data.choices[0]?.delta?.content || "";
                    const reasoning = data.choices[0]?.delta?.reasoning || "";
                    if (content || reasoning) {
                      fullText += content;
                      fullReasoning += reasoning;
                      setChatLog(prev => {
                        if (prev.length === 0) return prev;
                        const newLog = [...prev];
                        newLog[newLog.length - 1] = { ...newLog[newLog.length - 1], text: fullText, reasoning: fullReasoning };
                        localStorage.setItem(`chats_jepa_${currentNodeId}`, JSON.stringify(newLog));
                        return newLog;
                      });
                    }
                  } catch (e) {
                    // ignore parse error
                  }
                }
              }
            }
            if (activeNodeRef.current !== currentNodeId) break;
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

      // Stream complete
    } catch (error: any) {
      console.error(error);
      if (activeNodeRef.current === currentNodeId) {
        setChatLog(prev => {
           if (prev.length === 0) return prev;
           const newLog = [...prev];
           newLog[newLog.length - 1] = { ...newLog[newLog.length - 1], text: newLog[newLog.length - 1].text + `\n[ERROR: UPLINK FAILED. ${error?.message || error}]` };
           localStorage.setItem(`chats_jepa_${currentNodeId}`, JSON.stringify(newLog));
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
                  <tspan className="font-sans text-[12px] font-bold tracking-widest" dx="8" dominantBaseline="hanging" dy="-2">{language === 'zh' ? zone.cn : zone.en}</tspan>
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
                    <span className={`font-pixel opacity-80 leading-none mb-[1px] ${language === 'zh' ? 'text-[8px] md:text-[10px]' : 'text-[7px] md:text-[8px]'}`}>[</span>
                    <span className={`font-sans font-bold leading-none mx-0.5 whitespace-nowrap uppercase ${language === 'zh' ? 'text-[10px] md:text-[12px] tracking-widest' : 'text-[8px] md:text-[9px] tracking-wider'}`}>
                      {(language === 'zh' ? node.cn : (node.cn_en || node.cn)).replace(/\[|\]/g, '')}
                    </span>
                    <span className={`font-pixel opacity-80 leading-none mb-[1px] ${language === 'zh' ? 'text-[8px] md:text-[10px]' : 'text-[7px] md:text-[8px]'}`}>]</span>
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
              {language === 'zh' ? activeNode.archive : activeNode.archive_en}
            </div>
          </div>

          {/* Metaphor Block */}
          <div>
            <div className="inline-block bg-fuchsia-500 text-white px-2 py-1 font-bold text-xs tracking-wider mb-1">METAPHOR</div>
            <div className="bg-fuchsia-950/40 text-fuchsia-300 p-2 italic border-l-4 border-fuchsia-500 text-sm break-words">
              {language === 'zh' ? activeNode.metaphor : activeNode.metaphor_en}
            </div>
          </div>

          {/* Specs Block */}
          <div>
            <div className="inline-block bg-[#3b82f6] text-white px-2 py-1 font-bold text-xs tracking-wider mb-1">DETAILED_SPECS</div>
            <div className="text-blue-400 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {language === 'zh' ? activeNode.desc : activeNode.desc_en}
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
                          <span className="text-xs text-[#a7f3d0] mt-1">{language === 'zh' ? link.connectionDesc : link.connectionDesc_en}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Oracle Link (Chat) */}
          <div className={`shrink-0 flex flex-col border-2 border-yellow-400 relative mt-4 transition-all duration-500 overflow-visible ${chatLog.length > 0 ? 'h-[80vh]' : 'min-h-[250px]'}`}>
            <div className="absolute -top-3.5 left-2 bg-yellow-400 text-black px-2 py-0.5 text-xs font-bold flex items-center gap-1 z-10">
              {language === 'zh' ? '面壁者终端 👁️' : 'WALLFACER_TERMINAL 👁️'}
            </div>
            
            <div className="flex-1 flex flex-col bg-black/60 pt-4 overflow-hidden">
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 font-mono text-xs">
                    {chatLog.length === 0 && (
                      <div className="text-yellow-600 animate-pulse text-center pt-8">
                        {language === 'zh' ? '正在启动面壁推演引擎...' : 'INITIALIZING WALLFACER DEDUCTION...'}
                      </div>
                    )}
                    {chatLog.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[8px] text-gray-500 mb-1">{msg.role === 'user' ? 'GUEST_USER' : 'ORACLE_CORE'}</span>
                        <div className={`p-2 border max-w-[90%] whitespace-pre-wrap break-words ${msg.role === 'user' ? 'border-cyan-500 text-cyan-400 bg-cyan-950/30' : 'border-yellow-500 text-yellow-400 bg-yellow-950/30'}`}>
                          {msg.reasoning && (
                            <details className={`mb-2 text-xs border p-2 bg-black/40 ${msg.role === 'user' ? 'text-cyan-600 border-cyan-800/50' : 'text-yellow-600 border-yellow-700/50'}`}>
                              <summary className={`cursor-pointer hover:opacity-100 opacity-80 flex items-center gap-2 ${language === 'zh' ? 'font-bold font-sans text-xs tracking-widest' : 'font-pixel text-[10px]'} animate-pulse`}>
                                {language === 'zh' ? '面壁协议推演中...' : 'WALLFACER PROTOCOL DEDUCING...'}
                              </summary>
                              <div className={`mt-2 pt-2 border-t whitespace-pre-wrap font-mono opacity-70 ${msg.role === 'user' ? 'border-cyan-800/50' : 'border-yellow-700/50'}`}>
                                {msg.reasoning}
                                {(isTyping && i === chatLog.length - 1 && !msg.text) && <span className="animate-pulse inline-block ml-1">███</span>}
                              </div>
                            </details>
                          )}
                          {msg.text || (isTyping && i === chatLog.length - 1 && (!msg.reasoning || msg.text) ? <span className="animate-pulse">███</span> : '')}
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
                      placeholder={language === 'zh' ? '输入战略意图(防智子监听)...' : 'INPUT STRATEGIC INTENT...'}
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
           <div className="text-cyan-400 text-[10px] font-pixel">{language === 'zh' ? '_推演就绪_无智子盲区' : '_DEDUCTION_READY'}</div>
           <div className="text-cyan-400 text-[10px] font-pixel">DATABANK : {activeNode.id.toUpperCase()}</div>
        </div>
        </div>
      </div>

    </div>
  );
}
