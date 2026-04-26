const fs = require('fs');

let content = fs.readFileSync('src/components/InfoModal.tsx', 'utf8');

// Replace Chinese headers with i18n
content = content.replace(
  '<h2 className="font-pixel text-green-400 text-lg">一、LLM 星际航行体系</h2>',
  '<h2 className="font-pixel text-green-400 text-lg">{t("一、LLM 星际航行体系", "1. LLM Star Trek Ecosystem")}</h2>'
);

content = content.replace(
  ':: 设定 & 核心作用',
  '{t(":: 设定 & 核心作用", ":: Setting & Core Role")}'
);

content = content.replace(
  '本项目是一个具象化、可交互的大语言模型（LLM）核心概念拓扑图。将晦涩难懂的 AI 底层机器架构隐喻为一场浩瀚的“星际航行”。在此，数据是星辰，算法是航线，模型是星际文明。作用在于通过概念可视化和脉络梳理，揭示技术递进与融合。探索者可自由拖拽推演，沉浸式了解技术的“航行日志”与“现实隐喻”。',
  '{t("本项目是一个具象化、可交互的大语言模型（LLM）核心概念拓扑图。将晦涩难懂的 AI 底层机器架构隐喻为一场浩瀚的“星际航行”。在此，数据是星辰，算法是航线，模型是星际文明。作用在于通过概念可视化和脉络梳理，揭示技术递进与融合。探索者可自由拖拽推演，沉浸式了解技术的“航行日志”与“现实隐喻”。", "This project is a visualized, interactive topological map of core concepts in Large Language Models (LLMs). It metaphorizes obscure AI underlying architectures as a vast \\"interstellar voyage\\". Here, data are stars, algorithms are routes, and models are civilizations. The purpose is to reveal technological progression and integration through concept visualization. Explorers can freely drag and deduce, immersing themselves in the \\"navigation logs\\" and \\"reality metaphors\\" of the technology.")}'
);

content = content.replace(
  ':: 星图导航：引擎与演化解析',
  '{t(":: 星图导航：引擎与演化解析", ":: Star Map Navigation: Engine & Evolution Analysis")}'
);

content = content.replace(
  '物质起源（数据与映射）',
  '{t("物质起源（数据与映射）", "Origin of Matter (Data & Mapping)")}'
);

content = content.replace(
  '一切智能始于 Token [符号碎片]，它们在被赋予能量前只是虚无的编号。经由 Embedding [传送门] 唤醒，碎片被转化为机器能理解的 Vector [原子]，并投射到浩渺的 Latent Space [宇宙容器] 中。同时，CLIP [翻译官] 正打破维度壁垒，让图像与文本在同一个坐标系下共舞。',
  '{t("一切智能始于 Token [符号碎片]，它们在被赋予能量前只是虚无的编号。经由 Embedding [传送门] 唤醒，碎片被转化为机器能理解的 Vector [原子]，并投射到浩渺的 Latent Space [宇宙容器] 中。同时，CLIP [翻译官] 正打破维度壁垒，让图像与文本在同一个坐标系下共舞。", "All intelligence begins with Token [Symbol Fragments], which are mere empty IDs before being energized. Awakened by Embedding [Portal], fragments form Vectors [Atoms] understood by machines and are projected into the vast Latent Space [Cosmic Container]. Meanwhile, CLIP [Translator] breaks dimensional barriers, allowing images and texts to dance in the same coordinate system.")}'
);

content = content.replace(
  '核心动力（架构引擎与微观机理）',
  '{t("核心动力（架构引擎与微观机理）", "Core Power (Architecture Engine & Micro-Mechanism)")}'
);

