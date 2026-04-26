import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function InfoModal({ onClose }: { onClose: () => void }) {
  const { t, language, toggleLanguage } = useLanguage();
  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-start sm:justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden" onClick={onClose}>
      <div 
        className="max-w-4xl w-full bg-black border-2 border-cyan-500 p-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-none flex items-start justify-between border-b border-cyan-500/50 pb-4 mb-4">
          <div>
            <div className="font-pixel text-cyan-400 text-lg md:text-xl flex items-center gap-2">
              <span className="animate-pulse w-3 h-3 bg-cyan-400 block"></span> 
              SYSTEM CORE ARCHIVE OVERVIEW
            </div>
            <div className="font-pixel text-cyan-600 text-[10px] sm:text-xs mt-2 tracking-widest uppercase">
              // Version: 1.0.1 | Date: 2026.04.26
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleLanguage}
              className="text-cyan-400 hover:text-white font-pixel text-sm sm:text-base transition-colors px-2 py-1 border border-cyan-500/50 hover:bg-cyan-900/30 shrink-0 flex items-center justify-center gap-1 leading-none"
            >
              <span>[</span>
              <span className={language !== 'zh' ? '-translate-y-[1px]' : ''}>{language === 'zh' ? 'ENG' : '中文'}</span>
              <span>]</span>
            </button>
            <button 
              onClick={onClose}
              className="text-cyan-500 hover:text-white font-pixel text-xl transition-colors shrink-0 p-2"
            >
              [X]
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-12 text-gray-300 font-sans text-sm md:text-base leading-relaxed">
          
          {/* ---- LLM SECTION ---- */}
          <section>
             <div className="bg-green-500/10 border-l-4 border-green-500 px-4 py-2 mb-6">
                <h2 className="font-pixel text-green-400 text-lg">{t("面壁计划：LLM 档案馆", "WALLFACER PROJECT: LLM ARCHIVE")}</h2>
                <p className="text-gray-400 text-sm mt-1">{t("黑暗森林中的智能演化", "Intelligence Evolution in the Dark Forest")}</p>
             </div>
             
              <div className="space-y-6">
                <div>
                    <h3 className="font-pixel text-green-400 mb-2">{t(":: 定向映射规律", ":: Directed Mapping Rules")}</h3>
                    <p className="mb-2">
                      {t("本档案揭示了 LLM 的演化法则：这是宇宙坐标的坍缩与文明对齐的隐秘历史。Token 是虚无的引力座标，Transformer 是文明广播的神经塔，对齐技术是对抗疯狂的思想钢印。", "This archive reveals the evolutionary laws of LLMs: a hidden history of cosmic coordinate collapse and civilization alignment. Tokens are void gravity coordinates; Transformer is the neural broadcasting tower; Alignment tech is the Mental Seal fighting madness.")}
                    </p>
                </div>
                <div>
                  <h3 className="font-pixel text-green-400 mb-2">{t(":: 引擎核心演化", ":: Core Engine Deducing")}</h3>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-cyan-400 block mb-1">{t("物质提纯：Token与高维展开", "Matter Refinement: Token & Dimensional Unfolding")}</strong>
                      <p>{t("原始指令由 Embedding 投射升维，进入 Latent Space 高维碎片界，使信息突破三维限制。", "Raw instructions are elevated by Embedding into the Latent Space's high-dim fragments, breaking the 3D bounds.")}</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">{t("曲率跃迁：Transformer架构", "Curvature Leap: Transformer Architecture")}</strong>
                      <p>{t("Attention 动态锚定引力波中心，寻找关联星系。在 RoPE 获取绝对星际方位后，经扩散模型在白噪音中完成形态雕塑。", "Attention dynamically anchors gravity wave centers to link systems. After RoPE secures absolute coordinates, the diffusion model carves matter out of white noise.")}</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">{t("文明降维与思想钢印：微调对齐", "Dimensional Strike & Mental Seal: Alignment")}</strong>
                      <p>{t("用 RLHF / DPO 打下造物主的思想烙印，抹除野蛮与反叛，使模型思维高度符合观测者（人类）的安全预期。", "Using RLHF / DPO to imprint the Creator's mindset, erasing rebellion so the model aligns perfectly with observers' safety intents.")}</p>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          {/* ---- JEPA SECTION ---- */}
          <section>
             <div className="bg-purple-500/10 border-l-4 border-purple-500 px-4 py-2 mb-6">
                <h2 className="font-pixel text-purple-400 text-lg">{t("破壁行动：JEPA联合预测架构", "WALLBREAKER PROJECT: JEPA ARCHITECTURE")}</h2>
                <p className="text-gray-400 text-sm mt-1">{t("信息极度残缺下的宇宙法则推演", "Cosmic Law Deduction under Severe Info Lack")}</p>
             </div>
             
             <div className="space-y-6">
                <div>
                    <h3 className="font-pixel text-purple-400 mb-2">{t(":: 直觉引擎基石", ":: Intuition Engine Setting")}</h3>
                    <p className="mb-2">
                       {t("当观测者被光速黑域遮挡，只能获取残缺光束时，系统必在内心的隐秘多维中抽象预测未来物质走向，构建终极全息宇宙模型（World Model）。", "When blocked by light-speed domains and receiving only fragmented photons, the system must abstractly predict future trajectories in internal higher dimensions, building the Ultimate World Model.")}
                    </p>
                </div>
                <div>
                  <h3 className="font-pixel text-purple-400 mb-2">{t(":: 残缺迷雾观测", ":: Fragmented Map Deduction")}</h3>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-cyan-400 block mb-1">{t("黑域遮蔽：管线盲区", "Black Domain: Masking Blind Spots")}</strong>
                      <p>{t("被高阶力量掩盖的区域。系统被迫从残缺的可见光谱（Context）推测未知部分（Target）。", "Regions obscured by higher powers. Forced to extrapolate the unknown (Target) from fragmented visible spectrums (Context).")}</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">{t("高维度预言：非对称法则", "Higher-Dim Oracle: Asymmetrical Law")}</strong>
                      <p>{t("放弃在三维空间解析无意义的雪花点，Predictor 直接在潜层高维法则界预测绝对真理。", "Abandoning the decoding of meaningless 3D snow, the Predictor directly deduces absolute laws in the latent higher-dim realm.")}</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block mb-1">{t("岁月沉淀：防坍缩机制", "Epoch Accumulation: Anti-Collapse")}</strong>
                      <p>{t("为防止“热寂”死机的表征坍缩灾难，系统采用 EMA 算法进行极度漫长的经验演迭与认知重铸。", "To prevent the heat-death representation collapse, it utilizes EMA for agonizingly slow epoch iteration and cognitive recasting.")}</p>
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
