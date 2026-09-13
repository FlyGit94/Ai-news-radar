<template>
  <div class="min-h-screen bg-dark text-gray-200">

    <!-- 顶部吸顶导航 -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-dark/80 border-b border-white/10">

      <!-- 第一层：日期 + 历史归档（滑动时收起） -->
      <div
        class="max-w-4xl mx-auto text-center overflow-hidden transition-all duration-300"
        :class="scrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-40 opacity-100 pt-8 pb-4'"
      >
        <h1 class="text-5xl font-bold text-white tracking-tight">{{ currentDate }}</h1>
        <div class="mt-5 flex justify-center">
          <button @click="showArchive = true" class="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            ← 历史归档
          </button>
        </div>
      </div>

      <!-- 第二层：主标签（小屏左对齐，大屏居中） -->
      <nav class="max-w-4xl mx-auto flex gap-2 px-4 md:px-6 pb-2 text-base justify-start md:justify-center overflow-x-auto whitespace-nowrap">
        <button
          v-for="tab in mainTabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="['px-4 pb-2 transition-colors border-b-2', activeTab === tab.id ? 'text-white font-bold border-white' : 'text-gray-400 hover:text-white border-transparent']"
        >
          {{ tab.name }} <span class="text-sm text-gray-500 ml-1">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- 第三层：子标签（小屏左对齐，大屏居中） -->
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

        <!-- 来源行 -->
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
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-white">daily-brief — archive</h1>
          <button
            @click="showArchive = false"
            class="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
          >
            ← 返回
          </button>
        </div>
        <p class="text-gray-500 text-base mb-6">30 reports · newest first · generated {{ currentDate }}</p>
        <a href="#" class="block bg-white/5 rounded-lg p-4 mb-8 text-base text-blue-400 hover:bg-white/10 transition-colors">
          → Latest report ({{ currentDate }})
        </a>
        <ul class="divide-y divide-white/10">
          <li v-for="date in archiveDates" :key="date" class="flex justify-between py-3">
            <a href="#" class="text-gray-300 hover:text-white transition-colors text-base">{{ date }}</a>
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
  scrolled.value = window.scrollY > 40
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
  // ... 保持和你现在一模一样，不需要改动 ...
])

const filteredItems = computed(() => {
  return allItems.value.filter(item =>
    item.category === activeTab.value && item.subCategory === activeSubTab.value
  )
})

const archiveDates = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  return d.toISOString().split('T')[0]
})
</script>
