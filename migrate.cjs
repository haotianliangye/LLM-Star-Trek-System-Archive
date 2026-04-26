const fs = require('fs');

function migrate(file, importStmt) {
  let content = fs.readFileSync(file, 'utf8');
  // Find start and end
  const startMarker = 'interface ConceptNode {';
  const endMarker = '// --- COMPONENTS ---';
  
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.substring(0, startIndex) + importStmt + '\n\n' + content.substring(endIndex);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Migrated ${file}`);
  } else {
    console.log(`Failed to migrate ${file}`);
  }
}

migrate('src/LLMArchive.tsx', "import { CONCEPTS, ZONES, LINKS, ConceptNode } from './data/llmConcepts';");
migrate('src/JEPAArchive.tsx', "import { CONCEPTS, ZONES, LINKS, ConceptNode } from './data/jepaConcepts';");