content = content.replace(
  'Transformer [超级文明] 是当前宇宙的主宰。它的内核运转极为精妙：依靠 Attention [探照灯] 动态锚定星辰间的引力，经由 FFN [前馈网络] 提取沉淀的知识库；并在航行中使用 RoPE [位置编码] 赋予符号绝对的空间刻度，利用 RMSNorm [层归一化] 平抑能量波动。在生成式的次生宇宙里，Diffusion [雕刻家] 从白噪音中一点点凿出惊世骇俗的形状。',
  '{t("Transformer [超级文明] 是当前宇宙的主宰。它的内核运转极为精妙：依靠 Attention [探照灯] 动态锚定星辰间的引力，经由 FFN [前馈网络] 提取沉淀的知识库；并在航行中使用 RoPE [位置编码] 赋予符号绝对的空间刻度，利用 RMSNorm [层归一化] 平抑能量波动。在生成式的次生宇宙里，Diffusion [雕刻家] 从白噪音中一点点凿出惊世骇俗的形状。", "Transformer [Super Civilization] dominates the current universe. Its core operates exquisitely: using Attention [Searchlight] to dynamically anchor gravity between stars, extracting knowledge via FFN [Feed-Forward Network], endowing absolute spatial scales via RoPE [Positional Encoding], and stabilizing energy via RMSNorm [Layer Normalization]. In the generative sub-universe, Diffusion [Sculptor] chisels breathtaking forms from white noise.")}'
);

content = content.replace(
  '文明驯化（训练范式）',
  '{t("文明驯化（训练范式）", "Civilization Taming (Training Paradigm)")}'
);

content = content.replace(
  '初生的模型充满混沌。需要通过 SFT [指令微调] 教导它们听懂人类对话，再使用 RLHF/DPO [航向校准] 降下造物主的强制干预，使其价值观与人类偏好完全对齐。',
  `{t("初生的模型充满混沌。需要通过 SFT [指令微调] 教导它们听懂人类对话，再使用 RLHF/DPO [航向校准] 降下造物主的强制干预，使其价值观与人类偏好完全对齐。", "Newborn models are full of chaos. They need SFT [Instruction Finetuning] to learn human dialogue, and RLHF/DPO [Course Calibration] to introduce the Creator's intervention, perfectly aligning their values with human preferences.")}`
);

content = content.replace(
  '工程奇迹与极限跃进（工程优化）',
  '{t("工程奇迹与极限跃进（工程优化）", "Engineering Miracles & Extreme Leaps (Engineering Optimization)")}'
);

content = content.replace(
  '在算力达到物理瓶颈的今天，KV Cache [航行日志] 记忆下沿途的计算轨迹，Flash Attention [加速中继] 极大缓解了 HBM 的数据拥堵，使得超长文本航行成为可能。同时，工程师们用 Quantize [压缩星图] 将庞大模型塞入凡人的装备，或是引入 Speculative Decoding [投机解码] 用小探头船高速前出探路。再用 LoRA [旁路便签贴] 在不重构宇宙的基础上快速注入新技能，引入 MoE [专家特遣队] 在不增加功耗下成倍扩展脑容量。',
  '{t("在算力达到物理瓶颈的今天，KV Cache [航行日志] 记忆下沿途的计算轨迹，Flash Attention [加速中继] 极大缓解了 HBM 的数据拥堵，使得超长文本航行成为可能。同时，工程师们用 Quantize [压缩星图] 将庞大模型塞入凡人的装备，或是引入 Speculative Decoding [投机解码] 用小探头船高速前出探路。再用 LoRA [旁路便签贴] 在不重构宇宙的基础上快速注入新技能，引入 MoE [专家特遣队] 在不增加功耗下成倍扩展脑容量。", "Engineering Miracles & Leaps: KV Cache [Navigation Log] remembers calculate traces, Flash Attention [Accel Relay] relieves HBM congestion, enabling super-long contexts. Engineers use Quantize [Compressed Star Map] to squeeze massive models into mortal gear, Speculative Decoding [Predictive Dec] to scout ahead. LoRA [Sticky Notes] rapidly injects skills, MoE [Expert Taskforce] expands brain capacity without adding power draw.")}'
);

