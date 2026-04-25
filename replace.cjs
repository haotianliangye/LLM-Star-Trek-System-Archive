const fs = require('fs');
let content = fs.readFileSync('src/JEPAArchive.tsx', 'utf-8');

// Replace App to JEPAArchive
content = content.replace(/export default function LLMArchive\(\)/g, 'export default function JEPAArchive()');

// Replace CONCEPTS
content = content.replace(/const CONCEPTS: ConceptNode\[\] = \[([\s\S]*?)\];/g, `const CONCEPTS: ConceptNode[] = [
  { id: 'input_video', en: 'INPUT VIDEO / IMAGE', cn: '[原始感官]', icon: '👁️', color: '#3B82F6', x: 10, y: 50, archive: 'Data: Input', metaphor: '"未被加工的原始光子流。"', desc: '原始图像或视频序列，AI系统的“视网膜”感受到的像素矩阵。' },
  { id: 'masking', en: 'MASKING STRATEGY', cn: '[时空遮蔽]', icon: '⬛', color: '#14B8A6', x: 25, y: 50, archive: 'Data: Masking', metaphor: '"人为制造的记忆盲区。"', desc: '将输入划分为“可见的上下文(Context)”和“被隐藏的目标(Target)”。在V-JEPA中，这涉及复杂的时空管道遮蔽策略。' },
  { id: 'context_enc', en: 'CONTEXT ENCODER', cn: '[语境编码器]', icon: '🧠', color: '#9333EA', x: 40, y: 35, archive: 'Core: Context Encoder', metaphor: '"从残缺碎片中提取宏观意义的大脑皮层。"', desc: '核心神经网络模块（通常是ViT），只处理未被遮蔽的内容，输出对应的隐层表征向量 (s_x)。' },
  { id: 'target_enc', en: 'TARGET ENCODER', cn: '[目标编码器]', icon: '🎯', color: '#E11D48', x: 40, y: 65, archive: 'Core: Target Encoder', metaphor: '"用逐渐沉淀的直觉去凝视真相的眼睛。"', desc: '处理被隐藏目标部分的神经网络。它的参数不接收梯度，而是通过Context Encoder参数的指数移动平均(EMA)缓慢更新。输出目标表征(s_y)。' },
  { id: 'predictor', en: 'PREDICTOR', cn: '[世界模型引擎]', icon: '🔮', color: '#F59E0B', x: 55, y: 35, archive: 'Core: Predictor', metaphor: '"能够在脑海中推演平行宇宙走向的预言家。"', desc: 'JEPA的灵魂组件。它接收上下文表征(s_x)和有关缺失区域的位置信息，直接在潜空间(Latent Space)中推断目标表征(s_y\\\')，而不是像传统模型那样去重构像素。' },
  { id: 'latent_space', en: 'LATENT SPACE', cn: '[高维抽象界]', icon: '🌌', color: '#C026D3', x: 70, y: 50, archive: 'Core: Latent Representation', metaphor: '"剥离了像素伪装的纯粹语义宇宙。"', desc: '所有的预测与对比都发生在这个抽象空间。避免了预测复杂却无意义的背景细节（比如随风飘动的树叶），迫使模型理解深层物理和语义核心。' },
  { id: 'loss_func', en: 'PREDICTIVE LOSS', cn: '[认知误差度量]', icon: '⚖️', color: '#10B981', x: 85, y: 50, archive: 'Objective: Loss', metaphor: '"衡量推演与直觉之间差距的标尺。"', desc: '通常简单的 L1 或 L2 损失。计算 Predictor 输出的预测表征(s_y\\\')与 Target Encoder 提取的真实目标表征(s_y)之间的距离。' },
  { id: 'ema', en: 'EMA UPDATE', cn: '[慢思考学习]', icon: '⏳', color: '#8B5CF6', x: 40, y: 50, archive: 'Mechanism: EMA', metaphor: '"一种防止大脑突然崩溃、缓慢积累经验的稳健派哲学。"', desc: '指数移动平均 (Exponential Moving Average)。为了防止模型学习到 trivial 方案（坍缩），只有上下文编码器通过梯度反向传播更新，目标编码器则平滑复制前者的参数。' },
  { id: 'ijepa', en: 'I-JEPA', cn: '[静态图景推演]', icon: '🖼️', color: '#FCD34D', x: 20, y: 80, archive: 'Variant: I-JEPA', metaphor: '"只凭惊鸿一瞥，便能在脑中补全巨幅画卷。"', desc: '图片领域的先驱，通过预测图片中缺失区块的潜空间表征，大幅超越像素重构模型（如MAE）的高层语义提取能力。' },
  { id: 'vjepa', en: 'V-JEPA', cn: '[时空法则推演]', icon: '🎞️', color: '#EC4899', x: 35, y: 80, archive: 'Variant: V-JEPA', metaphor: '"掌握了物理学基础直觉的视频预言系统。"', desc: '基于视频的扩充版本。不再预测短期运动，而是在长期时空块上进行预测，为体现出直观物理定律（如物体的惯性与碰撞）构建了强大的理解。' },
  { id: 'collapse', en: 'REPRESENTATION COLLAPSE', cn: '[坍缩危机]', icon: '🕳️', color: '#EF4444', x: 80, y: 25, archive: 'Challenge: Collapse', metaphor: '"停止思考，用一成不变的答案应对所有问题的终极惰性。"', desc: '自监督学习的心魔：当没有负样本时，模型把所有输入映射到常数向量，使损失为0但却学不到知识。JEPA通过EMA与预测器打破这种平衡。' },
  { id: 'world_model', en: 'WORLD MODEL', cn: '[世界模型]', icon: '🌍', color: '#22C55E', x: 90, y: 80, archive: 'Vision: World Model', metaphor: '"像人类婴儿一样，通过观察和想象理解物理世界的因果法则。"', desc: 'Yann LeCun 的终极愿景"自主机器代理"(Autonomous Machine Intelligence)的核心。让机器掌握“常识”，懂得如何推演动作和规划未来。' }
];`);

