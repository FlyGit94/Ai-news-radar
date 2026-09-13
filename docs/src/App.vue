<template>
  <div class="min-h-screen bg-dark text-gray-200">

    <!-- 顶部吸顶导航 -->
    <header class="sticky top-0 z-50 border-b border-white/10 bg-dark md:backdrop-blur-md md:bg-dark/80">
      <!-- 第一层：日期 + 历史归档（滑动时收起，仅手机端） -->
      <div
        class="max-w-4xl mx-auto text-center overflow-hidden transition-all duration-300 ease-out"
        :class="scrolled
          ? '-translate-y-full opacity-0 pointer-events-none h-0'
          : 'translate-y-0 opacity-100 h-32 pt-8 pb-4'"
      >
        <h1 class="text-5xl font-bold text-white tracking-tight">{{ currentDate }}</h1>
        <div class="mt-5 flex justify-center">
          <button @click="showArchive = true" class="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            ← 历史归档
          </button>
        </div>
      </div>

      <!-- 第二层：主标签（手机端左对齐，电脑端居中） -->
      <nav class="max-w-4xl mx-auto flex gap-2 px-4 md:px-6 pb-2 text-base justify-start md:justify-center overflow-x-auto whitespace-nowrap">
        <button
          v-for="tab in mainTabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="['px-4 pb-2 transition-colors border-b-2', activeTab === tab.id ? 'text-white font-bold border-white' : 'text-gray-400 hover:text-white border-transparent']"
        >
          {{ tab.name }} <span class="text-sm text-gray-500 ml-1">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- 第三层：子标签（手机端左对齐，电脑端居中） -->
      <div class="max-w-4xl mx-auto px-4 md:px-6 py-2 flex gap-3 justify-start md:justify-center overflow-x-auto whitespace-nowrap">
        <button
          v-for="sub in subTabs" :key="sub.id"
          @click="activeSubTab = sub.id"
          :class="['px-3 py-1 rounded-full text-sm transition-colors', activeSubTab === sub.id ? 'bg-white text-black font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10']"
        >
          {{ sub.name }} <span class="ml-1 opacity-70">{{ sub.count }}</span>
        </button>
      </div>
    </header>

    <!-- 主体内容：卡片流 -->
    <main class="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <article
        v-for="item in filteredItems" :key="item.id"
        class="border-b-2 border-white/20 py-8 last:border-0"
      >
        <!-- 标题 + 评分 -->
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-orange-400 hover:text-orange-300 cursor-pointer transition-colors leading-snug">
            {{ item.title }}
          </h2>
          <span
            v-if="item.score"
            class="inline-flex items-center bg-orange-500/20 text-orange-300 text-sm font-bold px-2 py-0.5 rounded translate-y-0.5"
          >
            {{ item.score }}
          </span>
        </div>

        <!-- 摘要 -->
        <p class="text-gray-200 text-base mt-3 leading-relaxed">{{ item.description }}</p>

        <!-- 来源行：橙色竖条下移一点 -->
        <div class="flex items-center gap-2 text-sm text-gray-500 mt-3">
          <span class="w-0.5 h-6 bg-orange-500 rounded-full translate-y-0.5"></span>
          <span>{{ item.source }}</span>
          <span class="text-gray-700">·</span>
          <span>{{ item.author }}</span>
          <span class="text-gray-700">·</span>
          <span>{{ item.time }}</span>
        </div>

        <!-- 分段：背景 / 影响 / 社区讨论 -->
        <div class="mt-4 space-y-3 text-base text-gray-200">
          <p v-if="item.background">
            <span class="text-gray-400 mr-1">「背景」</span>{{ item.background }}
          </p>
          <p v-if="item.impact">
            <span class="text-gray-400 mr-1">「影响」</span>{{ item.impact }}
          </p>
          <p v-if="item.community">
            <span class="text-gray-400 mr-1">「社区讨论」</span>{{ item.community }}
          </p>
        </div>

        <!-- 参考链接（去掉底色，字号小一号） -->
        <div v-if="item.references" class="mt-4">
          <a :href="'https://' + item.references" target="_blank" :title="item.references"
             class="block border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-colors">
            参考链接
          </a>
        </div>

        <!-- 标签 -->
        <div v-if="item.tags && item.tags.length" class="mt-2 flex items-center flex-wrap gap-2">
          <span class="text-sm text-gray-400">标签：</span>
          <span
            v-for="tag in item.tags" :key="tag"
            class="bg-white/5 border border-white/10 text-orange-300/80 text-sm px-3 py-1 rounded-md"
          >
            #{{ tag }}
          </span>
        </div>
      </article>

      <div v-if="filteredItems.length === 0" class="text-center py-20 text-gray-600">
        暂无内容
      </div>
    </main>

    <!-- 归档列表 -->
    <div v-if="showArchive" class="fixed inset-0 z-[60] bg-dark/95 backdrop-blur-lg overflow-y-auto">
      <div class="max-w-3xl mx-auto py-10 px-6">
        <!-- 标题：每日简报 -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white">每日简报</h1>
        </div>

        <!-- reports 数量与日期联动 -->
        <p class="text-gray-500 text-base mb-6">{{ archiveDates.length }} reports · newest first · generated {{ currentDate }}</p>

        <!-- Latest report 跳回首页 -->
        <a href="./" class="block bg-white/5 rounded-lg p-4 mb-8 text-base text-blue-400 hover:bg-white/10 transition-colors">
          → Latest report ({{ currentDate }})
        </a>

        <!-- 日期列表：可点击，跳回首页 -->
        <ul class="divide-y divide-white/10">
          <li v-for="date in archiveDates" :key="date" class="flex justify-between py-3">
            <a href="./" class="text-gray-300 hover:text-white transition-colors text-base">{{ date }}</a>
            <span class="text-gray-600 text-sm">{{ Math.floor(Math.random() * 50 + 100) }} KB</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const currentDate = '2026-09-12'
