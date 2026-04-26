const fs = require('fs');

function adapt(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  content = content.replace("import React, { useState", "import { useLanguage } from './contexts/LanguageContext';\nimport React, { useState");

  // Add the hoook into the main component
  const componentMatch = `export default function ${file.includes('LLM') ? 'LLMArchive' : 'JEPAArchive'}({ showInfoModal, onCloseInfoModal }: { showInfoModal: boolean, onCloseInfoModal: () => void }) {`;
  content = content.replace(componentMatch, componentMatch + "\n  const { language, t } = useLanguage();");

  // Replace activeNode fields with translations
  // activeNode.cn -> (language === 'zh' ? activeNode.cn : activeNode.en)
  // activeNode.archive -> (language === 'zh' ? activeNode.archive : activeNode.archive_en)
  // activeNode.metaphor -> (language === 'zh' ? activeNode.metaphor : activeNode.metaphor_en)
  // activeNode.desc -> (language === 'zh' ? activeNode.desc : activeNode.desc_en)
  
  content = content.replace(/\{activeNode\.cn\}/g, "{language === 'zh' ? activeNode.cn : activeNode.en}");
  content = content.replace(/\{activeNode\.archive\}/g, "{language === 'zh' ? activeNode.archive : activeNode.archive_en}");
  content = content.replace(/\{activeNode\.metaphor\}/g, "{language === 'zh' ? activeNode.metaphor : activeNode.metaphor_en}");
  content = content.replace(/\{activeNode\.desc\}/g, "{language === 'zh' ? activeNode.desc : activeNode.desc_en}");

  // Also handling the connection links modal text
  // link.connectionDesc -> (language === 'zh' ? link.connectionDesc : link.connectionDesc_en)
  content = content.replace(/\{link\.connectionDesc\}/g, "{language === 'zh' ? link.connectionDesc : link.connectionDesc_en}");

  // Some static strings replacing
  content = content.replace(/>目标\s*</g, ">{t('目标', 'Target')}<");
  content = content.replace(/>关联节点\s*</g, ">{t('关联节点', 'Connections')}<");
  content = content.replace(/>返回图谱\s*</g, ">{t('返回图谱', 'Back')}<");
  content = content.replace(/>暂不支持移动端显示和交互\s*</g, ">{t('暂不支持移动端显示和交互', 'Mobile viewing and interaction are not supported yet')}<");
  content = content.replace(/>全息星图终端\s*</g, ">{t('全息星图终端', 'Holographic Star Map Terminal')}<");
  content = content.replace(/>系统离线\s*</g, ">{t('系统离线', 'SYSTEM OFFLINE')}<");
  content = content.replace(/>未登录\s*</g, ">{t('未登录', 'Not Logged In')}<");
  content = content.replace(/>已连接\s*</g, ">{t('已连接', 'CONNECTED')}<");
  content = content.replace(/>终端控制台\s*</g, ">{t('终端控制台', 'Terminal Console')}<");
  content = content.replace(/>正在调用量子计算节点...\s*</g, ">{t('正在调用量子计算节点...', 'Invoking quantum compute nodes...')}<");
  content = content.replace(/>请在这里输入问题进行推演\s*</g, ">{t('请在这里输入问题进行推演', 'Enter question for deduction here...')}<");

  // Zone rendering:
  // zone.cn -> (language === 'zh' ? zone.cn : zone.en)
  content = content.replace(/\{zone\.cn\}/g, "{language === 'zh' ? zone.cn : zone.en}");

  // Concept node rendering in tooltip or mini-map
  content = content.replace(/\{node\.cn\}/g, "{language === 'zh' ? node.cn : node.en}");

  fs.writeFileSync(file, content, 'utf8');
}

adapt('src/LLMArchive.tsx');
adapt('src/JEPAArchive.tsx');

// Also do InfoModal
let infoContent = fs.readFileSync('src/components/InfoModal.tsx', 'utf8');
infoContent = infoContent.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../contexts/LanguageContext';");
infoContent = infoContent.replace("export default function InfoModal({ onClose }: InfoModalProps) {", "export default function InfoModal({ onClose }: InfoModalProps) {\n  const { t, language } = useLanguage();");

infoContent = infoContent.replace(/>该项目灵感来源于/g, ">{t('该项目灵感来源于', 'This project is inspired by')}");
infoContent = infoContent.replace(/构建了深度学习大模型和自监督学习的知识/g, "{t('构建了深度学习大模型和自监督学习的知识', 'building a knowledge ontology of deep learning LLMs and self-supervised learning')}");
infoContent = infoContent.replace(/可以以更自由更原生的方式与大模型进行/g, "{t('可以以更自由更原生的方式与大模型进行', 'allowing freer, more native interaction with the LLM via')}");
infoContent = infoContent.replace(/>结构化问答</g, ">{t('结构化问答', 'structured Q&A')}<");
infoContent = infoContent.replace(/>通过点击漫游不同的节点，右侧大模型将会始终结合/g, ">{t('通过点击漫游不同的节点，右侧大模型将会始终结合', 'By roaming and clicking different nodes, the right-side LLM will always incorporate')}<");
infoContent = infoContent.replace(/>节点知识及其邻居知识</g, ">{t('节点知识及其邻居知识', 'the node knowledge and its neighbor knowledge')}<");
infoContent = infoContent.replace(/>提供相关回答</g, ">{t('提供相关回答', 'to provide relevant answers')}<");
infoContent = infoContent.replace(/>如果它觉得资料不够，由于它被注入了/g, ">{t('如果它觉得资料不够，由于它被注入了', 'If it feels the information is insufficient, since it relies on')}<");
infoContent = infoContent.replace(/>世界大辞典</g, ">{t('世界大辞典', 'a world dictionary')}<");
infoContent = infoContent.replace(/，它能够回答世界上的一切。/g, "{t('，它能够回答世界上的一切。', ', it can answer everything in the world.')}");
infoContent = infoContent.replace(/>使用该项目的提示：</g, ">{t('使用该项目的提示：', 'Tips for using this project:')}<");
infoContent = infoContent.replace(/>确保你有一个强悍的网络/g, ">{t('确保你有一个强悍的网络', 'Ensure you have a strong network connection')}<");
infoContent = infoContent.replace(/>请不要频繁切换节点以防大模型跟不上/g, ">{t('请不要频繁切换节点以防大模型跟不上', 'Do not switch nodes too frequently so the LLM can keep up')}<");

fs.writeFileSync('src/components/InfoModal.tsx', infoContent, 'utf8');

console.log("Done");