content = content.replace(
  '星图拓展：全能异构（未来架构与系统化）',
  '{t("星图拓展：全能异构（未来架构与系统化）", "Star Map Expansion: Omnipotent Heterogeneity (Future Arch & Systems)")}'
);

content = content.replace(
  '随着时运推移，不再唯 Transformer 独尊。Mamba [流体文明] 等新架构浮现，最终促成如 Hybrid (ATTN+SSM) [混合文明] 这种兼具爆发与长续航的聚合体。或者像 DiT 这样，将序列引擎与视觉降噪融合。在应用终端，模型利用 RAG [外接馆] 检索外置记忆典籍；解锁了 Reasoning 深度推演能力，并最终装配上了具身工具箱，化身 Agent [自主星舰] 进行星际考察。',
  '{t("随着时运推移，不再唯 Transformer 独尊。Mamba [流体文明] 等新架构浮现，最终促成如 Hybrid (ATTN+SSM) [混合文明] 这种兼具爆发与长续航的聚合体。或者像 DiT 这样，将序列引擎与视觉降噪融合。在应用终端，模型利用 RAG [外接馆] 检索外置记忆典籍；解锁了 Reasoning 深度推演能力，并最终装配上了具身工具箱，化身 Agent [自主星舰] 进行星际考察。", "As time progresses, Transformer no longer rules alone. Mamba [Fluid Civilization] emerges, leading to Hybrid (ATTN+SSM) [Hybrid Civ] combining burst & endurance. Sequences blend with visual denoising in DiT. Ultimately, models use RAG [External Lib] to retrieve info, unlock Reasoning, equip tools, and step forward as an Agent [Autonomous Starship].")}'
);

content = content.replace(
  '<h2 className="font-pixel text-purple-400 text-lg">二、V-JEPA 时空图景漫游</h2>',
  '<h2 className="font-pixel text-purple-400 text-lg">{t("二、V-JEPA 时空图景漫游", "2. V-JEPA Spatiotemporal Voyage")}</h2>'
);

content = content.replace(
  '<p className="text-gray-400 text-sm mt-1">VIDEO JOINT-EMBEDDING PREDICTIVE ARCHITECTURE</p>',
  '<p className="text-gray-400 text-sm mt-1">{t("VIDEO JOINT-EMBEDDING PREDICTIVE ARCHITECTURE", "VIDEO JOINT-EMBEDDING PREDICTIVE ARCHITECTURE")}</p>'
);

content = content.replace(
  'V-JEPA 是另一种哲学：它不再像生成式模型那样痛苦地重构世界的每一个像素，而是像人类一样依靠直觉去“预测”潜藏在深处的抽象规律。',
  '{t("V-JEPA 是另一种哲学：它不再像生成式模型那样痛苦地重构世界的每一个像素，而是像人类一样依靠直觉去“预测”潜藏在深处的抽象规律。", "V-JEPA is another philosophy: Instead of painfully reconstructing every pixel of the world like generative models, it relies on intuition to \\"predict\\" abstract laws hidden within, just like a human.")}'
);

content = content.replace(
  '机制巡回',
  '{t("机制巡回", "Mechanism Tour")}'
);

