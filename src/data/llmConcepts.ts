import { ConceptNode, ConnectionLink } from './jepaConcepts';

export const CONCEPTS: ConceptNode[] = [
  { 
    id: 'token', en: 'TOKEN', cn: '[电波碎片]', cn_en: '[Radio Fragment]', icon: 'abc', color: '#9CA3AF', x: 9.3, y: 45, 
    archive: '基础构件：Token', archive_en: 'Basic Unit: Token',
    metaphor: '"乱纪元中散落的无意义射电波。在被红岸基地解读前，仅仅是孤立的能量脉冲。"', metaphor_en: '"Unsuspecting commoners before the Crisis Era. Scattered numbers in history before being woven into the vast social matrix."',
    desc: '文本被切分出的最小信息单元。模型不认识人类文字，只能处理这些被转换成的数字化编号。', desc_en: 'The smallest unit of information split from text. Models do not recognize human words and can only process these digitized IDs.'
  },
  { 
    id: 'embedding', en: 'EMBEDDING', cn: '[红岸解码]', cn_en: '[Red Coast Decoding]', icon: '🧬', color: '#3B82F6', x: 19.3, y: 45, 
    archive: '基建层：Embedding', archive_en: 'Infrastructure: Embedding',
    metaphor: '"将一维枯燥的脉冲编号，在人类认知体系的几百个维度中展开，翻译成具有文明语义的庞大结构。"', metaphor_en: '"Throwing blind individuals into a hundreds-dimensional social grid, assigning them macro-attributes of class, profession, and survival direction."',
    desc: '查表映射操作。将离散的 Token 转换成包含了几百个维度的数值矩阵，使其获得计算机可以计算的稠密向量表示。', desc_en: 'A lookup mapping operation. Converts discrete Tokens into a numerical matrix containing hundreds of dimensions, obtaining a dense vector representation that computers can process.'
  },
  { 
    id: 'clip', en: 'CLIP', cn: '[三体游戏]', cn_en: '[Three-Body Game]', icon: '🌉', color: '#14B8A6', x: 29.3, y: 15, 
    archive: '多模态互通：CLIP', archive_en: 'Multimodal Bridge: CLIP',
    metaphor: '"由人类开发的跨模态翻译器。在人类历史景象的表皮下，映射出截然不同的文明底层逻辑。"', metaphor_en: '"Attempting to build a precise mapping bridge between human public strategy and hidden agenda, letting false facades translate true intentions."',
    desc: '跨模态对齐技术。它能将图像内容和文本描述投射到同一个语义坐标系中，实现图文互通。', desc_en: 'Cross-modal alignment technology. It projects image content and text descriptions into the same semantic coordinate system, achieving text-image interoperability.'
  },
  { 
    id: 'vector', en: 'VECTOR', cn: '[恒星坐标]', cn_en: '[Stellar Coordinates]', icon: '📐', color: '#8B5CF6', x: 29.3, y: 45, 
    archive: '抽象数据：Vector', archive_en: 'Abstract Data: Vector',
    metaphor: '"包含绝对方向与信息的语义坐标点。一旦在宇宙中暴露，其位置与引力指向即刻被锁定。"', metaphor_en: '"An era\'s torrent forged by the choices of countless individuals, carrying irreversible direction and massive social momentum."',
    desc: '承载了特征与语义的数值数组。在这个阶段，语言的表面形态已经消失，变成了纯粹可计算的数学方向向量。', desc_en: 'A numerical array carrying features and semantics. At this stage, the surface form of language vanishes, becoming a purely computable mathematical direction vector.'
  },
  { 
    id: 'latent', en: 'LATENT SPACE', cn: '[四维空间]', cn_en: '[Fourth Dimension]', icon: '🌌', color: '#C026D3', x: 39.3, y: 45, 
    archive: '核心域：Latent Space', archive_en: 'Core Domain: Latent Space',
    metaphor: '"超越现实表象的高维物理空间。在这里，数据的骨骼与语义的内脏一览无余，所有三维世界看似不相干的概念，都在更高的维度上紧密相连。"', metaphor_en: '"A high-dimensional complex survival environment. All human hopes, fears, and logic collide and intertwine in this invisible colossal space."',
    desc: '深度学习模型内部处理数据的多维抽象空间。在这个空间里，意义相近的概念会在几何距离上靠得更近。', desc_en: 'A multi-dimensional abstract space inside deep learning models for processing data. In this space, concepts with similar meanings are geometrically closer.'
  },
  { 
    id: 'transformer', en: 'TRANSFORMER', cn: '[面壁计划]', cn_en: '[Wallfacer Project]', icon: '🤖', color: '#9333EA', x: 59.3, y: 45, 
    archive: '核心文明：Transformer', archive_en: 'Core Civilization: Transformer',
    metaphor: '"人类统筹全局的核心思维引擎。依靠绝密的全局注意力，处理过去并推演出未来的唯一解。"', metaphor_en: '"The massive space city system built by humanity to continue civilization, maintaining survival in deep space via intricate Jupiter shielding."',
    desc: '目前最主流的底层模型架构。接收输入后，能在极其复杂的神经网路中推理并生成下一个词。核心是注意力机制。', desc_en: 'The most mainstream foundational architecture today. After receiving input, it reasons through an extremely complex neural network to generate the next word. The core is the attention mechanism.'
  },
  { 
    id: 'mamba', en: 'MAMBA', cn: '[世代飞船]', cn_en: '[Generation Ship]', icon: '🐍', color: '#10B981', x: 39.3, y: 15, 
    archive: '架构分支：Mamba (SSM)', archive_en: 'Architecture Branch: Mamba (SSM)',
    metaphor: '"抛弃了对人类历史全局视野的回望。只维持恒定的状态，在无限的时间走廊中一往无前后退。"', metaphor_en: '"Abandoning attachment to humanity as a whole, relying on endless thrust and minimalist cyclic ecology to slide forward endlessly in space."',
    desc: '状态空间模型(SSM) 的杰出代表。舍弃了全局注意力，通过选择性扫描机制压缩历史信息，推理速度不受长文本拖累，显存占用固定。', desc_en: 'An outstanding representative of State Space Models (SSM). Discarding global attention, it compresses historical info via selective scanning. Inference speed is unfazed by long texts, and memory usage is constant.'
  },
  { 
    id: 'attention', en: 'ATTENTION', cn: '[猜疑链]', cn_en: '[Chain of Suspicion]', icon: '👁️', color: '#F43F5E', x: 69.3, y: 35, 
    archive: '运算核：Self-Attention', archive_en: 'Compute Core: Self-Attention',
    metaphor: '"无法逃避的连接属性：在每一次运算中，序列里的每一个元素都必须疯狂评估自己与所有其他元素的距离。"', metaphor_en: '"Faced with civilization-level decisions, every individual voice is frantically cross-evaluated against the weights of everyone else."',
    desc: '注意力机制。允许序列中的每一个词都能“看到”并评估整个上下文，通过数学矩阵算出词与词彼此之间的关联权重与重要性。', desc_en: 'Attention mechanism. Allows every word in a sequence to "see" and evaluate the entire context, calculating their relational weights and importance via mathematical matrices.'
  },
  { 
    id: 'ffn', en: 'FFN', cn: '[冥王星墓碑]', cn_en: '[Pluto Tombstone]', icon: '🧠', color: '#F43F5E', x: 69.3, y: 60, 
    archive: '运算核：Feed Forward Network', archive_en: 'Compute Core: Feed Forward Network',
    metaphor: '"人类文明的最终存储器。将训练观测到的所有流经的信息与偏见，如同《诗经》般死死刻在石头上。"', metaphor_en: '"A giant museum storing all scientific technology, social prejudices, and failed lessons of humanity since the Middle Ages."',
    desc: '前馈神经网络。通常接在注意力层之后，占据了模型的大部分参数，扮演着“知识库”的角色，用来记忆训练中学到的知识和规则。', desc_en: 'Feed-Forward Network. Usually placed after the attention layer, it occupies most of the model\'s parameters, acting as a "knowledge base" to memorize facts and rules learned during training.'
  },
  { 
    id: 'rope', en: 'RoPE', cn: '[相对纪年]', cn_en: '[Relative Era]', icon: '🧭', color: '#F43F5E', x: 59.3, y: 15, 
    archive: '位置编码：Rotary Position Embedding', archive_en: 'Positional Encoding: RoPE',
    metaphor: '"在真空中绝对的时间坐标没有意义，只能通过事件之间的相对旋转位置，来锚定彼此的精确身位。"', metaphor_en: '"After losing absolute safe coordinates, humanity anchors civilization\'s progress solely by recording the relative voyage years between them."',
    desc: '旋转位置编码。通过巧妙的数学旋转矩阵，把词的绝对和相对位置信息揉进数据中，让模型“知道”词的先后顺序。', desc_en: 'Rotary Position Embedding. Kneads absolute and relative positional info into the data via clever mathematical rotation matrices, letting the model "know" the sequence of words.'
  },
  { 
    id: 'rmsnorm', en: 'RMSNorm', cn: '[掩体工程]', cn_en: '[Bunker Project]', icon: '⚡', color: '#F43F5E', x: 69.3, y: 15, 
    archive: '归一化操作：RMSNorm', archive_en: 'Normalization: RMSNorm',
    metaphor: '"为了防止内部脆弱系统被光粒打击级别的狂暴数据流彻底撕裂，而建立的能量稳压与结构屏障。"', metaphor_en: '"The most fundamental binding law that forcefully stabilizes the human value system from total collapse amidst mad social movements and tech explosions."',
    desc: '一种基础的均方根归一化操作。通过对每层数据做缩放处理，防止运算时出现数值爆炸或消失。它去掉了传统方法中的均值计算，效率更高。', desc_en: 'A fundamental Root Mean Square Normalization. Scales data in each layer to prevent numerical explosion or vanishing. Discarding the mean calculation of traditional methods makes it highly efficient.'
  },
  { 
    id: 'kv_cache', en: 'KV CACHE', cn: '[冬眠中心]', cn_en: '[Hibernation Center]', icon: '💾', color: '#0EA5E9', x: 79.3, y: 50, 
    archive: '工程技巧：KV Cache', archive_en: 'Engineering Trick: KV Cache',
    metaphor: '"为了对抗漫长推演的消耗，把过去的运算状态直接丢入冷冻舱携带，避免在每个纪元重复唤醒并重新计算。"', metaphor_en: '"To resist the temporal drain of long years, cryo-preserving past experience and wisdom, avoiding reinvention in the new era."',
    desc: '键值缓存。在推理生成词汇时，把前面已经算过的状态张量存放在显存里。极大减少了重复计算，但文本越长显存消耗越恐怖。', desc_en: 'Key-Value Cache. During sequential text generation, previously computed state tensors are stored in VRAM. It massively reduces redundant compute, but VRAM consumption becomes terrifying as text lengthens.'
  },
  { 
    id: 'flash_attn', en: 'FLASH ATTENTION', cn: '[曲率驱动]', cn_en: '[Curvature Drive]', icon: '⚡', color: '#0EA5E9', x: 89.3, y: 15, 
    archive: '工程技巧：Flash Attention', archive_en: 'Engineering Trick: Flash Attention',
    metaphor: '"抹平了硬件读写的空间沟壑，打破了算力的光速屏障，让系统处理海量轨迹信息的航速达到光速。"', metaphor_en: '"Breaking basic comms delay, using extreme energy compression to let survival-critical decision signals instantly pierce the entire galaxy."',
    desc: '一种颠覆性的工程优化。通过更聪明地利用显卡的极速缓存（SRAM）进行分块计算，避免了底层巨大的数据搬运，让长文本处理速度起飞。', desc_en: 'A disruptive engineering optimization. Uses smart block-wise compute leveraging GPU\'s ultrafast SRAM, avoiding colossal data I/O bottlenecks and making long-context processing speed skyrocket.'
  },
  { 
    id: 'moe', en: 'MoE', cn: '[执剑人候选]', cn_en: '[Swordholder Candidate]', icon: '🔀', color: '#F43F5E', x: 89.3, y: 60, 
    archive: '架构变种：Mixture of Experts', archive_en: 'Architecture Variant: Mixture of Experts',
    metaphor: '"威慑中心同时存在多位不同性格的候选大脑，但在决定性瞬间，系统只唤醒最适配当前局势的那一位来按下开关。"', metaphor_en: '"Facing crisis, there are many backup brains, but at the critical moment, power and the deterrence button are handed only to the most knowledgeable one or two."',
    desc: '混合专家架构。将大网络拆分成多个专门的“专家”模块。每次计算只根据内容激活很少的专家，实现在不增加运算负担的情况下成倍扩充模型容量。', desc_en: 'Mixture of Experts architecture. Splits a large network into multiple specialized "expert" modules. Computation activates only a few relevant experts each time, exponentially expanding capacity without adding compute burden.'
  },
  { 
    id: 'speculative', en: 'SPECULATIVE DEC.', cn: '[破壁推演]', cn_en: '[Wallbreaker Deduction]', icon: '🐇', color: '#0EA5E9', x: 89.3, y: 35, 
    archive: '工程技巧：Speculative Decoding', archive_en: 'Engineering Trick: Speculative Decoding',
    metaphor: '"破壁人在暗处疯狂盲写出了上百种计划的走向，而面壁者（主模型）只需在最后看一眼，便宣判其生效或是摧毁。"', metaphor_en: '"Surface-broadcasting massive chaotic fairy-tale camouflage, while the true technological route hidden behind needs only one final confirmation to activate."',
    desc: '推测解码机制。先用一个极快的小模型“蒙”出接下来几个词，再让主模型一次性打包验证猜得对不对。猜对了直接提速，错了就回退重成。', desc_en: 'Speculative Decoding. Uses an extremely fast small model to "guess" the next few words, then makes the main model batch-verify the draft. Right guesses yield instant speedups; wrong ones backtrack and regenerate.'
  },
  { 
    id: 'lora', en: 'LoRA', cn: '[阶梯计划]', cn_en: '[Staircase Project]', icon: '🪡', color: '#0EA5E9', x: 79.3, y: 15, 
    archive: '微调方法：Low-Rank Adaptation', archive_en: 'Finetuning Method: Low-Rank Adaptation',
    metaphor: '"无法搬动那台庞大的主体，只能将最核心的轻量级大脑塞入辐射帆，利用旁路推向指定的任务轨道。"', metaphor_en: '"Without changing the massive complex knowledge structure of the human brain, forcibly implanting an absolutely effective intervention command next to core beliefs."',
    desc: '低秩微调技术。不去改变模型原本庞大且难以训练的主体权重，而是在旁边“外挂”两个极小降维矩阵进行训练更新，让消费级显卡也能微调大模型。', desc_en: 'Low-Rank Adaptation. Leaves the massive, hard-to-train core weights untouched, instead "plugging in" two extremely small reduced-dimension matrices for updates, allowing finetuning on consumer GPUs.'
  },
  { 
    id: 'quantize', en: 'QUANTIZATION', cn: '[黑域计划]', cn_en: '[Black Domain Project]', icon: '🧊', color: '#0EA5E9', x: 79.3, y: 35, 
    archive: '工程技巧：Quantization', archive_en: 'Engineering Trick: Quantization',
    metaphor: '"主动降低运算的精度限制，以牺牲高维细节智能为代价，换取在算力与资源极度匮乏的宇宙中安全运行。"', metaphor_en: '"To survive in extreme compute starvation, cruelly discarding the high-dimensional richness of human civilization, compressing it into a low-carbon plane just to maintain basic ops."',
    desc: '量化技术。为了在有限的设备上运行，将高精度的浮点数计算强制压缩到低精度整数。牺牲微小的聪明度，换取体积大幅缩减与翻倍的速度。', desc_en: 'Quantization. Forcefully compresses high-precision float computations into low-precision integers to run on limited hardware. Trades a tiny bit of IQ for dramatic memory reductions and doubled speeds.'
  },
  { 
    id: 'hybrid', en: 'HYBRID', cn: '[星舰地球]', cn_en: '[Starship Earth]', icon: '🧬', color: '#9333EA', x: 49.3, y: 30, 
    archive: '前沿架构：混合架构 (ATTN+SSM)', archive_en: 'Frontier Architecture: Hybrid (ATTN+SSM)',
    metaphor: '"极致的混血幸存者：既保留了地球文明精密复杂的思维逻辑体系，又拥有舰队在深空中流浪的无限续航。"', metaphor_en: '"The defensive crystal of hedging bets: retaining the deep logic of bunker system\'s collaborative compute, while possessing the endless endurance of a lightspeed ship."',
    desc: '结合多种长处的混合架构。既保留了 Transformer 卓越的上下文理解能力，又融入了 Mamba 能够无负担吞下超长文本的优势。', desc_en: 'A hybrid architecture combining various strengths. It retains Transformer\'s excellent context understanding while integrating Mamba\'s ability to digest ultra-long texts with zero burden.'
  },
  { 
    id: 'sft', en: 'SFT', cn: '[思想钢印]', cn_en: '[Mental Seal]', icon: '👨‍🏫', color: '#10B981', x: 59.3, y: 65, 
    archive: '训练阶段：Supervised Fine-Tuning', archive_en: 'Training Stage: Supervised Fine-Tuning',
    metaphor: '"一种底层的心智格式化工程。用上万次标准的行为测试模板，强行在机器图景中打下绝对服从的烙印。"', metaphor_en: '"Using countless standardized modern social norms to educate and assimilate ancient humans awakened from the old era, whose minds are full of barbaric laws."',
    desc: '监督微调阶段。给模型喂进去数十万条高质量的“问答范例”，强行纠正它原本毫无章法的续写习惯，规训成一个懂礼貌、听指令的 AI 助手格式。', desc_en: 'Supervised Fine-Tuning. Feeds hundreds of thousands of high-quality "Q&A examples" into the model, forcefully correcting its chaotic continuation habits and taming it into a polite, instruction-following AI assistant.'
  },
  { 
    id: 'rlhf', en: 'RLHF / DPO', cn: '[威慑控制]', cn_en: '[Deterrence Control]', icon: '⛓️', color: '#10B981', x: 79.3, y: 70, 
    archive: '对抗训练：对齐人类偏好', archive_en: 'Adversarial Training: Aligning Human Preferences',
    metaphor: '"基于同归于尽的打分机制。通过高悬的奖励与毁灭规则，强行将未知的庞大智能体对齐到人类的安全偏好上。"', metaphor_en: '"Forcefully twisting, taming, and aligning humanity\'s developmental track between the absolute death threat of Dark Forest laws and survival rewards."',
    desc: '基于反馈的强化学习。引入一个“裁判”给模型的回答打分并奖惩，让它学会避免输出有害内容，并越来越迎合人类的偏好和价值观。', desc_en: 'Reinforcement Learning from Human Feedback. Introduces a "referee" to score and penalize the model\'s answers, teaching it to avoid harmful text and increasingly align with human preferences and values.'
  },
  { 
    id: 'reasoning', en: 'REASONING', cn: '[面壁沉思]', cn_en: '[Wallfacer Meditation]', icon: '🕵️', color: '#F59E0B', x: 89.3, y: 80, 
    archive: '系统层：思维链推理', archive_en: 'System Layer: Chain of Thought Reasoning',
    metaphor: '"切断一切立刻作答的通讯。在绝对封闭的心智室中，用成千上万张自我推翻的草案进行惨烈的逻辑搏斗。"', metaphor_en: '"Severing instant reactions with the outside, using tens of thousands of top-secret clues to wage brutal self-falsification and deduction within the deep, absolute dark mind."',
    desc: '系统2慢思考机制（如思维链 CoT）。跨越了“条件反射”式的文字连续预测，让大模型在给出结论前进行多步逻辑拆解、自我纠错与解题空间探索，从而攻克复杂的数理推演。', desc_en: 'System 2 slow thinking (e.g., Chain of Thought). Transcends "reflexive" continuous word prediction. Lets the model perform multi-step logic decomposition, self-correction, and explore the solution space before concluding, conquering complex mathematical deduction.'
  },
  { 
    id: 'agent', en: 'AGENT SYSTEMS', cn: '[自治星舰]', cn_en: '[Autonomous Starship]', icon: '🛠️', color: '#F59E0B', x: 49.3, y: 80, 
    archive: '系统层：AI Agent', archive_en: 'System Layer: AI Agent',
    metaphor: '"不再是地球摇篮里等待发送指令的附庸，而是飞向深空，拥有独立感知、自主筹谋并操作世界资源能力的独立流浪文明实体。"', metaphor_en: '"No longer vassals in Earth\'s cradle waiting for commands, but an independent civilization flying into deep space, autonomously gathering resources and even executing sanctions."',
    desc: '智能体系统。相当于让大模型长出了感知与行动的“手脚”。不仅能聊天，还能自主写代码、用工具、联网搜索、规划任务，从而完成复杂的长线工作。', desc_en: 'Agentic Systems. Equivalent to growing perceptive and active "limbs" for the LLM. It can now not only chat, but autonomously write code, use tools, search the web, and plan tasks, accomplishing complex long-term workflows.'
  },
  { 
    id: 'rag', en: 'RAG', cn: '[地球档案]', cn_en: '[Earth Archives]', icon: '📚', color: '#F59E0B', x: 19.3, y: 80, 
    archive: '系统外挂：Retrieval-Augmented Gen', archive_en: 'System Add-on: Retrieval-Augmented Generation',
    metaphor: '"自身脑力无法凭空记住所有的科技细节，只能在输出决策前，光速检索并解码母星过去留在主系统中的庞大历史与科学记载。"', metaphor_en: '"Unable to hardcode all technical details natively, frantically searching and decoding the massive external historical and scientific database left by the mother planet before acting."',
    desc: '检索增强生成。由于模型无法凭借参数记住世间万物，所以在它回答前，先去外置的知识库里搜索精准的参考资料，把资料塞入提示词里让它“开卷作答”，能有效消除幻觉。', desc_en: 'Retrieval-Augmented Generation. Since the model cannot memorize everything in its parameters, this tech scours external knowledge bases for precise references before answering, feeding them into the prompt for an "open-book exam", effectively eliminating hallucination.'
  },
  { 
    id: 'diffusion', en: 'DIFFUSION', cn: '[宇宙闪烁]', cn_en: '[Universe Flicker]', icon: '✨', color: '#9333EA', x: 39.3, y: 65, 
    archive: '生成范式：扩散模型', archive_en: 'Generative Paradigm: Diffusion Models',
    metaphor: '"将看似杂乱的宇宙微波背景辐射噪点，通过观测倒推，剥离出其背后的神迹与图景。"', metaphor_en: '"Throwing an insignificant lone brain into chaotic space, incrementally peeling out the true blueprint to save civilization through iterative reassembly and retrocausality."',
    desc: '扩散模型，当前 AI 绘画领域的主宰。原理是先将图像完全破坏成随机噪点，然后让模型学会如何一步步剔除噪点，最终还原出清晰的画面。', desc_en: 'Diffusion Models, the current dominator in AI art. It destroys an image into random noise, then teaches the model to iteratively remove noise, eventually restoring a clear picture.'
  },
  { 
    id: 'dit', en: 'DiT', cn: '[引力波天线]', cn_en: '[Gravity Wave Antenna]', icon: '🎥', color: '#9333EA', x: 49.3, y: 60, 
    archive: '前沿架构：Diffusion Transformer', archive_en: 'Frontier Architecture: Diffusion Transformer',
    metaphor: '"弃用旧时代孱弱的工具，换上最极致暴力的标准阵列通讯器，强行在噪点海洋中震荡出绝对清晰的宏大画面。"', metaphor_en: '"Abandoning slow, crude reaction mass propulsion for the most violent space navigation matrix, forcefully ironing out a clear lightspeed route in the vacuum."',
    desc: 'Sora 视频模型的核心突破。简单说，就是把扩散模型里原本用来去噪的旧组件，替换成了 Transformer 这个性能怪物，贯彻了大力出奇迹的暴力美学。', desc_en: 'The core breakthrough behind the Sora video model. Simply put, it replaces the old denoising components of Diffusion with the performance beast Transformer, executing the brutalist aesthetic of scaling up.'
  }
];

