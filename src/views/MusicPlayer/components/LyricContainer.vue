<script setup>
import { useMusicStore, useGlobalStore } from '@/stores'
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  lrc: {
    type: Array,
    default: () => []
  },
  yrc: {
    type: Array,
    default: () => []
  },
  songShow: {
    type: Boolean,
    default: false
  }
})

const musicStore = useMusicStore()
const globalStore = useGlobalStore()

// tabs 切换
const active = ref(0)
const tabChange = (target) => {
  active.value = target
}
// 逐行歌词
const artistInfo = ref([])
const lrcs = ref([])

// 歌词格式二次转换
const parseLyrics = (arr) => {
  return arr
    .filter((item) => item.trim() !== '') // 过滤掉空字符串
    .map((item) => {
      // 使用正则表达式解析时间和歌词文本
      const match = item.match(/\[(\d{2}):(\d{2}\.\d{1,3})\](.*)/)
      if (match) {
        const minutes = parseInt(match[1])
        const seconds = parseFloat(match[2])
        const timeInMs = (minutes * 60 + seconds) * 1000
        const text = match[3].trim()
        if (text === '') {
          return null
        }
        return {
          time: Math.ceil(timeInMs),
          txt: text
        }
      }
      return null
    })
    .filter((item) => item !== null) // 过滤掉无效的匹配
}
const convertArray = (arr) => {
  if (arr?.length === 0) return
  return arr?.map((item) => {
    // 将 c 数组中的文本拼接起来
    item = JSON.parse(item)
    const text = item.c
      ?.map((element) => {
        return element.tx
      })
      .join('')

    return {
      time: item.t,
      txt: text
    }
  })
}

// 切歌
// 纯音乐标志
const pureMusic = ref(false)
watch(
  () => props.lrc[0],
  () => {
    tabChange(0)
    // 数据处理
    lrcs.value = []
    artistInfo.value = []
    pureMusic.value = false
    props.lrc.forEach((item) => {
      if (item[0] === '[') lrcs.value.push(item)
      if (item[0] === '{') artistInfo.value.push(item)
    })
    lrcs.value = parseLyrics(lrcs.value)
    if (lrcs.value.length === 1) pureMusic.value = true
    artistInfo.value = convertArray(artistInfo.value)

    lrcs.value = [...artistInfo.value, ...lrcs.value]
  }
)

const timerTansform = (seconds) => {
  // 将秒转换为 xx:xx
  seconds = parseInt(seconds)
  const minutes = Math.floor(seconds / 60)
  const secondLeft = seconds % 60
  return `${('0' + minutes).slice(-2)}:${('0' + secondLeft).slice(-2)}`
}

const emit = defineEmits(['lyric'])
// 点击切换歌词
const lyricChange = (time) => {
  emit('lyric', time / 1000)
}

const activeLyric = ref(0)
// 监听时间变化
watch(
  () => musicStore.currentTime,
  (currentTime) => {
    // 寻找对应时间的歌词索引
    const index = lrcs.value.findIndex(
      (item) => item.time >= currentTime * 1000
    )
    if (index !== -1) {
      activeLyric.value = index - 1
      if (props.songShow) scrollToActiveLyric()
    }
  }
)

