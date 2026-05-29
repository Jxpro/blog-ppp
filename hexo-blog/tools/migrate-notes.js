const fs = require('fs');
const path = require('path');

const blogRoot = path.resolve(__dirname, '..');
const notesRoot = path.resolve(blogRoot, '..', 'md-notes');
const postsRoot = path.join(blogRoot, 'source', '_posts');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git') return [];
      return walk(fullPath);
    }
    return entry.isFile() && entry.name.toLowerCase().endsWith('.md') ? [fullPath] : [];
  });
}

function slugPart(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'post';
}

function yamlString(value) {
  return JSON.stringify(value);
}

function titleFromMarkdown(content, fallback) {
  const heading = content.match(/^#\s+(.+?)\s*#*\s*$/m);
  return heading ? heading[1].trim() : fallback;
}

function stripExistingFrontMatter(content) {
  if (!content.startsWith('---\n')) return content;
  const end = content.indexOf('\n---', 4);
  return end === -1 ? content : content.slice(content.indexOf('\n', end + 4) + 1);
}

fs.mkdirSync(postsRoot, { recursive: true });

const files = walk(notesRoot).sort((a, b) => a.localeCompare(b));
const usedOutputPaths = new Set();

for (const file of files) {
  const relative = path.relative(notesRoot, file);
  const parsed = path.parse(relative);
  const segments = parsed.dir ? parsed.dir.split(path.sep) : [];
  const outputDirs = segments.map(slugPart);
  const baseSlug = slugPart(parsed.name);
  const fullSlug = [...segments, parsed.name].map(slugPart).join('-');

  let outputPath = path.join(postsRoot, ...outputDirs, `${baseSlug}.md`);
  let suffix = 2;
  while (usedOutputPaths.has(outputPath)) {
    outputPath = path.join(postsRoot, ...outputDirs, `${baseSlug}-${suffix}.md`);
    suffix += 1;
  }
  usedOutputPaths.add(outputPath);

  const raw = fs.readFileSync(file, 'utf8');
  const body = stripExistingFrontMatter(raw)
    .replace(/^\[TOC\]\s*\n?/gm, '')
    .trimStart();
  const fallbackTitle = parsed.name.replace(/[_-]+/g, ' ');
  const title = titleFromMarkdown(body, fallbackTitle);
  const stat = fs.statSync(file);
  const date = stat.birthtime && stat.birthtime.getFullYear() > 1970 ? stat.birthtime : stat.mtime;
  const isoDate = date.toISOString().slice(0, 19).replace('T', ' ');

  const frontMatter = [
    '---',
    `title: ${yamlString(title)}`,
    `date: ${isoDate}`,
    `updated: ${stat.mtime.toISOString().slice(0, 19).replace('T', ' ')}`,
    `slug: ${yamlString(fullSlug)}`,
    `categories: ${JSON.stringify(segments)}`,
    `source_path: ${yamlString(relative.split(path.sep).join('/'))}`,
    '---',
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, frontMatter + body);
}

console.log(`Migrated ${files.length} Markdown files into ${path.relative(blogRoot, postsRoot)}.`);
