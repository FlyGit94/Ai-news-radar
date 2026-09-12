<template>
  <div class="min-h-screen bg-dark text-gray-200">
    
    <!-- 顶部吸顶导航 -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-dark/80 border-b border-white/10">
      <!-- 第一层：日期居中，最大字号 -->
      <div class="max-w-4xl mx-auto px-6 py-4 text-center">
        <h1 class="text-3xl font-bold text-white">{{ currentDate }}</h1>
        <div class="flex items-center justify-center gap-3 mt-1 text-xs text-gray-500">
          <span>每日简报</span>
          <span class="text-gray-700">·</span>
          <button @click="showArchive = true" class="text-blue-400 hover:text-blue-300 transition-colors">
            历史归档
          </button>
        </div>
      </div>

      <!-- 第二层：主标签居中 -->
      <nav class="max-w-4xl mx-auto flex gap-6 px-6 pb-2 text-sm justify-center overflow-x-auto whitespace-nowrap">
        <button 
          v-for="tab in mainTabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="['pb-2 transition-colors', activeTab === tab.id ? 'text-white font-bold border-b-2 border-white' : 'text-gray-400 hover:text-white']"
        >
          {{ tab.name }} <span class="text-xs text-gray-500 ml-1">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- 第三层：子标签居中 -->
      <div class="max-w-4xl mx-auto sticky top-[130px] z-40 bg-dark/80 backdrop-blur-md px-6 py-2 flex gap-3 justify-center overflow-x-auto whitespace-nowrap">
        <button 
          v-for="sub in subTabs" :key="sub.id"
          @click="activeSubTab = sub.id"
          :class="['px-3 py-1 rounded-full text-xs transition-colors', activeSubTab === sub.id ? 'bg-white text-black font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10']"
        >
          {{ sub.name }} <span class="ml-1 opacity-70">{{ sub.count }}</span>
        </button>
      </div>
    </header>

    <!-- 主体内容：卡片流 -->
    <main class="max-w-4xl mx-auto px-6 py-8">
      <article 
        v-for="item in filteredItems" :key="item.id"
        class="border-b border-white/5 py-6 last:border-0"
      >
        <h2 class="text-xl font-bold text-white hover:text-blue-400 cursor-pointer transition-colors">
          {{ item.title }}
        </h2>
        <div class="flex items-center gap-3 text-xs text-gray-500 mt-2">
          <span>{{ item.language }}</span>
          <span>★ {{ item.stars }}</span>
          <span v-if="item.todayStars" class="text-green-400">{{ item.todayStars }}</span>
        </div>
        <p class="text-gray-400 text-sm mt-3 leading-relaxed">{{ item.description }}</p>
        
        <div v-if="item.chineseIntro" class="mt-4 bg-white/5 border-l-2 border-blue-500 rounded-r-lg p-3 text-sm text-gray-300">
          <span class="font-bold text-white mr-1">中文介绍</span>
          {{ item.chineseIntro }}
        </div>
      </article>

      <!-- 无内容时的提示 -->
      <div v-if="filteredItems.length === 0" class="text-center py-20 text-gray-600">
        暂无内容
      </div>
    </main>

    <!-- 归档列表 -->
    <div v-if="showArchive" class="fixed inset-0 z-[60] bg-dark/95 backdrop-blur-lg overflow-y-auto">
      <div class="max-w-3xl mx-auto py-10 px-6">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-white">daily-brief — archive</h1>
          <button 
            @click="showArchive = false" 
            class="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
          >
            ← 返回
          </button>
        </div>
        <p class="text-gray-500 text-sm mb-6">30 reports · newest first · generated {{ currentDate }}</p>
        <a href="#" class="block bg-white/5 rounded-lg p-4 mb-8 text-blue-400 hover:bg-white/10 transition-colors">
          → Latest report ({{ currentDate }})
        </a>
        <ul class="divide-y divide-white/5">
          <li v-for="date in archiveDates" :key="date" class="flex justify-between py-3">
            <a href="#" class="text-gray-300 hover:text-white transition-colors">{{ date }}</a>
            <span class="text-gray-600 text-sm">{{ Math.floor(Math.random() * 50 + 100) }} KB</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const currentDate = '2026-09-12'