export const ZONES = [
  { id: 'data', cn: '数据区', en: 'DATA/MAPPING', color: '#3B82F6', nodes: ['token', 'embedding', 'vector', 'clip'] },
  { id: 'arch', cn: '架构区', en: 'ARCHITECTURES', color: '#9333EA', nodes: ['transformer', 'mamba', 'diffusion', 'dit', 'hybrid'] },
  { id: 'mech', cn: '微观机理', en: 'MECHANISMS', color: '#F43F5E', nodes: ['attention', 'ffn', 'moe', 'rope', 'rmsnorm'] },
  { id: 'eng', cn: '工程优化', en: 'ENGINEERING', color: '#14B8A6', nodes: ['kv_cache', 'flash_attn', 'quantize', 'speculative', 'lora'] },
  { id: 'train', cn: '训练范式', en: 'TRAINING/ALIGN', color: '#10B981', nodes: ['sft', 'rlhf'] },
  { id: 'sys', cn: '系统层', en: 'SYSTEM/APP', color: '#F59E0B', nodes: ['rag', 'reasoning', 'agent'] }
];

export const LINKS: ConnectionLink[] = [
  { source: 'token', target: 'embedding', connectionDesc: '将离散的符号（Token）映射为高维空间中的稠密向量。', connectionDesc_en: 'Maps discrete symbols (Tokens) into dense vectors in high-dimensional space.' },
  { source: 'embedding', target: 'vector', connectionDesc: 'Embedding 层输出固定维度的向量（Vector）表示。', connectionDesc_en: 'The Embedding layer outputs a fixed-dimension Vector representation.' },
  { source: 'clip', target: 'vector', dashed: true, connectionDesc: '多模态翻译官(CLIP)将图像或文本对齐到统一的向量空间中。', connectionDesc_en: 'The Multimodal Translator (CLIP) aligns images or texts into a unified vector space.' },
  { source: 'vector', target: 'latent', connectionDesc: '各类向量汇聚成的抽象语义维度（Latent Space）。', connectionDesc_en: 'Abstract semantic dimensions formed by various vectors converging (Latent Space).' },
  { source: 'latent', target: 'transformer', dashed: true, connectionDesc: 'Latent 空间内的稠密向量序列是 Transformer 处理的初始信号源。', connectionDesc_en: 'Dense vector sequences within the Latent space are the initial signal source processed by Transformer.' },
  { source: 'latent', target: 'mamba', dashed: true, connectionDesc: '状态空间模型(Mamba)同样处理 Latent 向量，将其作为序列流动的基础。', connectionDesc_en: 'State Space Models (Mamba) also process Latent vectors, using them as the foundation for sequence flow.' },
  { source: 'transformer', target: 'attention', connectionDesc: 'Transformer 的核心引擎机制，赋予模型关注序列全局的能力。', connectionDesc_en: 'The core engine mechanism of Transformer, endowing the model with global sequence attention capability.' },
  { source: 'transformer', target: 'kv_cache', connectionDesc: '为支撑 Transformer 架构在生成阶段的性能而演化出的核心工程技术。', connectionDesc_en: 'A core engineering tech evolved to support Transformer architecture performance during generation.' },
  { source: 'transformer', target: 'ffn', connectionDesc: 'Transformer 中的记忆和非线性计算节点。', connectionDesc_en: 'Memory and nonlinear compute nodes inside the Transformer.' },
  { source: 'transformer', target: 'rope', connectionDesc: '为主力引擎(Transformer)提供相对位置编码的机制。', connectionDesc_en: 'Mechanism providing relative position embedding for the main engine (Transformer).' },
  { source: 'transformer', target: 'rmsnorm', connectionDesc: '稳定 Transformer 内部能量(梯度)流动的基础组件。', connectionDesc_en: 'Fundamental component stabilizing internal energy (gradient) flow within Transformer.' },
  { source: 'ffn', target: 'moe', dashed: true, connectionDesc: '引入稀疏激活机制(MoE)，在不增加前向计算量的情况下极大扩展 FFN 的容量。', connectionDesc_en: 'Introduces sparse activation (MoE), massively expanding FFN capacity without adding forward compute.' },
  { source: 'attention', target: 'flash_attn', dashed: true, connectionDesc: '通过显存读写优化，打破 Attention 机制长序列计算的性能瓶颈。', connectionDesc_en: 'Breaks performance bottlenecks in long sequence Attention compute via memory I/O optimizations.' },
  { source: 'transformer', target: 'speculative', dashed: true, connectionDesc: '在推演时加速 Transformer 输出速度的神级优化策略。', connectionDesc_en: 'God-tier optimization strategy speeding up Transformer output rates during inference.' },
  { source: 'transformer', target: 'lora', dashed: true, connectionDesc: '一种为极其庞大的 Transformer 核心进行高效知识侧写/微调的外部组件。', connectionDesc_en: 'An external component providing efficient knowledge profiling/finetuning for massive Transformer cores.' },
  { source: 'transformer', target: 'sft', dashed: true, connectionDesc: '使原始的 Transformer 从预测下一个词进阶为遵从指令的对话形态的第一步。', connectionDesc_en: 'The 1st step evolving raw Transformers from next-word prediction to instruction-compliant dialogue patterns.' },
  { source: 'sft', target: 'rlhf', connectionDesc: '将初步指令微调(SFT)后的模型，进一步拉齐到人类真实的价值观与偏好上。', connectionDesc_en: 'Aligns the preliminary SFT model further with true human values and preferences.' },
  { source: 'rlhf', target: 'reasoning', dashed: true, connectionDesc: '在对齐的基础上，激发模型产生深度的逻辑推理过程（如思维链机制）。', connectionDesc_en: 'On top of alignment, stimulates deep logical reasoning processes (like Chain of Thought).' },
  { source: 'reasoning', target: 'agent', dashed: true, connectionDesc: '具备推理能力后，模型得以进化为能够自主规划并调用工具的 Agent（智能体）。', connectionDesc_en: 'Given reasoning capabilities, the model evolves into an Agent capable of autonomous planning and tool invocation.' },
  { source: 'rag', target: 'agent', dashed: true, connectionDesc: '知识库(RAG)作为 Agent 感知和操作外部长期记忆的重要外挂组件。', connectionDesc_en: 'Knowledge base (RAG) acts as an essential plugin for Agents to perceive and operate external long-term memory.' },
  { source: 'latent', target: 'rag', dashed: true, connectionDesc: '输入问题在 Latent Space 中的向量化表示，用于在向量数据库(RAG)中进行相似度检索。', connectionDesc_en: 'Vectorized representation of the query in Latent Space, used for similarity retrieval in vector DBs (RAG).' },
  { source: 'latent', target: 'diffusion', dashed: true, connectionDesc: 'Latent 空间中的语义向量引导 Diffusion 模型进行去噪和图像生成。', connectionDesc_en: 'Semantic vectors in Latent Space guide Diffusion models to denoise and generate images.' },
  { source: 'diffusion', target: 'dit', dashed: true, connectionDesc: '将 Diffusion 机制与 Transformer 强大的表征能力相结合。', connectionDesc_en: 'Combines Diffusion mechanism with the powerful representation capabilities of Transformer.' },
  { source: 'transformer', target: 'dit', dashed: true, connectionDesc: '跨界融合：将传统的视觉去噪组件(U-Net)替换为强大的序列处理引擎(Transformer)。', connectionDesc_en: 'Cross-fusion: Replaces the traditional visual denoising unit (U-Net) with the powerful sequence engine (Transformer).' },
  { source: 'transformer', target: 'hybrid', dashed: true, connectionDesc: '取长补短的究极聚合体。结合了 Transformer 和线性模型的架构演化。', connectionDesc_en: 'The ultimate synthesis drawing upon strengths. An architecture evolution blending Transformers and linear models.' },
  { source: 'mamba', target: 'hybrid', dashed: true, connectionDesc: 'Mamba 提供流式恒定计算复杂度，与 Transformer 互补结合为混合架构。', connectionDesc_en: 'Mamba offers constant streaming compute complexity, complementing Transformer nicely in a hybrid architecture.' },
  { source: 'transformer', target: 'quantize', dashed: true, connectionDesc: '对庞大的 Transformer 模型在工程层面进行降维折叠，以塞入更小的计算核心。', connectionDesc_en: 'Dim-folds the massive Transformer model on an engineering level to squeeze into smaller compute cores.' },
  { source: 'kv_cache', target: 'quantize', dashed: true, connectionDesc: '对巨大的 KV Cache 显存占用进行量化压缩，提升长文本吞吐量。', connectionDesc_en: 'Quantize-compresses the gigantic KV Cache memory footprint to boost long-context throughput.' },
  { source: 'clip', target: 'diffusion', dashed: true, connectionDesc: '利用 CLIP 提供的文本-图像对齐潜变量，精准引导 Diffusion 模型的作图方向。', connectionDesc_en: 'Leverages text-image aligned latent variables from CLIP to precisely steer Diffusion generation vectors.' },
  { source: 'rag', target: 'transformer', dashed: true, connectionDesc: '外挂知识库：辅助 Transformer 在推演时获取超越自身参数体量的外部实时知识。', connectionDesc_en: 'Plugin knowledge base: Assists Transformer in acquiring external real-time data beyond its parameter vault.' }
];
