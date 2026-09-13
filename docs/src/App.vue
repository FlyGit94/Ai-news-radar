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

        <!-- 参考链接 -->
        <div v-if="item.references" class="mt-4">
          <a :href="item.references" target="_blank" :title="item.references"
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
        <!-- 标题 + 关闭 -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-white">每日简报</h1>
          <button @click="showArchive = false" class="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <p class="text-gray-500 text-base mb-6">{{ archiveDates.length }} reports · newest first · generated {{ currentDate }}</p>

        <!-- Latest report：切回最新一天 -->
        <button
          v-if="archiveDates.length > 0"
          @click="switchDate(archiveDates[0])"
          class="block w-full text-left bg-white/5 rounded-lg p-4 mb-8 text-base text-blue-400 hover:bg-white/10 transition-colors"
        >
          → Latest report ({{ archiveDates[0] }})
        </button>

        <!-- 日期列表：点击切换 -->
        <ul class="divide-y divide-white/10">
          <li v-for="date in archiveDates" :key="date" class="flex justify-between py-3">
            <button
              @click="switchDate(date)"
              :class="['text-left transition-colors text-base', date === currentDate ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-white']"
            >
              {{ date }}
            </button>
            <span class="text-gray-600 text-sm">{{ Math.floor(Math.random() * 50 + 100) }} KB</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// ====== 当前日期：从常量改成 ref ======
const currentDate = ref('2026-09-13')
const showArchive = ref(false)
const activeTab = ref('tech')
const activeSubTab = ref('github')
const scrolled = ref(false)

// ====== 数据 ======
const allItems = ref([])
const archiveDates = ref([])

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  await Promise.all([loadData(), loadIndex()])
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 接受日期参数，默认用 currentDate
const loadData = async (date) => {
  const target = date || currentDate.value
  try {
    const res = await fetch(`./data/${target}.json`)
    if (res.ok) {
      allItems.value = await res.json()
    } else {
      console.warn('数据加载失败：', res.status)
      allItems.value = []
    }
  } catch (e) {
    console.error('加载数据失败', e)
    allItems.value = []
  }
}

const loadIndex = async () => {
  try {
    const res = await fetch('./data/index.json')
    if (res.ok) {
      archiveDates.value = await res.json()
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
  // 重置标签
  activeTab.value = 'tech'
  activeSubTab.value = 'github'
  // 重新加载数据
  await loadData(date)
  // 关闭归档、滚回顶部
  showArchive.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  scrolled.value = window.innerWidth < 768 && window.scrollY > 40
}

// ====== 主标签（动态 count） ======
const mainTabs = computed(() => [
  { id: 'tech', name: '科技新闻', count: allItems.value.filter(i => i.category === 'tech').length },
  { id: 'finance', name: '财经新闻', count: allItems.value.filter(i => i.category === 'finance').length },
  { id: 'politics', name: '时政观察', count: allItems.value.filter(i => i.category === 'politics').length },
])

// ====== 子标签（按 source 动态生成） ======
const subTabs = computed(() => {
  const items = allItems.value.filter(i => i.category === activeTab.value)
  const map = {}
  for (const item of items) {
    const src = item.source || 'other'
    if (!map[src]) map[src] = { id: src, name: src, count: 0 }
    map[src].count++
  }
  const tabs = Object.values(map)
  // 如果只有一个来源，就不显示子标签（避免顶部空着一排）
  return tabs.length > 1 ? tabs : []
})

watch(activeTab, () => {
  const tabs = subTabs.value
  if (tabs.length > 0) {
    activeSubTab.value = tabs[0].id
  } else {
    activeSubTab.value = ''
  }
})

// ====== 过滤逻辑 ======
const filteredItems = computed(() => {
  // 没有子标签时，直接显示该主分类下全部
  if (subTabs.value.length === 0) {
    return allItems.value.filter(item => item.category === activeTab.value)
  }
  // 有子标签时，按 source 过滤
  const bySub = allItems.value.filter(item =>
    item.category === activeTab.value && item.source === activeSubTab.value
  )
  if (bySub.length > 0) return bySub
  return allItems.value.filter(item => item.category === activeTab.value)
})
</script>