// 滚动到当前歌词
const lyricList = ref(null)
const scrollToActiveLyric = () => {
  nextTick(() => {
    const activeLyric = lyricList.value.querySelector('.lrc-active')
    if (activeLyric) {
      activeLyric.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  })
}
</script>

<template>
  <div class="lyric-part f-b wh-full" v-if="musicStore.songInfo?.id">
    <div class="cover-img w-50% relative flex-shrink-0">
      <div
        class="pic w-320 h-320 m-0-auto f-c relative"
        :class="musicStore.stop ? 'animation-pause' : ''"
      >
        <img
          :src="musicStore.songInfo?.al.picUrl"
          alt=""
          class="w-210 h-210 rounded-50%"
        />
      </div>
      <div
        class="pointer absolute top--30% left-45% translate-x--100% w-300 h-200 cp"
        :class="musicStore.stop ? '' : 'pointer-on'"
      ></div>
    </div>
    <div class="lyric-content f-1 wh-full fd-col p-r-30 p-b-20">
      <div class="song-des">
        <div class="song-name m-b-10">
          <span class="name fs-26 fw-600 color-#fff">{{
            musicStore.songInfo?.name
          }}</span>
          <span
            class="mv rounded-4 fs-11 fw-600 b-1-#fff m-l-8 p-x-2 cp"
            v-if="musicStore.songInfo?.mv"
            @click="$router.push(`/mv?id=${musicStore.songInfo?.mv}`)"
            >mv&#9654;</span
          >
        </div>
        <div class="desc-content fs-16 color-#f2f2f2 f-s">
          <span
            class="album w-220 text-overflow m-r-30"
            v-if="musicStore.songInfo?.al?.id"
            >专辑:
            <span
              class="cp fs-15 hover:color-#fff"
              @click="$router.push(`/album?id=${musicStore.songInfo?.al?.id}`)"
              >{{ musicStore.songInfo.al.name }}</span
            >
          </span>
          <span
            class="singer w-260 text-overflow"
            v-if="musicStore.songInfo?.ar?.length"
            >歌手:
            <template
              v-for="(item, index) in musicStore.songInfo?.ar"
              :key="index"
            >
              <span
                class="cp fs-15 hover:color-#fff text-overflow"
                @click="$router.push(`/singer?id=${item.id}&name=${item.name}`)"
                >{{ item.name }}</span
              >
              {{ index !== musicStore.songInfo?.ar?.length - 1 ? '/' : '' }}
            </template>
          </span>
        </div>
      </div>
      <div role="tablist" class="tabs tabs-boxed w-220 duration-400 m-t-15">
        <a
          role="tab"
          class="tab"
          :class="active === 0 ? 'tab-active' : ''"
          @click="tabChange(0)"
          >歌词</a
        >
        <a
          role="tab"
          class="tab"
          :class="active === 1 ? 'tab-active' : ''"
          @click="tabChange(1)"
          >百科</a
        >
        <a
          role="tab"
          class="tab"
          :class="active === 2 ? 'tab-active' : ''"
          @click="tabChange(2)"
          >相似推荐</a
        >
      </div>
      <el-scrollbar class="translate-x--60 duration-400 m-t-15 f-1">
        <div class="m-tabs m-t-15">
          <div class="tab-content wh-full">
            <div class="tab1 wh-full" v-show="active === 0">
              <div class="lyric-list w-full" ref="lyricList">
                <template v-if="pureMusic">
                  <div
                    class="lyric-item cp translate-x-60 p-x-25 p-y-15 rounded-15 fw-600 fs-20 hover:bg-#ffffff2e"
                  >
                    <span class="lyric-text">纯音乐，请欣赏</span>
                  </div>
                </template>
                <template v-else>
                  <div
                    class="lyric-item cp p-x-25 p-y-15 f-s rounded-15 fw-500 fs-20 hover:bg-#ffffff2e"
                    v-for="(item, index) in lrcs"
                    :key="index"
                    @click="lyricChange(item.time)"
                    :class="{ 'lrc-active': index === activeLyric }"
                  >
                    <span class="time fs-11 m-r-20 opacity-0 w-38">{{
                      timerTansform(parseInt(item.time / 1000))
                    }}</span>
                    <span class="txt">{{ item.txt }}</span>
                  </div></template
                >
              </div>
            </div>
            <div class="tab2 wh-full" v-show="active === 1">百科</div>
            <div class="tab3 wh-full" v-show="active === 2">相似推荐</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lyric-part {
  .cover-img {
    .animation-pause {
      animation-play-state: paused !important;
    }
    .pic {
      animation: imgRotate 35s linear infinite;
      animation-play-state: running;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.1);
        width: 320px;
        height: 320px;
        transform: scale(1.05);
        z-index: 1;
        border-radius: 50%;
      }
      &::after {
        content: '';
        background-image: url('@/assets/bg1.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: absolute;
        top: 0;
        left: 0;
        width: 320px;
        height: 320px;
        z-index: 0;
      }
    }
    .pointer {
      background-image: url('@/assets/bg2.png');
      background-repeat: no-repeat;
      transform: scale(0.9);
      transform-origin: 15px 15px;
      transition: all 0.5s;
    }
    .pointer-on {
      transform: rotate(30deg) scale(0.9);
    }
  }
  .lyric-content {
    .tabs-boxed {
      border-radius: 14px;
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff !important;
      .tab {
        color: #fff;
      }
      .tab-active:not(.tab-disabled):not([disabled]) {
        border-radius: 12px;
        color: v-bind('globalStore.colors[1]') !important;
        filter: brightness(120%);
        background-color: transparent;
        backdrop-filter: blur(60px) saturate(210%);
      }
    }
    .m-tabs {
      .tab-content {
        color: v-bind('globalStore.colors[1]');
      }
      .lyric-list {
        padding-bottom: 32vh;
        .lyric-item {
          &:hover {
            .time {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  :deep(.el-scrollbar__bar) {
    display: none;
  }
  :deep(.el-scrollbar) {
    height: calc(100% + 65px);
    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 30%,
      black 70%,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent,
      black 30%,
      black 70%,
      transparent
    );
  }
  .lrc-active {
    color: #fff !important;
    font-size: 26px;
    font-weight: 520;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3);
    scroll-margin-bottom: 32vh;
  }
}
@keyframes imgRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
