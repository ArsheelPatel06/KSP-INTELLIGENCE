const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/ai/**/*.ts', { cwd: __dirname });

files.forEach(file => {
  const absolutePath = path.join(__dirname, file);
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  if (content.includes('new OllamaProvider()')) {
    // Replace instantiation
    content = content.replace(/new OllamaProvider\(\)/g, 'getProvider()');
    
    // Add import for getProvider if not present
    if (!content.includes('getProvider')) {
      // Find where OllamaProvider is imported and replace it or add next to it
      const depth = file.split('/').length - 1;
      let relativePrefix = '../'.repeat(depth - 2) + 'providers/get-provider';
      if (depth === 2) relativePrefix = './providers/get-provider';
      else if (depth === 3) relativePrefix = '../providers/get-provider';
      else if (depth === 4) relativePrefix = '../../providers/get-provider';
      else if (depth === 5) relativePrefix = '../../../providers/get-provider';
      else if (depth === 6) relativePrefix = '../../../../providers/get-provider';
      
      content = `import { getProvider } from '${relativePrefix}';\n` + content;
    }
    
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log('Updated', file);
  }
});
