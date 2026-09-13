<template>
  <div class="min-h-screen bg-white text-gray-800 dark:bg-dark dark:text-gray-200">

    <!-- 顶部吸顶导航 -->
    <header class="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-white md:backdrop-blur-md md:bg-white/80 dark:bg-dark md:dark:bg-dark/80">
      <!-- 第一层：日期 + 历史归档（滑动时收起，仅手机端） -->
      <div
        class="max-w-4xl mx-auto text-center overflow-hidden transition-all duration-300 ease-out"
        :class="scrolled
          ? '-translate-y-full opacity-0 pointer-events-none h-0'
          : 'translate-y-0 opacity-100 h-32 pt-8 pb-4'"
      >
        <h1 class="text-5xl font-bold text-black dark:text-white tracking-tight">{{ currentDate }}</h1>
        <div class="mt-5 flex justify-center">
          <button @click="showArchive = true" class="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
            ← 历史归档
          </button>
        </div>
      </div>

      <!-- 第二层：主标签（手机端左对齐，电脑端居中），最左侧是主题切换 -->
      <nav class="max-w-4xl mx-auto flex gap-2 px-4 md:px-6 pb-2 text-base justify-start md:justify-center overflow-x-auto whitespace-nowrap items-center">
        <!-- 主题切换按钮 -->
        <button
          @click="toggleTheme"
          class="mr-2 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
          :title="isDark ? '切换到亮色' : '切换到暗色'"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4" />
            <path stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </button>

        <!-- 主标签 -->
        <button
          v-for="tab in mainTabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="['px-4 pb-2 transition-colors border-b-2 shrink-0', activeTab === tab.id ? 'text-black dark:text-white font-bold border-black dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-transparent']"
        >
          {{ tab.name }} <span class="text-sm text-gray-500 ml-1">{{ tab.count }}</span>
        </button>
      </nav>
    </header>

    <!-- 主体内容：卡片流 -->
    <main class="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <article
        v-for="item in filteredItems" :key="item.id"
        class="border-b-2 border-black/20 dark:border-white/20 py-8 last:border-0"
      >
        <!-- 标题 + 评分 -->
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 cursor-pointer transition-colors leading-snug">
            {{ item.title }}
          </h2>
          <span
            v-if="item.score"
            class="inline-flex items-center bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300 text-sm font-bold px-2 py-0.5 rounded translate-y-0.5"
          >
            {{ item.score }}
          </span>
        </div>

        <!-- 摘要 -->
        <p class="text-gray-700 dark:text-gray-200 text-base mt-3 leading-relaxed">{{ item.description }}</p>

        <!-- 来源行 -->
        <div class="flex items-center gap-2 text-sm text-gray-500 mt-3">
          <span class="w-0.5 h-6 bg-orange-500 rounded-full translate-y-0.5"></span>
          <span>{{ item.source }}</span>
          <span class="text-gray-400 dark:text-gray-700">·</span>
          <span>{{ item.author }}</span>
          <span class="text-gray-400 dark:text-gray-700">·</span>
          <span>{{ item.time }}</span>
        </div>

        <!-- 分段：背景 / 影响 / 社区讨论 -->
        <div class="mt-4 space-y-3 text-base text-gray-700 dark:text-gray-200">
          <p v-if="item.background">
            <span class="text-gray-500 dark:text-gray-400 mr-1">「背景」</span>{{ item.background }}
          </p>
          <p v-if="item.impact">
            <span class="text-gray-500 dark:text-gray-400 mr-1">「影响」</span>{{ item.impact }}
          </p>
          <p v-if="item.community">
            <span class="text-gray-500 dark:text-gray-400 mr-1">「社区讨论」</span>{{ item.community }}
          </p>
        </div>

        <!-- 参考链接 -->
        <div v-if="item.references" class="mt-4">
          <a :href="item.references" target="_blank" :title="item.references"
             class="block border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors">
            参考链接
          </a>
        </div>

        <!-- 标签 -->
        <div v-if="item.tags && item.tags.length" class="mt-2 flex items-center flex-wrap gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">标签：</span>
          <span
            v-for="tag in item.tags" :key="tag"
            class="bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 text-orange-600 dark:text-orange-300/80 text-sm px-3 py-1 rounded-md"
          >
            #{{ tag }}
          </span>
        </div>
      </article>

      <div v-if="filteredItems.length === 0" class="text-center py-20 text-gray-400 dark:text-gray-600">
        暂无内容
      </div>
    </main>

    <!-- 归档列表 -->
    <div
      v-if="showArchive"
      class="fixed inset-0 z-[60] bg-white/95 dark:bg-dark/95 backdrop-blur-lg overflow-y-auto"
    >
      <div class="max-w-3xl mx-auto py-10 px-6">
        <!-- 标题 -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-black dark:text-white">每周简报</h1>
        </div>

        <p class="text-gray-500 text-base mb-6">
          {{ archiveReports.length }} reports · newest first · generated {{ currentDate }}
        </p>

        <!-- Latest report -->
        <button
          v-if="archiveReports.length > 0"
          @click="switchDate(archiveReports[0].date)"
          class="block w-full text-left bg-black/5 dark:bg-white/5 rounded-lg p-4 mb-8 text-base text-blue-600 dark:text-blue-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          → Latest report ({{ archiveReports[0].date }})
        </button>

        <!-- 日期列表：日期 + 统计信息 + KB -->
        <ul class="divide-y divide-black/10 dark:divide-white/10">
          <li
            v-for="report in archiveReports"
            :key="report.date"
            class="flex items-center justify-between py-3 gap-4"
          >
            <button
              @click="switchDate(report.date)"
              :class="['text-left transition-colors text-base shrink-0', report.date === currentDate ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white']"
            >
              {{ report.date }}
            </button>

            <span
              v-if="report.fetched > 0"
              class="text-gray-500 dark:text-gray-500 text-sm flex-1 text-center truncate"
            >
              从 {{ report.fetched }} 条内容中筛选出 {{ report.selected }} 条重要资讯
            </span>
            <span v-else class="flex-1"></span>

            <span class="text-gray-400 dark:text-gray-600 text-sm shrink-0">
              {{ Math.floor(Math.random() * 50 + 100) }} KB
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// ====== 当前日期 ======
const currentDate = ref('2026-09-13')
const showArchive = ref(false)
const activeTab = ref('tech')
const scrolled = ref(false)

