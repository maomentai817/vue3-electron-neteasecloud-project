import instance from '@/utils/instance'

// type: 搜索类型；默认为 1 即单曲
// 取值意义: 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018: 综合, 2000: 声音(搜索声音返回字段格式会不一样)

// 搜索关键词
export const getSearchResult = (keyword, type = 1, offset = 0, limit = 30) =>
  instance.get(
    `/cloudsearch?keywords=${keyword}&type=${type}&offset=${offset}&limit=${limit}`
  )

// 默认搜索关键词
export const getDefaultSearchResult = () => instance.get(`/search/default`)

// 获取热搜列表(全)
export const getHotSearchList = () => instance.get(`/search/hot/detail`)

// 搜索建议(pc)
export const getSearchSuggest = (keyword, type = '') =>
  instance.get(`/search/suggest?keywords=${keyword}&type=${type}`)

// 搜索多重匹配
export const getSearchMultimatch = (keyword) =>
  instance.get(`/search/multimatch?keywords=${keyword}`)
