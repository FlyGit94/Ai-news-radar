import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

const RAW_DIR = path.resolve('docs/public/data/raw')
const OUT_FILE = path.resolve('docs/public/assets/data/feed.xml')

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })

const SITE_URL = 'https://flyigit94.github.io/Ai-news-radar'
const FEED_TITLE = '每日简报'
const FEED_DESC = 'AI 新闻雷达，每日精选科技/财经/时政/艺术重要资讯'
const MAX_ITEMS = 30

function escapeXml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function extractTitle(md, date) {
  const h1Match = md.match(/^#\s+(.+)/m)
  if (h1Match) return h1Match[1]
  const titleMatch = md.match(/^title:\s*"(.+?)"/m)
  if (titleMatch) return titleMatch[1]
  return `每日简报 ${date}`
}

const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.md'))

if (files.length === 0) {
  console.log('⚠️ public/data/raw/ 目录下没有 .md 文件')
  process.exit(0)
}

const sortedFiles = files.sort((a, b) => (a < b ? 1 : -1)).slice(0, MAX_ITEMS)

const items = []
for (const file of sortedFiles) {
  const date = file.replace('.md', '')
  const md = fs.readFileSync(path.join(RAW_DIR, file), 'utf-8')
  const title = extractTitle(md, date)
  const html = marked.parse(md)
  const link = `${SITE_URL}/?date=${date}`
  const updated = `${date}T00:00:00Z`
  items.push({ title, link, html, updated, date })
}

const now = new Date().toISOString()
const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(FEED_TITLE)}</title>
  <subtitle>${escapeXml(FEED_DESC)}</subtitle>
  <link href="${SITE_URL}/"/>
  <link href="${SITE_URL}/assets/data/feed.xml" rel="self"/>
  <updated>${now}</updated>
  <id>${SITE_URL}/</id>
${items.map(item => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${escapeXml(item.link)}"/>
    <updated>${item.updated}</updated>
    <id>${escapeXml(item.link)}</id>
    <content type="html"><![CDATA[${item.html}]]></content>
  </entry>`).join('\n')}
</feed>
`

fs.writeFileSync(OUT_FILE, atom, 'utf-8')
console.log(`✅ feed.xml 生成成功，包含 ${items.length} 条简报`)
