<template>
  <div class="min-h-screen bg-dark text-gray-200">
    
    <!-- 顶部吸顶导航 -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-dark/80 border-b border-white/10">
      <!-- 第一层：日期与归档 -->
      <div class="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <h1 class="text-lg font-bold text-white">每日简报</h1>
        <div class="flex items-center gap-4 text-sm">
          <span class="text-gray-400">{{ currentDate }}</span>
          <button @click="showArchive = !showArchive" class="text-blue-400 hover:text-blue-300">
            历史归档
          </button>
        </div>
      </div>

      <!-- 第二层：主标签（吸顶核心） -->
      <nav class="flex gap-6 px-6 pt-3 text-sm overflow-x-auto whitespace-nowrap">
        <button 
          v-for="tab in mainTabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="['pb-2 transition-colors', activeTab === tab.id ? 'text-white font-bold border-b-2 border-white' : 'text-gray-400 hover:text-white']"
        >
          {{ tab.name }} <span class="text-xs text-gray-500 ml-1">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- 第三层：子标签（吸顶核心） -->
      <div class="sticky top-[100px] z-40 bg-dark/80 backdrop-blur-md px-6 py-2 flex gap-3 overflow-x-auto whitespace-nowrap">
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
          <span v-if="item.todayStars" class="text-green-400">{{ item.todayStars }} stars today</span>
        </div>
        <p class="text-gray-400 text-sm mt-3 leading-relaxed">{{ item.description }}</p>
        
        <div v-if="item.chineseIntro" class="mt-4 bg-white/5 border-l-2 border-blue-500 rounded-r-lg p-3 text-sm text-gray-300">
          <span class="font-bold text-white mr-1">中文介绍</span>
          {{ item.chineseIntro }}
        </div>
      </article>
    </main>

    <!-- 归档列表（图2样式） -->
    <div v-if="showArchive" class="fixed inset-0 z-[60] bg-dark/95 backdrop-blur-lg overflow-y-auto">
      <div class="max-w-3xl mx-auto py-10 px-6">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-white">daily-brief — archive</h1>
          <button @click="showArchive = false" class="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>
        <p class="text-gray-500 text-sm mb-6">105 reports · newest first · generated {{ currentDate }}</p>
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
import { ref, computed } from 'vue'

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

const subTabs = [
  { id: 'github', name: 'GitHub Trending', count: 16 },
  { id: 'papers', name: '热门论文', count: 20 },
  { id: 'twitter', name: 'X 推文', count: 14 },
  { id: 'media', name: 'AI 媒体', count: 15 },
]

// 模拟数据（之后替换为真实 fetch）
const allItems = ref([
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
])

const filteredItems = computed(() => {
  return allItems.value.filter(item => item.category === activeTab.value && item.subCategory === activeSubTab.value)
})

// 生成归档日期列表
const archiveDates = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  return d.toISOString().split('T')[0]
})
</script>