const showArchive = ref(false)
const activeTab = ref('tech')
const activeSubTab = ref('github')

const mainTabs = [
  { id: 'tech', name: '技术动态', count: 65 },
  { id: 'market', name: '市场行情', count: 21 },
  { id: 'politics', name: '时政观察', count: 15 },
  { id: 'finance', name: '财经要点', count: 12 },
  { id: 'community', name: '社区讨论', count: 10 },
]

// 子标签按主标签分组
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

// 当前显示的子标签，根据 activeTab 动态计算
const subTabs = computed(() => subTabsMap[activeTab.value] || [])

// 切换主标签时，自动把子标签重置到第一个
watch(activeTab, () => {
  const tabs = subTabsMap[activeTab.value]
  if (tabs && tabs.length > 0) {
    activeSubTab.value = tabs[0].id
  }
})

// 模拟数据（之后替换为真实 fetch）
const allItems = ref([
  // ===== 技术动态 =====
  {
    id: 1,
    title: 'ayghri/i-have-adhd',
    language: 'Python',
    stars: '41,882',
    todayStars: '3,463 stars today',
    description: 'A skill to stop your coding agent from burying the answer. ADHD-friendly output.',
    chineseIntro: '为 AI 编码助手准备的技能，强制模型先给出结论，而不是把答案埋在冗长的推理过程里。',
    category: 'tech',
    subCategory: 'github'
  },
  {
    id: 2,
    title: 'bilawalsidhu/gods-eye-view',
    language: 'JavaScript',
    stars: '27,155',
    todayStars: '3,680 stars today',
    description: 'A spy satellite simulator in your browser, except the data is real.',
    chineseIntro: '浏览器里的间谍卫星模拟器：基于真实开放数据，在逼真 3D 地球上做实时空间情报分析。',
    category: 'tech',
    subCategory: 'github'
  },
  {
    id: 3,
    title: 'Attention Is All You Need (Revisited)',
    language: 'arXiv',
    stars: '12,000',
    todayStars: 'Top 1 today',
    description: 'A foundational paper on Transformer architecture, now with new benchmarks.',
    chineseIntro: 'Transformer 架构奠基论文的最新复现与评测，是理解现代大模型的必读文献。',
    category: 'tech',
    subCategory: 'papers'
  },
  {
    id: 4,
    title: 'Scaling Laws for Neural Language Models',
    language: 'arXiv',
    stars: '8,500',
    todayStars: 'Top 3 today',
    description: 'Empirical study on how model performance scales with size, data, and compute.',
    chineseIntro: '关于模型性能随规模、数据、算力变化规律的经典实证研究。',
    category: 'tech',
    subCategory: 'papers'
  },
  {
    id: 5,
    title: 'Karpathy: "The best way to learn AI is to build."',
    language: 'X',
    stars: '5,200',
    todayStars: '3,400 likes',
    description: 'A thread on practical AI learning strategies from Andrej Karpathy.',
    chineseIntro: 'Karpathy 关于 AI 学习路径的推文串：强调“动手做”比“看论文”更重要。',
    category: 'tech',
    subCategory: 'twitter'
  },
  {
    id: 6,
    title: '量子位：大模型推理成本一年下降 90%',
    language: '微信',
    stars: 'N/A',
    todayStars: '今日头条',
    description: 'Industry report on the rapid decline of LLM inference costs.',
    chineseIntro: '量子位报道：过去一年大模型推理成本下降 90%，中小团队部署门槛大幅降低。',
    category: 'tech',
    subCategory: 'media'
  },

  // ===== 市场行情 =====
  {
    id: 7,
    title: 'A股三大指数集体收涨，创业板指涨超 2%',
    language: '股市',
    stars: 'N/A',
    todayStars: '今日收盘',
    description: 'ChiNext index rose over 2% as tech stocks rallied.',
    chineseIntro: '今日 A 股三大指数集体收涨，创业板指领涨，科技股表现强势。',
    category: 'market',
    subCategory: 'stocks'
  },
  {
    id: 8,
    title: 'Bitcoin 突破 70,000 美元，ETF 资金持续流入',
    language: '加密货币',
    stars: 'N/A',
    todayStars: '24h +5%',
    description: 'Bitcoin broke through $70k as ETF inflows continue.',
    chineseIntro: '比特币突破 7 万美元关口，现货 ETF 资金持续净流入推动上涨。',
    category: 'market',
    subCategory: 'crypto'
  },

  // ===== 时政观察 =====
  {
    id: 9,
    title: '国务院发布新一轮经济刺激政策',
    language: '国内',
    stars: 'N/A',
    todayStars: '今日发布',
    description: 'State Council announces new round of economic stimulus.',
    chineseIntro: '国务院今日发布新一轮经济刺激政策，重点支持消费和科技创新。',
    category: 'politics',
    subCategory: 'china'
  },
  {
    id: 10,
    title: '联合国气候大会达成关键协议',
    language: '国际',
    stars: 'N/A',
    todayStars: '今日达成',
    description: 'UN climate summit reaches key agreement on emissions.',
    chineseIntro: '联合国气候大会就碳排放目标达成关键协议，多国承诺加速能源转型。',
    category: 'politics',
    subCategory: 'world'
  },

  // ===== 财经要点 =====
  {
    id: 11,
    title: '央行维持 LPR 不变，市场预期稳定',
    language: '宏观',
    stars: 'N/A',
    todayStars: '今日公布',
    description: 'PBOC keeps LPR unchanged, market expectations stable.',
    chineseIntro: '央行今日公布最新 LPR 报价，维持不变，符合市场预期。',
    category: 'finance',
    subCategory: 'macro'
  },
  {
    id: 12,
    title: '英伟达 Q3 财报超预期，营收同比增长 94%',
    language: '公司',
    stars: 'N/A',
    todayStars: '盘后 +3%',
    description: 'NVIDIA Q3 earnings beat expectations, revenue up 94% YoY.',
    chineseIntro: '英伟达发布 Q3 财报，营收同比增长 94%，数据中心业务继续强劲增长。',
    category: 'finance',
    subCategory: 'company'
  },

  // ===== 社区讨论 =====
  {
    id: 13,
    title: '搞了个 dsh 的 rust 壳小工具，v 友试试水么？',
    language: 'V2EX',
    stars: 'N/A',
    todayStars: '3 回复',
    description: 'A Rust-based shell tool shared on V2EX.',
    chineseIntro: 'V2EX 网友分享了一个用 Rust 写的 dsh 壳小工具，欢迎试用。',
    category: 'community',
    subCategory: 'v2ex'
  },
  {
    id: 14,
    title: 'Google Search Impact 效果终于起来了',
    language: 'V2EX',
    stars: 'N/A',
    todayStars: '3 回复',
    description: 'Discussion on Google Search Impact results.',
    chineseIntro: 'V2EX 讨论：Google Search Impact 的效果终于开始显现。',
    category: 'community',
    subCategory: 'v2ex'
  },
  {
    id: 15,
    title: 'LinuxDo 社区年度总结：最受欢迎的开源项目',
    language: 'LinuxDo',
    stars: 'N/A',
    todayStars: '4 回复',
    description: 'Annual summary of most popular open source projects on LinuxDo.',
    chineseIntro: 'LinuxDo 社区发布年度总结，盘点最受欢迎的开源项目。',
    category: 'community',
    subCategory: 'linuxdo'
  },
])

const filteredItems = computed(() => {
  return allItems.value.filter(item => 
    item.category === activeTab.value && item.subCategory === activeSubTab.value
  )
})

// 生成归档日期列表
const archiveDates = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  return d.toISOString().split('T')[0]
})
</script>