// ====== 主题切换 ======
const isDark = ref(true)

const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme()
}

// ====== 数据 ======
const allItems = ref([])
const archiveReports = ref([])

onMounted(async () => {
  // 从 URL 参数读日期（RSS 点击进入时用）
  const params = new URLSearchParams(window.location.search)
  const dateParam = params.get('date')
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    currentDate.value = dateParam
  }
  // 主题初始化
  const saved = localStorage.getItem('theme')
  if (saved === 'light') isDark.value = false
  applyTheme()

  window.addEventListener('scroll', handleScroll, { passive: true })
  await Promise.all([loadData(), loadIndex()])
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const loadData = async (date) => {
  const target = date || currentDate.value
  console.log('[loadData] 开始加载:', target)
  try {
    const res = await fetch(`./assets/data/${target}.json`)
    console.log('[loadData] 状态码:', res.status)
    if (res.ok) {
      allItems.value = await res.json()
      console.log('[loadData] 加载条数:', allItems.value.length)
    } else {
      console.warn('数据加载失败：', res.status)
      allItems.value = []
    }
  } catch (e) {
    console.error('[loadData] 加载数据失败', e)
    allItems.value = []
  }
}

const loadIndex = async () => {
  try {
    const res = await fetch('./assets/data/index.json')
    if (res.ok) {
      archiveReports.value = await res.json()
    }
  } catch (e) {
    console.error('加载归档索引失败', e)
  }
}

// ====== 切换日期 ======
const switchDate = async (date) => {
  if (!date || date === currentDate.value) {
    showArchive.value = false
    return
  }
  currentDate.value = date
  activeTab.value = 'tech'
  await loadData(date)
  showArchive.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  scrolled.value = window.innerWidth < 768 && window.scrollY > 40
}

// ====== 主标签（动态 count，只显示有内容的） ======
const mainTabs = computed(() => {
  const tabs = [
    { id: 'tech', name: '科技新闻', count: allItems.value.filter(i => i.category === 'tech').length },
    { id: 'finance', name: '财经新闻', count: allItems.value.filter(i => i.category === 'finance').length },
    { id: 'politics', name: '时政观察', count: allItems.value.filter(i => i.category === 'politics').length },
    { id: 'art', name: '艺术新闻', count: allItems.value.filter(i => i.category === 'art').length },
  ]
  return tabs.filter(t => t.count > 0)
})

// 自动纠正 activeTab
watch(mainTabs, (tabs) => {
  if (tabs.length === 0) return
  const stillVisible = tabs.some(t => t.id === activeTab.value)
  if (!stillVisible) {
    activeTab.value = tabs[0].id
  }
}, { immediate: true })

// ====== 过滤逻辑 ======
const filteredItems = computed(() => {
  return allItems.value.filter(item => item.category === activeTab.value)
})
</script>
