import React from 'react';

export default function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-start sm:justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden" onClick={onClose}>
      <div 
        className="max-w-4xl w-full bg-black border-2 border-cyan-500 p-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-none flex items-center justify-between border-b border-cyan-500/50 pb-4 mb-4">
          <div className="font-pixel text-cyan-400 text-lg md:text-xl flex items-center gap-2">
            <span className="animate-pulse w-3 h-3 bg-cyan-400 block"></span> 
            SYSTEM CORE ARCHIVE OVERVIEW
          </div>
          <button 
            onClick={onClose}
            className="text-cyan-500 hover:text-white font-pixel text-xl transition-colors shrink-0 p-2"
          >
            [X]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-12 text-gray-300 font-sans text-sm md:text-base leading-relaxed">
          
          {/* ---- LLM SECTION ---- */}
          <section>
             <div className="bg-green-500/10 border-l-4 border-green-500 px-4 py-2 mb-6">
                <h2 className="font-pixel text-green-400 text-lg">一、LLM 星际航行体系</h2>
                <p className="text-gray-400 text-sm mt-1">THE LLM STAR TREK ECOSYSTEM</p>
             </div>
             
              <div className="space-y-6">
                <div>
                    <h3 className="font-pixel text-green-400 mb-2">:: 设定 & 核心作用</h3>
                    <p className="mb-2">
                      本项目是一个具象化、可交互的大语言模型（LLM）核心概念拓扑图。将晦涩难懂的 AI 底层机器架构隐喻为一场浩瀚的“星际航行”。在此，数据是星辰，算法是航线，模型是星际文明。作用在于通过概念可视化和脉络梳理，揭示技术递进与融合。探索者可自由拖拽推演，沉浸式了解技术的“航行日志”与“现实隐喻”。
                    </p>
                </div>
                <div>
                  <h3 className="font-pixel text-green-400 mb-2">:: 星图导航：引擎与演化解析</h3>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-cyan-400 block mb-1">物质起源（数据与映射）</strong>
                      <p>一切智能始于 Token [符号碎片]，它们在被赋予能量前只是虚无的编号。经由 Embedding [传送门] 唤醒，碎片被转化为机器能理解的 Vector [原子]，并投射到浩渺的 Latent Space [宇宙容器] 中。同时，CLIP [翻译官] 正打破维度壁垒，让图像与文本在同一个坐标系下共舞。</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">核心动力（架构引擎与微观机理）</strong>
                      <p>Transformer [超级文明] 是当前宇宙的主宰。它的内核运转极为精妙：依靠 Attention [探照灯] 动态锚定星辰间的引力，经由 FFN [前馈网络] 提取沉淀的知识库；并在航行中使用 RoPE [位置编码] 赋予符号绝对的空间刻度，利用 RMSNorm [层归一化] 平抑能量波动。在生成式的次生宇宙里，Diffusion [雕刻家] 从白噪音中一点点凿出惊世骇俗的形状。</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">文明驯化（训练范式）</strong>
                      <p>初生的模型充满混沌。需要通过 SFT [指令微调] 教导它们听懂人类对话，再使用 RLHF/DPO [航向校准] 降下造物主的强制干预，使其价值观与人类偏好完全对齐。</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">极致曲率与系统减负（工程优化）</strong>
                      <p>为打破算力壁垒：利用 KV Cache [航行日志] 和 Flash Attention [加速中继] 极速穿梭；组建 MoE [专家特遣队] 降低全局能耗；派发 Speculative [预测舰] 实行投机解码；贴上 LoRA [便签贴] 轻量级改写航向；更通过 Quantize [压缩星图] 将庞大模型极致压缩。</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">航向深渊与终极智力（系统与应用）</strong>
                      <p>模型通过 RAG [外接馆] 随时向星云边缘抛出钩爪，引出外部记忆；运用 Reasoning [思维推演] 从单链跃迁为树状逻辑演练；最终演化为配备了独立大脑与工具舱的 Agent [自主星舰]。</p>
                    </div>
                    <div>
                       <strong className="text-cyan-400 block mb-1">文明演进与未来展望</strong>
                       <p>Mamba [流体文明] 摈弃了“全员互相注视”带来的庞大算力负荷；DiT [架构跃迁] 与 Hybrid [混合文明] 展现不同架构的终极交织——将恒星的绝对爆发力与流体的无限续航完美融合。</p>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          {/* ---- JEPA SECTION ---- */}
          <section>
             <div className="bg-purple-500/10 border-l-4 border-purple-500 px-4 py-2 mb-6">
                <h2 className="font-pixel text-purple-400 text-lg">二、JEPA 预测体系</h2>
                <p className="text-gray-400 text-sm mt-1">THE JEPA WORLD MODEL SYSTEM</p>
             </div>
             
             <div className="space-y-6">
                <div>
                    <h3 className="font-pixel text-purple-400 mb-2">:: 设定 & 核心作用</h3>
                    <p className="mb-2">
                       展现 Yann LeCun "联合嵌入预测架构 (JEPA)" 概念拓扑。将追求“世界模型”的架构理念隐喻为“预测未来物理法则的直觉引擎”。数据管道是感知器官，核心组件是大脑皮层。它将抽象的自监督学习转化为可视化管线，揭示非对称编码与潜层预测的精妙平衡。
                    </p>
                </div>
                <div>
                  <h3 className="font-pixel text-purple-400 mb-2">:: 星图导航：引擎与演化解析</h3>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-cyan-400 block mb-1">输入与盲区（数据管线）</strong>
                      <p>无论是图像还是视频，Input Video 是系统感知的原始环境。而 Masking Strategy 是人为制造的“盲区”，它强迫系统从可见的上下文中去推断被遮蔽的未知。</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">直觉引擎核心（JEPA架构）</strong>
                      <p>JEPA核心非对称机制：Context Encoder 从可见片段提取特征。Target Encoder 处理被遮挡的目标提取目标特征。而 Predictor 预言家不必重构具体的像素，它只在脱离繁杂表象的 Latent Space 中预测抽象意义。</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">慢思考（EMA 更新制约）</strong>
                      <p>如果两个编码器一样快地学习，系统会迅速陷入 Representation Collapse [坍缩危机]。为此，Target Encoder 永远不直接通过梯度更新，而是通过 EMA 缓慢吸取 Context Encoder 的经验成果，保持目标的稳定性。</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">通往物理直觉的阶梯（世界模型）</strong>
                      <p>从理解图像的 I-JEPA 到理解时空物体的 V-JEPA，愿景即是抛弃重现无意义的背景细节（如飘动的树叶），让智能体像婴儿一样在潜层空间建立物理因果律。这就是最终极的 World Model。</p>
                    </div>
                  </div>
                </div>
             </div>
          </section>
        </div>
        
        <div className="flex-none pt-6 text-right font-pixel text-cyan-400 text-xs sm:text-sm border-t border-cyan-500/30 mt-4">
          —— Dev & Design: Bitoky | WeChat: bitoky
        </div>
      </div>
    </div>
  );
}
