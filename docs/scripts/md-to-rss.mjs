import fs from 'fs'
import path from 'path'

const RAW_DIR = path.resolve('docs/public/data/raw')
const OUT_FILE = path.resolve('docs/public/assets/data/feed.xml')

// 确保输出目录存在
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })

// ⚠️ 修改成你自己的站点信息
const SITE_URL = 'https://flyigit94.github.io/Ai-news-radar'
const FEED_TITLE = '每日简报'
const FEED_DESC = 'AI 新闻雷达，每日精选科技/财经/时政/艺术重要资讯'
const MAX_ITEMS = 30  // 最多保留多少天的简报

// XML 转义
function escapeXml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 从 md 里提取纯文本摘要（去掉 markdown 语法）
function extractSummary(md) {
  const lines = md.split('\n')
  const bodyLines = []
  let inFrontMatter = false
  let frontMatterCount = 0

  for (const line of lines) {
    if (line.trim() === '---') {
      frontMatterCount++
      if (frontMatterCount <= 2) {
        inFrontMatter = frontMatterCount === 1
        continue
      }
    }
    if (inFrontMatter) continue
    bodyLines.push(line)
  }

  // 找第一个普通段落（跳过标题、引用、列表、加粗、编号）
  for (const line of bodyLines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('>')) continue
    if (trimmed.startsWith('---')) continue
    if (trimmed.startsWith('<')) continue
    if (trimmed.startsWith('**')) continue       // ← 跳过加粗（如 **科技新闻**）
    if (/^\d+\.\s/.test(trimmed)) continue        // ← 跳过编号列表
    if (trimmed.startsWith('- ')) continue        // ← 跳过无序列表
    return trimmed.slice(0, 300)
  }
  return ''
}

// 从 md 里提取标题（用作 RSS item 标题）
function extractTitle(md, date) {
  // front matter 里的 title
  const titleMatch = md.match(/^title:\s*"(.+?)"/m)
  if (titleMatch) return titleMatch[1]
  // 或者正文里的第一个 H1
  const h1Match = md.match(/^#\s+(.+)/m)
  if (h1Match) return h1Match[1]
  // 兜底
  return `每日简报 ${date}`
}

// 主流程
const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.md'))

if (files.length === 0) {
  console.log('⚠️ public/data/raw/ 目录下没有 .md 文件')
  process.exit(0)
}

// 按日期从新到旧排序
const sortedFiles = files.sort((a, b) => (a < b ? 1 : -1)).slice(0, MAX_ITEMS)

const items = []
for (const file of sortedFiles) {
  const date = file.replace('.md', '')
  const md = fs.readFileSync(path.join(RAW_DIR, file), 'utf-8')
  const title = extractTitle(md, date)
  const summary = extractSummary(md)

  // 链接指向你自己站点的日期页面（现在的跳转逻辑）
  const link = `${SITE_URL}/`

  // RFC 822 时间格式（RSS 要求）
  const pubDate = new Date(`${date}T08:00:00Z`).toUTCString()

  items.push({ title, link, description: summary, pubDate, date })
}

// 生成 RSS 2.0 XML
const now = new Date().toUTCString()
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/assets/data/feed.xml" rel="self" type="application/rss+xml" />
${items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false">${escapeXml(item.date)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`

fs.writeFileSync(OUT_FILE, rss, 'utf-8')
console.log(`✅ feed.xml 生成成功，包含 ${items.length} 条简报`)
