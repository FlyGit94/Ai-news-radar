import fs from 'fs'
import path from 'path'

const RAW_DIR = path.resolve('public/data/raw')
const OUT_DIR = path.resolve('public/data')

// 分类映射：md 里的中文分类 → 前端用的 category / subCategory
const categoryMap = {
  '科技新闻': { category: 'tech', subCategory: 'github' },
  '财经新闻': { category: 'finance', subCategory: 'stocks' },
  '时政观察': { category: 'politics', subCategory: 'china' },
}

function parseMarkdown(md) {
  const lines = md.split('\n')
  const items = []
  let current = null
  let currentCategoryRaw = ''

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // 一级标题 → 分类
    if (/^##\s+/.test(line)) {
      currentCategoryRaw = line.replace(/^##\s+/, '').trim()
      i++
      continue
    }

    // 卡片锚点
    const anchorMatch = line.match(/^<a id="(item-[^"]+)"><\/a>/)
    if (anchorMatch) {
      if (current) items.push(current)
      const mapped = categoryMap[currentCategoryRaw] || { category: 'tech', subCategory: 'github' }
      current = {
        id: anchorMatch[1],
        category: mapped.category,
        subCategory: mapped.subCategory,
        categoryRaw: currentCategoryRaw,
        title: '',
        references: '',
        score: null,
        description: '',
        source: '',
        author: '',
        time: '',
        discussion: '',
        background: '',
        impact: '',
        community: '',
        references_list: [],
        tags: []
      }
      i++
      continue
    }

    if (!current) { i++; continue }

    // 标题行：### [标题](链接) ⭐️ 8.0/10
    const titleMatch = line.match(/^###\s+\[(.+?)\]\((.+?)\)\s+⭐️\s+([\d.]+)\/10/)
    if (titleMatch) {
      current.title = titleMatch[1]
      current.references = titleMatch[2]
      current.score = parseFloat(titleMatch[3])
      i++
      continue
    }

    // 摘要：标题下方第一段普通文字
    if (!current.description && line.trim() && !line.startsWith('#') && !line.startsWith('<') && !line.startsWith('**') && !line.startsWith('hackernews') && !line.startsWith('rss') && !line.startsWith('telegram') && !line.startsWith('---')) {
      current.description = line.trim()
      i++
      continue
    }

    // 来源行：hackernews · zdw · 9月12日 07:54 · [社区讨论](...)
    const sourceMatch = line.match(/^(\w+)\s+·\s+(.+?)\s+·\s+(.+?)(?:\s+·\s+\[社区讨论\]\((.+?)\))?$/)
    if (sourceMatch && !current.source) {
      current.source = sourceMatch[1]
      current.author = sourceMatch[2]
      current.time = sourceMatch[3]
      current.discussion = sourceMatch[4] || ''
      i++
      continue
    }

    // 「背景」「影响」「社区讨论」
    const bgMatch = line.match(/^\*\*「背景」\*\*\s*(.+)/)
    if (bgMatch) { current.background = bgMatch[1].trim(); i++; continue }
    const impactMatch = line.match(/^\*\*「影响」\*\*\s*(.+)/)
    if (impactMatch) { current.impact = impactMatch[1].trim(); i++; continue }
    const commMatch = line.match(/^\*\*「社区讨论」\*\*\s*(.+)/)
    if (commMatch) { current.community = commMatch[1].trim(); i++; continue }

    // 标签行：**标签**: `#a`, `#b`
    const tagMatch = line.match(/^\*\*标签\*\*:\s*(.+)/)
    if (tagMatch) {
      current.tags = tagMatch[1]
        .split(',')
        .map(t => t.trim().replace(/^`#/, '').replace(/`$/, '').trim())
        .filter(Boolean)
      i++
      continue
    }

    // 参考链接：<li><a href="...">...</a></li>
    const refMatch = line.match(/<li><a href="(.+?)"/)
    if (refMatch) {
      current.references_list.push(refMatch[1])
      i++
      continue
    }

    i++
  }

  if (current) items.push(current)
  return items
}

// 遍历 raw 目录
const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.md'))

if (files.length === 0) {
  console.log('⚠️ public/data/raw/ 目录下没有 .md 文件')
  // 仍然生成一个空的 index.json
  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify([], null, 2), 'utf-8')
  process.exit(0)
}

// 收集所有日期（用于生成 index.json）
const availableDates = []

for (const file of files) {
  const date = file.replace('.md', '')
  const md = fs.readFileSync(path.join(RAW_DIR, file), 'utf-8')
  const items = parseMarkdown(md)
  fs.writeFileSync(
    path.join(OUT_DIR, `${date}.json`),
    JSON.stringify(items, null, 2),
    'utf-8'
  )
  availableDates.push(date)
  console.log(`✅ ${file} → ${date}.json（${items.length} 条）`)
}

// 按日期从新到旧排序
availableDates.sort((a, b) => (a < b ? 1 : -1))

// 输出 index.json
fs.writeFileSync(
  path.join(OUT_DIR, 'index.json'),
  JSON.stringify(availableDates, null, 2),
  'utf-8'
)
console.log(`📅 index.json → ${availableDates.length} 天（${availableDates.join(', ')}）`)