content = content.replace(
  '一切始于 Input Video [原始感官]，随后被 Masking Strategy [时空遮蔽] 人为地切割出时空盲区。未被遮蔽的部分输入给 Context Encoder [语境编码器]，提取出高维特征 s_x；而 Predictor [世界模型引擎] 则在这份线索并加上盲区位置元数据的指引下，在 Latent Space [高维抽象界]直接推演出盲区内目标物质 s_y 的抽象样貌。另一方面，代表真实的 Target Encoder [目标编码器] 则提取真正的盲区数据，提供答案并在 Predictive Loss [认知误差度量] 处进行比对。',
  '{t("一切始于 Input Video [原始感官]，随后被 Masking Strategy [时空遮蔽] 人为地切割出时空盲区。未被遮蔽的部分输入给 Context Encoder [语境编码器]，提取出高维特征 s_x；而 Predictor [世界模型引擎] 则在这份线索并加上盲区位置元数据的指引下，在 Latent Space [高维抽象界]直接推演出盲区内目标物质 s_y 的抽象样貌。另一方面，代表真实的 Target Encoder [目标编码器] 则提取真正的盲区数据，提供答案并在 Predictive Loss [认知误差度量] 处进行比对。", "It starts with Input Video [Raw Sensory], artificially cut by Masking Strategy [Spatiotemporal Masking]. Visible parts enter Context Encoder to extract s_x; the Predictor [World Model Engine] then infers the target s_y in the Latent Space [High-dim Abstract Domain] using clues & position metadata. The truth-representing Target Encoder processes the actual blind spot, supplying the answer for comparison at Predictive Loss [Cognitive Error Measure].")}'
);

content = content.replace(
  '为什么不重构图像？',
  '{t("为什么不重构图像？", "Why not reconstruct images?")}'
);

content = content.replace(
  '当模型陷入重构无关紧要的背景时（例如预测风中每一片树叶的摆动），就偏离了对世界核心物理规律的理解。在 Latent Space 中推演，是模型拥有通用常识的关键。',
  '{t("当模型陷入重构无关紧要的背景时（例如预测风中每一片树叶的摆动），就偏离了对世界核心物理规律的理解。在 Latent Space 中推演，是模型拥有通用常识的关键。", "When the model gets bogged down predicting irrelevant backgrounds (e.g., every leaf in the wind), it strays from understanding core physical laws. Deducing purely in Latent Space is the key to generalized common sense.")}'
);

content = content.replace(
  '防坍缩法术',
  '{t("防坍缩法术", "Anti-Collapse Spell")}'
);

content = content.replace(
  '为了避免模型学会无脑地将所有输入映射到常熟从而让 Loss=0 (Representation Collapse [坍缩危机])，JEPA 采用了关键的 EMA Update [慢思考学习] 机制：Target Encoder 不进行反向传播更新，而是像个老者一般缓慢复制 Context Encoder 的经验。',
  '{t("为了避免模型学会无脑地将所有输入映射到常熟从而让 Loss=0 (Representation Collapse [坍缩危机])，JEPA 采用了关键的 EMA Update [慢思考学习] 机制：Target Encoder 不进行反向传播更新，而是像个老者一般缓慢复制 Context Encoder 的经验。", "To prevent the model from lazily mapping all inputs to a constant to make Loss=0 (Representation Collapse), JEPA uses the crucial EMA Update [Slow-Thinking]: Target Encoder receives no backprop updates, but slowly copies the Context Encoder’s experience like a steady elder.")}'
);

content = content.replace(
  '终极愿景',
  '{t("终极愿景", "Ultimate Vision")}'
);

content = content.replace(
  '从 I-JEPA 起步，向 V-JEPA 演进，其指向的是 Yann LeCun 心目中的 World Model [世界模型]：不再只会说车轱辘话的鹦鹉，而是拥有直观常识、能规划平行宇宙走向的机器圣灵。',
  '{t("从 I-JEPA 起步，向 V-JEPA 演进，其指向的是 Yann LeCun 心目中的 World Model [世界模型]：不再只会说车轱辘话的鹦鹉，而是拥有直观常识、能规划平行宇宙走向的机器圣灵。", "From I-JEPA tracing to V-JEPA, the trajectory aims at Yann LeCun’s World Model: no longer a parrot repeating words, but a machine spirit possessing intuitive common sense and capable of planning parallel universe branching timelines.")}'
);

// Save
fs.writeFileSync('src/components/InfoModal.tsx', content, 'utf8');
console.log("InfoModal translated");