// Replace ZONES
content = content.replace(/const ZONES = \[([\s\S]*?)\];/g, `const ZONES = [
  { id: 'data', cn: '数据管线', en: 'DATA PIPELINE', color: '#3B82F6', nodes: ['input_video', 'masking'] },
  { id: 'core', cn: 'JEPA核心架构', en: 'CORE ARCHITECTURE', color: '#9333EA', nodes: ['context_enc', 'target_enc', 'predictor', 'latent_space', 'ema'] },
  { id: 'obj', cn: '优化目标与挑战', en: 'OBJECTIVE & CRISIS', color: '#10B981', nodes: ['loss_func', 'collapse'] },
  { id: 'var', cn: '模型变体与愿景', en: 'VARIANTS & VISION', color: '#F59E0B', nodes: ['ijepa', 'vjepa', 'world_model'] }
];`);

// Replace LINKS
content = content.replace(/const LINKS = \[([\s\S]*?)\];/g, `const LINKS = [
  { source: 'input_video', target: 'masking' },
  { source: 'masking', target: 'context_enc' },
  { source: 'masking', target: 'target_enc' },
  { source: 'context_enc', target: 'predictor' },
  { source: 'context_enc', target: 'ema', dashed: true },
  { source: 'ema', target: 'target_enc', dashed: true },
  { source: 'target_enc', target: 'latent_space' },
  { source: 'predictor', target: 'latent_space' },
  { source: 'latent_space', target: 'loss_func' },
  { source: 'collapse', target: 'loss_func', dashed: true },
  { source: 'collapse', target: 'ema', dashed: true },
  { source: 'ijepa', target: 'masking', dashed: true },
  { source: 'vjepa', target: 'masking', dashed: true },
  { source: 'loss_func', target: 'world_model', dashed: true }
];`);

// Fix active node setting logic to avoid crashes
content = content.replace(/const \[activeNodeId, setActiveNodeId\] = useState<string>\('latent'\);/g, "const [activeNodeId, setActiveNodeId] = useState<string>('input_video');");

// Update Text
content = content.replace(/LLM Star Trek System Archive/g, 'JEPA Architecture System Archive');
content = content.replace(/LLM Star Atlas/g, 'JEPA Architecture Database');

fs.writeFileSync('src/JEPAArchive.tsx', content);