const showArchive = ref(false)
const activeTab = ref('tech')
const activeSubTab = ref('github')
const scrolled = ref(false)

const handleScroll = () => {
  // 只在手机端（<768px）收起日期层，电脑端不影响
  scrolled.value = window.innerWidth < 768 && window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const mainTabs = [
  { id: 'tech', name: '技术动态', count: 65 },
  { id: 'market', name: '市场行情', count: 21 },
  { id: 'politics', name: '时政观察', count: 15 },
  { id: 'finance', name: '财经要点', count: 12 },
  { id: 'community', name: '社区讨论', count: 10 },
]

const subTabsMap = {
  tech: [
    { id: 'github', name: 'GitHub Trending', count: 16 },
    { id: 'papers', name: '热门论文', count: 20 },
    { id: 'twitter', name: 'X 推文', count: 14 },
    { id: 'media', name: 'AI 媒体', count: 15 },
  ],
  market: [
    { id: 'stocks', name: '股市快报', count: 8 },
    { id: 'crypto', name: '加密货币', count: 5 },
  ],
  politics: [
    { id: 'china', name: '国内时政', count: 6 },
    { id: 'world', name: '国际时政', count: 4 },
  ],
  finance: [
    { id: 'macro', name: '宏观经济', count: 5 },
    { id: 'company', name: '公司财报', count: 4 },
  ],
  community: [
    { id: 'v2ex', name: 'V2EX', count: 6 },
    { id: 'linuxdo', name: 'LinuxDo', count: 4 },
  ],
}

const subTabs = computed(() => subTabsMap[activeTab.value] || [])

watch(activeTab, () => {
  const tabs = subTabsMap[activeTab.value]
  if (tabs && tabs.length > 0) {
    activeSubTab.value = tabs[0].id
  }
})

const allItems = ref([
  {
    id: 1,
    title: 'ayghri/i-have-adhd',
    score: 8.5,
    source: 'github',
    author: 'ayghri',
    time: '9月6日 07:21',
    description: 'A skill to stop your coding agent from burying the answer. ADHD-friendly output.',
    references: 'github.com/ayghri/i-have-adhd',
    background: '这是一个专门为 AI 编码助手设计的提示词技能，强制模型先给出结论。',
    impact: '适合注意力容易分散、只想快速拿到结果的开发者，可接入常见 coding agent 使用。',
    community: '社区反馈积极，许多人表示这个思路能显著减少 AI 输出中的冗余推理。',
    tags: ['ai', 'coding-agent', 'prompt'],
    category: 'tech',
    subCategory: 'github'
  },
  {
    id: 2,
    title: 'bilawalsidhu/gods-eye-view',
    score: 8.0,
    source: 'github',
    author: 'bilawalsidhu',
    time: '9月6日 07:21',
    description: 'A spy satellite simulator in your browser, except the data is real.',
    references: 'github.com/bilawalsidhu/gods-eye-view',
    background: '浏览器里的间谍卫星模拟器，基于真实开放数据构建。',
    impact: '面向开源情报（OSINT）、地理信息与遥感方向的从业者与爱好者。',
    community: '社区认为这是 OSINT 领域近期最直观的可视化工具之一。',
    tags: ['osint', 'geospatial', '3d'],
    category: 'tech',
    subCategory: 'github'
  },
  {
    id: 3,
    title: 'Attention Is All You Need (Revisited)',
    score: 9.0,
    source: 'arxiv',
    author: 'Vaswani et al.',
    time: '9月5日 22:10',
    description: 'A foundational paper on Transformer architecture, now with new benchmarks.',
    references: 'arxiv.org/abs/1706.03762',
    background: 'Transformer 架构的奠基论文，近期被重新复现并补充了新的基准测试。',
    impact: '是理解现代大模型（GPT、LLaMA 等）的必读文献。',
    community: '社区讨论集中在复现细节和新增 benchmark 的公平性上。',
    tags: ['transformer', 'nlp', 'paper'],
    category: 'tech',
    subCategory: 'papers'
  },
  {
    id: 4,
    title: 'Karpathy: "The best way to learn AI is to build."',
    score: 8.2,
    source: 'x',
    author: 'karpathy',
    time: '9月6日 02:30',
    description: 'A thread on practical AI learning strategies from Andrej Karpathy.',
    references: 'x.com/karpathy/status/...',
    background: 'Karpathy 发布了一条关于 AI 学习路径的长推文。',
    impact: '强调“动手做”比“看论文”更重要，推荐从复现小项目开始。',
    community: '推文下大量开发者分享了自己的学习路线与踩坑经验。',
    tags: ['ai', 'learning', 'karpathy'],
    category: 'tech',
    subCategory: 'twitter'
  },
  {
    id: 5,
    title: '量子位：大模型推理成本一年下降 90%',
    score: 7.8,
    source: '量子位',
    author: '量子位',
    time: '9月6日 09:00',
    description: 'Industry report on the rapid decline of LLM inference costs.',
    references: 'mp.weixin.qq.com/s/...',
    background: '量子位发布行业报告，梳理过去一年大模型推理成本的变化。',
    impact: '中小团队部署大模型的门槛大幅降低，应用层创新加速。',
    community: '读者普遍认为成本下降会推动更多垂直场景落地。',
    tags: ['llm', 'inference', 'cost'],
    category: 'tech',
    subCategory: 'media'
  },
  {
    id: 6,
    title: 'A股三大指数集体收涨，创业板指涨超 2%',
    score: 7.5,
    source: '财联社',
    author: '财联社',
    time: '9月6日 15:00',
    description: 'ChiNext index rose over 2% as tech stocks rallied.',
    references: 'cls.cn/...',
    background: '今日 A 股三大指数集体收涨，科技股表现强势。',
    impact: '市场情绪回暖，资金回流成长板块。',
    community: '投资者讨论集中在能否持续反弹。',
    tags: ['a股', '创业板'],
    category: 'market',
    subCategory: 'stocks'
  },
  {
    id: 7,
    title: 'Bitcoin 突破 70,000 美元，ETF 资金持续流入',
    score: 8.0,
    source: 'CoinDesk',
    author: 'CoinDesk',
    time: '9月6日 12:00',
    description: 'Bitcoin broke through $70k as ETF inflows continue.',
    references: 'coindesk.com/...',
    background: '比特币突破 7 万美元关口，现货 ETF 资金持续净流入。',
    impact: '机构资金入场推动加密市场整体走强。',
    community: '交易员对后续走势分歧较大。',
    tags: ['bitcoin', 'etf'],
    category: 'market',
    subCategory: 'crypto'
  },
  {
    id: 8,
    title: '国务院发布新一轮经济刺激政策',
    score: 8.0,
    source: '新华社',
    author: '新华社',
    time: '9月6日 18:00',
    description: 'State Council announces new round of economic stimulus.',
    references: 'news.cn/...',
    background: '国务院今日发布新一轮经济刺激政策。',
    impact: '重点支持消费和科技创新，市场预期改善。',
    community: '经济学家普遍认为政策力度超预期。',
    tags: ['经济', '政策'],
    category: 'politics',
    subCategory: 'china'
  },
  {
    id: 9,
    title: '联合国气候大会达成关键协议',
    score: 7.5,
    source: 'BBC',
    author: 'BBC',
    time: '9月6日 20:00',
    description: 'UN climate summit reaches key agreement on emissions.',
    references: 'bbc.com/...',
    background: '联合国气候大会就碳排放目标达成关键协议。',
    impact: '多国承诺加速能源转型。',
    community: '环保组织认为协议力度仍不够。',
    tags: ['climate', 'un'],
    category: 'politics',
    subCategory: 'world'
  },
  {
    id: 10,
    title: '央行维持 LPR 不变，市场预期稳定',
    score: 7.0,
    source: '央行',
    author: '央行',
    time: '9月6日 09:30',
    description: 'PBOC keeps LPR unchanged, market expectations stable.',
    references: 'pbc.gov.cn/...',
    background: '央行今日公布最新 LPR 报价，维持不变。',
    impact: '符合市场预期，利率环境保持稳定。',
    community: '分析师认为短期内降息概率不高。',
    tags: ['lpr', '利率'],
    category: 'finance',
    subCategory: 'macro'
  },
  {
    id: 11,
    title: '英伟达 Q3 财报超预期，营收同比增长 94%',
    score: 8.8,
    source: 'NVIDIA',
    author: 'NVIDIA',
    time: '9月6日 06:00',
    description: 'NVIDIA Q3 earnings beat expectations, revenue up 94% YoY.',
    references: 'nvidia.com/...',
    background: '英伟达发布 Q3 财报，营收同比增长 94%。',
    impact: '数据中心业务继续强劲增长，AI 需求未见放缓。',
    community: '投资者关注下一季度指引是否仍能超预期。',
    tags: ['nvidia', 'earnings'],
    category: 'finance',
    subCategory: 'company'
  },
  {
    id: 12,
    title: '搞了个 dsh 的 rust 壳小工具，v 友试试水么？',
    score: 7.2,
    source: 'v2ex',
    author: 'v2ex',
    time: '9月6日 10:00',
    description: 'A Rust-based shell tool shared on V2EX.',
    references: 'v2ex.com/t/...',
    background: 'V2EX 网友分享了一个用 Rust 写的 dsh 壳小工具。',
    impact: '适合喜欢折腾终端工具的开发者。',
    community: '回复中有人建议加入更多 shell 兼容性。',
    tags: ['rust', 'shell'],
    category: 'community',
    subCategory: 'v2ex'
  },
  {
    id: 13,
    title: 'LinuxDo 社区年度总结：最受欢迎的开源项目',
    score: 7.5,
    source: 'linuxdo',
    author: 'linuxdo',
    time: '9月6日 14:00',
    description: 'Annual summary of most popular open source projects on LinuxDo.',
    references: 'linux.do/t/...',
    background: 'LinuxDo 社区发布年度总结，盘点最受欢迎的开源项目。',
    impact: '为开发者提供了新一年的学习与选型参考。',
    community: '社区成员对榜单排名有不同看法。',
    tags: ['opensource', 'linux'],
    category: 'community',
    subCategory: 'linuxdo'
  },
])

const filteredItems = computed(() => {
  return allItems.value.filter(item =>
    item.category === activeTab.value && item.subCategory === activeSubTab.value
  )
})

// 归档日期：从 2026-09-12 开始，一直生成到今天（今天在最上面）
const archiveDates = (() => {
  const start = new Date('2026-09-12')
  const today = new Date()
  const dates = []
  for (let d = new Date(today); d >= start; d.setDate(d.getDate() - 1)) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    dates.push(`${yyyy}-${mm}-${dd}`)
  }
  return dates
})()
</script>
