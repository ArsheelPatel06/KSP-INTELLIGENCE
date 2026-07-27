const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.node.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/ai/core/workflow/nodes');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes("new OllamaProvider('llama3.1')")) {
    content = content.replace(/new OllamaProvider\('llama3\.1'\)/g, "new OllamaProvider()");
    changed = true;
  }
  
  if (content.includes("llm.generateStructured(")) {
    content = content.replace(/llm\.generateStructured\(/g, "llm.generateStructuredJson(");
    changed = true;
  }
  
  if (content.includes("new SystemMessage(")) {
    content = content.replace(/new SystemMessage\(([^)]+)\)/g, "{ role: 'system', content: $1 }");
    changed = true;
  }
  
  if (content.includes("new HumanMessage(")) {
    content = content.replace(/new HumanMessage\(([^)]+)\)/g, "{ role: 'user', content: $1 }");
    changed = true;
  }
  
  if (content.includes("zodToJsonSchema(")) {
    // This is a bit tricky, let's match the second argument of generateStructuredJson
    content = content.replace(/zodToJsonSchema\(([^)]+)\)\n\s*\)/g, "zodToJsonSchema($1) as Record<string, unknown>,\n      { model: 'llama3.1' },\n      state.context\n    )");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
