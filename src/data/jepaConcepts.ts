export interface ConceptNode {
  id: string;
  en: string;
  cn: string;
  cn_en?: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  archive: string;
  archive_en: string;
  metaphor: string;
  metaphor_en: string;
  desc: string;
  desc_en: string;
}

export const CONCEPTS: ConceptNode[] = [
  { 
    id: 'input_video', en: 'INPUT VIDEO / IMAGE', cn: '[降维观测]', cn_en: '[Dimensional Observation]', icon: '👁️', color: '#3B82F6', x: 10, y: 35, 
    archive: 'Data: Input', archive_en: 'Data: Input',
    metaphor: '"只能收到不完整的宇宙闪烁。在地外深空中，飞船捕获到的往往是降维后残缺不全的光子流与引力波碎片。"', metaphor_en: '"Only receiving incomplete cosmic flickers. In deep space, ships often capture fragmented photon streams and gravity waves after dimensional strikes."',
    desc: '原始图像或视频序列，AI系统的“视网膜”感受到的像素矩阵。', desc_en: 'Raw image or video sequences, the pixel matrix perceived by the AI system\'s "retina".'
  },
  { 
    id: 'masking', en: 'MASKING STRATEGY', cn: '[黑域遮蔽]', cn_en: '[Black Domain Mask]', icon: '⬛', color: '#14B8A6', x: 25, y: 35, 
    archive: 'Data: Masking', archive_en: 'Data: Masking',
    metaphor: '"被未知文明刻意掩盖的长条星域。用光速黑域遮蔽掉宇宙地图的关键部分，强迫观测者在信息盲区中求生。"', metaphor_en: '"Star regions deliberately obscured by unknown civilizations. Masking crucial cosmic maps with light-speed black domains, forcing survival in information blind spots."',
    desc: '将输入划分为“可见的上下文(Context)”和“被隐藏的目标(Target)”。在V-JEPA中，这涉及复杂的时空管道遮蔽策略。', desc_en: 'Divides the input into "visible context" and "hidden target". In V-JEPA, this involves complex spatiotemporal tube masking strategies.'
  },
  { 
    id: 'context_enc', en: 'CONTEXT ENCODER', cn: '[观测者阵列]', cn_en: '[Observer Array]', icon: '🧠', color: '#9333EA', x: 40, y: 15, 
    archive: 'Core: Context Encoder', archive_en: 'Core: Context Encoder',
    metaphor: '"飞船上庞大的冷酷解析中枢。基于残存的光刻信息解析宇宙现状，疯狂榨取那仅存的可见星图中蕴藏的微弱战略情报。"', metaphor_en: '"The massive, cold analytical hub on the ship. Parsing the current cosmic state based on residual lithographic data, frantically extracting strategic intel from visible star maps."',
    desc: '核心神经网络模块（通常是ViT），只处理未被遮蔽的内容，输出对应的隐层表征向量 (s_x)。', desc_en: 'Core neural network module (usually ViT) that processes only the unmasked content and outputs the corresponding latent representation vectors (s_x).'
  },
  { 
    id: 'target_enc', en: 'TARGET ENCODER', cn: '[绝对真理信标]', cn_en: '[Target Beacon]', icon: '🎯', color: '#E11D48', x: 40, y: 55, 
    archive: 'Core: Target Encoder', archive_en: 'Core: Target Encoder',
    metaphor: '"从未来或完整态传回的高维真理坐标。它持有那些被隐藏区域的真实模样，但不轻易示人，仅作为终极对照。"', metaphor_en: '"High-dimensional truth coordinates transmitted from the future or a complete state. It holds the true form of hidden regions, subtly acting as the ultimate reference."',
    desc: '处理被隐藏目标部分的神经网络。它的参数不接收梯度，而是通过Context Encoder参数的指数移动平均(EMA)缓慢更新。输出目标表征(s_y)。', desc_en: 'Neural network processing the hidden target part. Its parameters receive no gradients, but are slowly updated via EMA from the Context Encoder. Outputs target representation (s_y).'
  },
  { 
    id: 'predictor', en: 'PREDICTOR', cn: '[物理规律引擎]', cn_en: '[Physics Engine]', icon: '🔮', color: '#F59E0B', x: 70, y: 15, 
    archive: 'Core: Predictor', archive_en: 'Core: Predictor',
    metaphor: '"在大脑中疯狂穷举被遮盖区域物理走向的机器。基于残缺的输入，在虚空中预测并勾勒出盲区内宏大的文明与星体全貌。"', metaphor_en: '"A machine frantically enumerating the physical trajectories of obscured regions within its mind. Based on partial inputs, it predicts and outlines grand civilizations and celestial bodies in the void."',
    desc: 'JEPA的灵魂组件。它接收上下文表征(s_x)和有关缺失区域的位置信息，直接在潜空间(Latent Space)中推断目标表征(s_y\')，而不是像传统模型那样去重构像素。', desc_en: 'The soul of JEPA. It takes the context representations (s_x) and positional information of missing regions to directly infer the target representations (s_y\') in the Latent Space, instead of reconstructing pixels like traditional models.'
  },
  { 
    id: 'latent_space', en: 'LATENT SPACE', cn: '[高维空间]', cn_en: '[High-Dimensional Space]', icon: '🌌', color: '#C026D3', x: 70, y: 55, 
    archive: 'Core: Latent Representation', archive_en: 'Core: Latent Representation',
    metaphor: '"剥离低维视觉幻象的纯粹法则空间。不再纠结于像素的混沌，而是直接置身于高维空间的坐标系中，推演质量、引力与时空曲率的最核心规律。"', metaphor_en: '"A pure space of laws stripped of low-dimensional visual illusions. No longer entangled in chaotic pixels, it directly positions itself in a high-dimensional coordinate system to deduce the most core laws of mass, gravity, and spacetime curvature."',
    desc: '所有的预测与对比都发生在这个抽象空间。避免了预测复杂却无意义的背景细节（比如随风飘动的树叶），迫使模型理解深层物理和语义核心。', desc_en: 'All predictions and comparisons occur in this abstract space. It avoids predicting complex but meaningless background details (like leaves blowing in the wind), forcing the model to understand deep physical and semantic cores.'
  },
  { 
    id: 'loss_func', en: 'PREDICTIVE LOSS', cn: '[预言偏航警报]', cn_en: '[Prophecy Deviation]', icon: '⚖️', color: '#10B981', x: 85, y: 55, 
    archive: 'Objective: Loss', archive_en: 'Objective: Loss',
    metaphor: '"推演出的宇宙线与真实真理的误差惩罚。一旦偏航过大，尖锐的警报将响起，意味着飞船的认知已脱离现实，面临覆灭危机。"', metaphor_en: '"The error penalty between the deduced cosmic timeline and true reality. A large deviation triggers sharp alarms, meaning the ship\'s cognition has detached from reality, facing doom."',
    desc: '通常简单的 L1 或 L2 损失。计算 Predictor 输出的预测表征(s_y\')与 Target Encoder 提取的真实目标表征(s_y)之间的距离。', desc_en: 'Usually simple L1 or L2 loss. Computes the distance between the predicted representation (s_y\') output by the Predictor and the true target representation (s_y) extracted by the Target Encoder.'
  },
  { 
    id: 'ema', en: 'EMA UPDATE', cn: '[岁月重铸]', cn_en: '[Epoch Iteration]', icon: '⏳', color: '#8B5CF6', x: 55, y: 35, 
    archive: 'Mechanism: EMA', archive_en: 'Mechanism: EMA',
    metaphor: '"不用急躁的短视梯度，而是用漫长的时间线缓慢更新真理塔。将过去的规律经过恒纪元的沉淀，一滴一滴注入新的时代核心。"', metaphor_en: '"Eschewing impatient short-sighted gradients, instead slowly updating the truth tower over long timelines. Dripping accumulated laws from stable eras into the new core."',
    desc: '指数移动平均 (Exponential Moving Average)。为了防止模型学习到 trivial 方案（坍缩），只有上下文编码器通过梯度反向传播更新，目标编码器则平滑复制前者的参数。', desc_en: 'Exponential Moving Average. To prevent the model from learning trivial solutions (collapse), only the context encoder updates via gradient backpropagation, while the target encoder smoothly copies its parameters.'
  },
  { 
    id: 'ijepa', en: 'I-JEPA', cn: '[静态残影侧写]', cn_en: '[Static Projection]', icon: '🖼️', color: '#FCD34D', x: 25, y: 80, 
    archive: 'Variant: I-JEPA', archive_en: 'Variant: I-JEPA',
    metaphor: '"仅仅通过一张凌乱的二维星图残影，就能在脑海中侧写并推断出整个三维星系的宏大结构与文明分布。"', metaphor_en: '"Capable of profiling and deducing the grand structure and civilization distribution of an entire 3D galaxy from just a messy 2D star map shadow."',
    desc: '图片领域的先驱，通过预测图片中缺失区块的潜空间表征，大幅超越像素重构模型（如MAE）的高层语义提取能力。', desc_en: 'Pioneer in the image domain. By predicting the latent space representation of missing blocks in images, it significantly surpasses pixel reconstruction models (like MAE) in high-level semantic extraction capabilities.'
  },
  { 
    id: 'vjepa', en: 'V-JEPA', cn: '[时空曲率推演]', cn_en: '[Curvature Deduction]', icon: '🎞️', color: '#EC4899', x: 40, y: 80, 
    archive: 'Variant: V-JEPA', archive_en: 'Variant: V-JEPA',
    metaphor: '"刺透时间迷雾的计算。仅仅观测到一秒的引力波异常，就能推演还原出后续一长串星体坍塌与时空曲率的连锁反应。"', metaphor_en: '"Computations piercing the fog of time. Observing just one second of gravity wave anomaly to deduce the subsequent chain reaction of stellar collapses and spacetime curvature."',
    desc: '基于视频的扩充版本。不再预测短期运动，而是在长期时空块上进行预测，为体现出直观物理定律（如物体的惯性与碰撞）构建了强大的理解。', desc_en: 'Video-based expansion. Instead of predicting short-term motion, it acts on long spatiotemporal tubes, building a powerful understanding of intuitive physical laws (like inertia and collision of objects).'
  },
  { 
    id: 'collapse', en: 'REPRESENTATION COLLAPSE', cn: '[熵增热寂]', cn_en: '[Heat Death Threat]', icon: '🕳️', color: '#EF4444', x: 85, y: 15, 
    archive: 'Challenge: Collapse', archive_en: 'Challenge: Collapse',
    metaphor: '"模型将所有画面预测成同一个死寂点，也就是表征坍缩的灾难。如同宇宙走向无序的极点，失去了区分任何事物的能力。"', metaphor_en: '"The model predicting all scenes into a single dead point—the disaster of representation collapse. Like the universe reaching maximum entropy, losing the ability to distinguish anything."',
    desc: '自监督学习的心魔：当没有负样本时，模型把所有输入映射到常数向量，使损失为0但却学不到知识。JEPA通过EMA与预测器打破这种平衡。', desc_en: 'The inner demon of self-supervised learning: without negative samples, the model maps all inputs to a constant vector, dropping the loss to 0 but learning nothing. JEPA breaks this equilibrium through EMA & the predictor.'
  },
  { 
    id: 'world_model', en: 'WORLD MODEL', cn: '[宇宙全息镜像]', cn_en: '[Holographic Universe]', icon: '🌍', color: '#22C55E', x: 85, y: 80, 
    archive: 'Vision: World Model', archive_en: 'Vision: World Model',
    metaphor: '"最终在计算机中完整模拟演化出了真实的宇宙模型。不再困于观察的表面，而是掌握了推动万物运行的最高物理法则镜像。"', metaphor_en: '"Finally simulating and evolving a true universe model within the computer. No longer trapped by superficial observations, but mastering the holographic laws driving all existence."',
    desc: 'Yann LeCun 的终极愿景"自主机器代理"(Autonomous Machine Intelligence)的核心。让机器掌握“常识”，懂得如何推演动作和规划未来。', desc_en: 'The core of Yann LeCun\'s ultimate vision of "Autonomous Machine Intelligence". Allowing machines to master "common sense", understand how to deduce actions, and plan the future.'
  }
];

