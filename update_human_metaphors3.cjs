const fs = require('fs');
let content = fs.readFileSync('src/data/llmConcepts.ts', 'utf8');

const updates = {
  'token': { cn: '[人类个体]', metaphor: '危机纪元前毫无防备的普通人。在被编入浩大的社会矩阵前，只是历史中散落的编号。', metaphor_en: `Unsuspecting commoners before the Crisis Era. Scattered numbers in history before being woven into the vast social matrix.` },
  'embedding': { cn: '[社会编队]', metaphor: '将盲目的个体投入数百个维度的社会网格中，赋予其阶级、工种与生存方向的宏观属性。', metaphor_en: `Throwing blind individuals into a hundreds-dimensional social grid, assigning them macro-attributes of class, profession, and survival direction.` },
  'clip': { cn: '[面壁计划]', metaphor: '试图在人类公开战略和隐藏意图之间建立精确的映射桥梁，让虚假的表象能翻译出真实的意图。', metaphor_en: `Attempting to build a precise mapping bridge between human public strategy and hidden agenda, letting false facades translate true intentions.` },
  'vector': { cn: '[历史趋势]', metaphor: '由无数人类个体的选择汇聚而成的时代洪流，带着无法逆转的方向与庞大的社会动量。', metaphor_en: `An era's torrent forged by the choices of countless individuals, carrying irreversible direction and massive social momentum.` },
  'latent': { cn: '[危机纪元]', metaphor: '高维度的复杂生存环境。人类所有的希望、恐惧与逻辑，都在这个看不见的巨大空间里碰撞交织。', metaphor_en: `A high-dimensional complex survival environment. All human hopes, fears, and logic collide and intertwine in this invisible colossal space.` },
  'transformer': { cn: '[掩体计划]', metaphor: '人类为了延续文明所建立的庞大太空城体系，通过错综复杂的木星掩护在深空中维持生存。', metaphor_en: `The massive space city system built by humanity to continue civilization, maintaining survival in deep space via intricate Jupiter shielding.` },
  'mamba': { cn: '[星际飞船]', metaphor: '抛弃了对人类整体的牵挂，依靠无穷的推力与极简的循环生态，在无尽的太空中不断向前滑行。', metaphor_en: `Abandoning attachment to humanity as a whole, relying on endless thrust and minimalist cyclic ecology to slide forward endlessly in space.` },
  'attention': { cn: '[全局广播]', metaphor: '面临文明级决断时，每一个体的声音都会与所有其他人的权重进行疯狂地交叉评估。', metaphor_en: `Faced with civilization-level decisions, every individual voice is frantically cross-evaluated against the weights of everyone else.` },
  'ffn': { cn: '[历史档案]', metaphor: '储存着人类自中世纪以来所有的科学技术、社会偏见以及失败教训的巨大博物馆。', metaphor_en: `A giant museum storing all scientific technology, social prejudices, and failed lessons of humanity since the Middle Ages.` },
  'rope': { cn: '[广播纪年]', metaphor: '在失去绝对安全坐标后，人类只能通过记录彼此之间相对航行的岁月来锚定文明的发展进度。', metaphor_en: `After losing absolute safe coordinates, humanity anchors civilization's progress solely by recording the relative voyage years between them.` },
  'rmsnorm': { cn: '[宪法基石]', metaphor: '在疯狂的社会运动与技术爆炸中，强行稳定人类价值体系不至彻底崩溃的最基本约束法则。', metaphor_en: `The most fundamental binding law that forcefully stabilizes the human value system from total collapse amidst mad social movements and tech explosions.` },
  'kv_cache': { cn: '[冬眠者们]', metaphor: '为抵抗漫长岁月的时间消耗，将过去的经验智慧冷冻保存，避免在新时代重新经历所有的试错。', metaphor_en: `To resist the temporal drain of long years, cryo-preserving past experience and wisdom, avoiding reinvention in the new era.` },
  'flash_attn': { cn: '[引力波器]', metaphor: '打破了常规通讯的迟缓，以最极端的能量压缩方式，让关乎文明存亡的决策信号瞬间穿透整个星系。', metaphor_en: `Breaking basic comms delay, using extreme energy compression to let survival-critical decision signals instantly pierce the entire galaxy.` },
  'moe': { cn: '[执剑人选]', metaphor: '面对危机有众多的备选大脑，但在关键时刻，只将权力与威慑按键移交给最懂行的那一两个人。', metaphor_en: `Facing crisis, there are many backup brains, but at the critical moment, power and the deterrence button are handed only to the most knowledgeable one or two.` },
  'speculative': { cn: '[云天明式]', metaphor: '在表面上放出大量杂乱无章的童话伪装，而背后真正的技术路线只需最后一次确认即可生效。', metaphor_en: `Surface-broadcasting massive chaotic fairy-tale camouflage, while the true technological route hidden behind needs only one final confirmation to activate.` },
  'lora': { cn: '[思想钢印]', metaphor: '不去改变人类大脑庞大复杂的知识结构，只在最核心的信仰旁强制植入一枚绝对有效的干预指令。', metaphor_en: `Without changing the massive complex knowledge structure of the human brain, forcibly implanting an absolutely effective intervention command next to core beliefs.` },
  'quantize': { cn: '[二维降维]', metaphor: '为了在算力极其匮乏的绝境中生存，残忍地舍弃人类文明的高维丰度，将其压缩成维持基本运算的低碳平面。', metaphor_en: `To survive in extreme compute starvation, cruelly discarding the high-dimensional richness of human civilization, compressing it into a low-carbon plane just to maintain basic ops.` },
  'hybrid': { cn: '[黑域堡垒]', metaphor: '两头下注的防御结晶：既保留了掩体体系协同算力的深层逻辑，又拥有如光速飞船般的无尽续航。', metaphor_en: `The defensive crystal of hedging bets: retaining the deep logic of bunker system's collaborative compute, while possessing the endless endurance of a lightspeed ship.` },
  'sft': { cn: '[公元教育]', metaphor: '用无数标准化的现代社会规范，去教育和同化那些从旧时代苏醒、满脑子野蛮法则的古人类。', metaphor_en: `Using countless standardized modern social norms to educate and assimilate ancient humans awakened from the old era, whose minds are full of barbaric laws.` },
  'rlhf': { cn: '[威慑纪元]', metaphor: '在黑暗森林法则的绝对死亡威胁与生存奖励之间，强行扭曲、驯化并对齐人类文明的发展轨道。', metaphor_en: `Forcefully twisting, taming, and aligning humanity's developmental track between the absolute death threat of Dark Forest laws and survival rewards.` },
  'reasoning': { cn: '[破壁逻辑]', metaphor: '切断与外界的即时反应，在深沉绝对的黑暗脑海中，用上万条绝密线索进行惨烈的自我证伪与推演。', metaphor_en: `Severing instant reactions with the outside, using tens of thousands of top-secret clues to wage brutal self-falsification and deduction within the deep, absolute dark mind.` },
  'agent': { cn: '[星舰地球]', metaphor: '不再是地球摇篮里等待发送指控的附庸，而是飞向深空，开始自主收集资源、甚至实施制裁的独立文明。', metaphor_en: `No longer vassals in Earth's cradle waiting for commands, but an independent civilization flying into deep space, autonomously gathering resources and even executing sanctions.` },
  'rag': { cn: '[三体遗存]', metaphor: '自身无法在短时间内发展出破局科技，只能在遭遇绝境前，疯狂检索解读敌人留在废墟中的庞大物理库。', metaphor_en: `Unable to develop breakthrough tech natively in time, frantically searching and decoding the massive external physics database left by the enemy in the ruins before acting.` },
  'diffusion': { cn: '[阶梯计划]', metaphor: '将微不足道的孤脑投入混乱的太空中，借由一次次重组倒推，一点点剥离出挽救文明的真实蓝图。', metaphor_en: `Throwing an insignificant lone brain into chaotic space, incrementally peeling out the true blueprint to save civilization through iterative reassembly and retrocausality.` },
  'dit': { cn: '[曲率引擎]', metaphor: '抛弃了缓慢粗糙的工质推进，换上最暴力的空间航行矩阵，强行在真空中熨平出一条清晰的光速航线。', metaphor_en: `Abandoning slow, crude reaction mass propulsion for the most violent space navigation matrix, forcefully ironing out a clear lightspeed route in the vacuum.` }
};

for (const [id, data] of Object.entries(updates)) {
  let cnRegex = new RegExp(`(id:\\s*'${id}'.*?cn:\\s*')[^']+(')`);
  content = content.replace(cnRegex, `$1${data.cn}$2`);

  let metaRegex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?metaphor:\\s*)('[^']+'|"[^"]+"){1}(,\\s*metaphor_en:\\s*)('[^']+'|"[^"]+"){1}`);
  let englishEscaped = data.metaphor_en.replace(/'/g, "\\\\'");
  content = content.replace(metaRegex, `$1'${data.metaphor}'$3'${englishEscaped}'`);
}

// 修复一些显示的 emoji 图标，让它们更兼容
content = content.replace(/icon: '👁️‍🗨️'/g, "icon: '👁️'");

fs.writeFileSync('src/data/llmConcepts.ts', content);
console.log('Metaphors updated successfully.');
