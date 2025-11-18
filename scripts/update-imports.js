#!/usr/bin/env node
/**
 * Script to replace relative imports with path aliases
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Mapping of relative import patterns to aliases
const replacements = [
  // Domain
  { from: /from ['"]\.\.\/\.\.\/domain\//g, to: "from '@domain/" },
  { from: /from ['"]\.\.\/domain\//g, to: "from '@domain/" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/domain\//g, to: "from '@domain/" },
  
  // Application
  { from: /from ['"]\.\.\/\.\.\/application\//g, to: "from '@application/" },
  { from: /from ['"]\.\.\/application\//g, to: "from '@application/" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/application\//g, to: "from '@application/" },
  
  // Infrastructure
  { from: /from ['"]\.\.\/\.\.\/infrastructure\//g, to: "from '@infrastructure/" },
  { from: /from ['"]\.\.\/infrastructure\//g, to: "from '@infrastructure/" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/infrastructure\//g, to: "from '@infrastructure/" },
  
  // Presentation
  { from: /from ['"]\.\.\/\.\.\/presentation\//g, to: "from '@presentation/" },
  { from: /from ['"]\.\.\/presentation\//g, to: "from '@presentation/" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/presentation\//g, to: "from '@presentation/" },
];

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  let changed = false;

  for (const { from, to } of replacements) {
    if (from.test(newContent)) {
      newContent = newContent.replace(from, to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Updated: ${path.relative(srcDir, filePath)}`);
    return 1;
  }
  
  return 0;
}

function walkDir(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      count += replaceInFile(filePath);
    }
  }

  return count;
}

console.log('🔄 Replacing relative imports with path aliases...\n');
const count = walkDir(srcDir);
console.log(`\n✅ Updated ${count} file(s)`);