export const ZONES = [
  { id: 'data', cn: '数据管线', en: 'DATA PIPELINE', color: '#3B82F6', nodes: ['input_video', 'masking'] },
  { id: 'core', cn: 'JEPA核心架构', en: 'CORE ARCHITECTURE', color: '#9333EA', nodes: ['context_enc', 'target_enc', 'predictor', 'latent_space', 'ema'] },
  { id: 'obj', cn: '优化目标与挑战', en: 'OBJECTIVE & CRISIS', color: '#10B981', nodes: ['loss_func', 'collapse'] },
  { id: 'var', cn: '模型变体与愿景', en: 'VARIANTS & VISION', color: '#F59E0B', nodes: ['ijepa', 'vjepa', 'world_model'] }
];

export interface ConnectionLink {
  source: string;
  target: string;
  dashed?: boolean;
  connectionDesc?: string;
  connectionDesc_en?: string;
}

export const LINKS: ConnectionLink[] = [
  { source: 'input_video', target: 'masking', connectionDesc: '原始光子流/感官输入进入遮蔽策略管道，被物理拆分。', connectionDesc_en: 'Raw photon stream / sensory input enters the masking strategy pipeline and is physically split.' },
  { source: 'masking', target: 'context_enc', connectionDesc: '可见的上下文部分被输入到 Context Encoder。', connectionDesc_en: 'The visible context part is input into the Context Encoder.' },
  { source: 'masking', target: 'target_enc', connectionDesc: '被遮挡的目标部分被输入到 Target Encoder（仅提供给这部分以获取真实目标表示）。', connectionDesc_en: 'The hidden target part is input into the Target Encoder (only provided to extract true target representation).' },
  { source: 'masking', target: 'predictor', dashed: true, connectionDesc: '遮罩位置信息的元数据被送入 Predictor，作为推演的坐标和索引。', connectionDesc_en: 'Metadata of mask positions is sent as coordinates and indices into the Predictor.' },
  { source: 'context_enc', target: 'predictor', connectionDesc: 'Context Encoder 提取出的上下文高维表征送入 Predictor 作为推理的依据。', connectionDesc_en: 'Context high-dim representations extracted by Context Encoder flow into Predictor as reasoning basis.' },
  { source: 'context_enc', target: 'ema', dashed: true, connectionDesc: '慢思考学习机制：使用 Context Encoder 正在训练的梯度和权重作为源动力。', connectionDesc_en: 'Slow-thinking mechanism: Using Context Encoder\'s actively training gradients and weights as the source power.' },
  { source: 'ema', target: 'target_enc', dashed: true, connectionDesc: '目标编码器的权重不由反向传播控制，而是通过 EMA 从 Context Encoder 缓慢同步过来，防止模型坍缩。', connectionDesc_en: 'Target Encoder weights are not controlled by backprop, but slowly synchronized via EMA to prevent representation collapse.' },
  { source: 'target_enc', target: 'latent_space', connectionDesc: 'Target Encoder 将目标区域转化为高维的 Latent 表示。', connectionDesc_en: 'Target Encoder converts the target region into high-dimensional Latent representation.' },
  { source: 'predictor', target: 'latent_space', connectionDesc: 'Predictor 在抽象维度中，推演出目标区域可能对应的 Latent 表示。', connectionDesc_en: 'Predictor infers the expected Latent representation of the target region purely in abstract dimensions.' },
  { source: 'latent_space', target: 'loss_func', connectionDesc: '预测器推演出的潜空间目标表征，与目标编码器提取出的真实潜空间目标表征，在这里计算距离差异。', connectionDesc_en: 'The distance between the predicted latent representation and the true latent representation is calculated here.' },
  { source: 'loss_func', target: 'predictor', dashed: true, connectionDesc: '误差回传，主要用于更新 predictor 的推演能力。', connectionDesc_en: 'Error backpropagation, primarily updating the Predictor\'s deduction capability.' },
  { source: 'loss_func', target: 'context_enc', dashed: true, connectionDesc: '误差回传，同样用于更新 context encoder 提取关键信息的质量。', connectionDesc_en: 'Error backpropagation, also updating the Context Encoder\'s quality in extracting critical info.' },
  { source: 'collapse', target: 'loss_func', dashed: true, connectionDesc: 'Loss 如果收敛到 0，不仅代表预测准确，也可能陷入 Representation Collapse 的坍缩状态。', connectionDesc_en: 'If Loss converges to 0, it might mean accurate prediction, but it might also be trapped in Representation Collapse.' },
  { source: 'collapse', target: 'ema', dashed: true, connectionDesc: 'EMA更新机制是抵抗自监督学习中模型发生表示坍缩（Representation Collapse）的核心武器。', connectionDesc_en: 'The EMA update mechanism is the core weapon against representation collapse in self-supervised learning.' },
  { source: 'ijepa', target: 'masking', dashed: true, connectionDesc: 'I-JEPA 在单帧图像上实现了块状遮蔽机制。', connectionDesc_en: 'I-JEPA utilizes block masking mechanism on single-frame images.' },
  { source: 'vjepa', target: 'masking', dashed: true, connectionDesc: 'V-JEPA 将遮蔽机制扩展至时空维度（如遮除视频中的多帧局部）。', connectionDesc_en: 'V-JEPA extends the masking mechanism to the spatiotemporal dimension (e.g., masking tubes over multiple video frames).' },
  { source: 'loss_func', target: 'world_model', dashed: true, connectionDesc: '这种基于抽象空间预测的 Loss，驱使网络学会了物理法则，从而向宏大的 World Model 愿景迈进。', connectionDesc_en: 'This abstract spatial prediction loss forces the network to learn physical laws, stepping toward the grand World Model vision.' }
];
