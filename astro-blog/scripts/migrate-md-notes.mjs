import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '..');
const notesRoot = path.join(workspaceRoot, 'md-notes');
const blogRoot = path.join(projectRoot, 'src', 'content', 'posts');

const FALLBACK_DATE = '2026-05-29';

function slugifySegment(value) {
	const slug = value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return slug || 'post';
}

function yamlString(value) {
	return JSON.stringify(value);
}

function extractTitle(markdown, fallback) {
	const match = markdown.match(/^#\s+(.+?)\s*$/m);
	if (!match) return fallback;

	return match[1]
		.replace(/[`*_~]/g, '')
		.replace(/\[(.*?)\]\(.*?\)/g, '$1')
		.trim() || fallback;
}

function removeFirstH1(markdown) {
	return markdown.replace(/^#\s+.+?\s*\r?\n+/, '');
}

function normalizeBody(markdown) {
	return markdown.replace(/^\[TOC\]\s*$/gm, '').replace(/\n{3,}/g, '\n\n');
}

function gitDate(relativePath) {
	try {
		const output = execFileSync(
			'git',
			['-C', notesRoot, 'log', '-1', '--format=%ad', '--date=short', '--', relativePath],
			{ encoding: 'utf8' },
		).trim();

		return output || FALLBACK_DATE;
	} catch {
		return FALLBACK_DATE;
	}
}

const noteFiles = (await glob('**/*.md', {
	cwd: notesRoot,
	nodir: true,
	dot: false,
})).sort((a, b) => a.localeCompare(b));

await rm(blogRoot, { recursive: true, force: true });
await mkdir(blogRoot, { recursive: true });

const usedOutputPaths = new Set();
let migrated = 0;

for (const relativePath of noteFiles) {
	const parsed = path.parse(relativePath);
	const inputPath = path.join(notesRoot, relativePath);
	const titleFallback = parsed.name === 'README' ? 'Introduction' : parsed.name;
	const originalMarkdown = await readFile(inputPath, 'utf8');
	const title = extractTitle(originalMarkdown, titleFallback);
	const body = normalizeBody(removeFirstH1(originalMarkdown)).trimStart();
	const outputSegments = [
		...parsed.dir.split(path.sep).filter(Boolean).map(slugifySegment),
		`${slugifySegment(parsed.name)}.md`,
	];

	let outputPath = path.join(blogRoot, ...outputSegments);
	let dedupeIndex = 2;
	while (usedOutputPaths.has(outputPath)) {
		outputPath = path.join(
			blogRoot,
			...outputSegments.slice(0, -1),
			`${slugifySegment(parsed.name)}-${dedupeIndex}.md`,
		);
		dedupeIndex += 1;
	}
	usedOutputPaths.add(outputPath);

	const pubDate = gitDate(relativePath);
	const description = `Migrated from md-notes/${relativePath}`;
	const tags = parsed.dir
		.split(path.sep)
		.filter(Boolean)
		.map(segment => segment.replace(/[_-]+/g, ' ').trim())
		.filter(Boolean);
	const category = tags[0] || 'notes';
	const frontmatter = [
		'---',
		`title: ${yamlString(title)}`,
		`published: ${pubDate}`,
		'draft: false',
		`description: ${yamlString(description)}`,
		`category: ${yamlString(category)}`,
		'tags:',
		...(tags.length > 0 ? tags : ['notes']).map(tag => `  - ${yamlString(tag)}`),
		'author: xin',
		`sourceLink: ${yamlString(`md-notes/${relativePath}`)}`,
		'comment: false',
		'---',
		'',
	].join('\n');

	await mkdir(path.dirname(outputPath), { recursive: true });
	await writeFile(outputPath, `${frontmatter}${body}`, 'utf8');
	migrated += 1;
}

console.log(`Migrated ${migrated} Markdown files to ${path.relative(projectRoot, blogRoot)}.`);
