import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore(
  'search',
  () => {
    // state
    // 搜索历史记录
    const searchHistory = ref(
      JSON.parse(localStorage.getItem('searchHistory')) || []
    )
    // actions
    const pushHistory = (keyword) => {
      // 去重
      const index = searchHistory.value.indexOf(keyword)
      if (index !== -1) {
        searchHistory.value.splice(index, 1)
      }
      searchHistory.value.unshift(keyword)
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }
    // 清空
    const clearSearchHistory = () => {
      searchHistory.value = []
      localStorage.removeItem('searchHistory')
    }
    // getters
    return {
      searchHistory,
      pushHistory,
      clearSearchHistory
    }
  },
  // 本地持久化
  {
    persist: true
  }
)
