<script setup>
import { ref } from 'vue'
import { getSongDetail, getSongUrl, getLyric } from '@/api/song'
import { getMaxColorDifference, getDominantColor } from '@/utils/getMainColor'
import { useGlobalStore, useMusicStore } from '@/stores'
import ProgressBar from './components/ProgressBar.vue'
import DetailCenter from './components/DetailCenter.vue'
import LyricContainer from './components/LyricContainer.vue'
import DetailRight from './components/DetailRight.vue'

const playerVisible = ref(false)
const songDetail = ref({})
const songUrl = ref({})
const lyric = ref('')

const colors = ref(['#13131a', '#13131a'])
const musicStore = useMusicStore()
const show = async (id) => {
  playerVisible.value = true
  try {
    const detailRes = await getSongDetail(id)
    songDetail.value = detailRes.songs[0]

    const urlRes = await getSongUrl(
      id,
      detailRes?.privileges[0]?.playMaxBrLevel
    )
    songUrl.value = urlRes.data[0]

    // color-thief
    const colorRes = await getMaxColorDifference(songDetail.value?.al?.picUrl)
    colors.value = colorRes?.map((i) => `rgb(${i[0]}, ${i[1]}, ${i[2]})`)
    globalStore.setColors(colors.value[0], colors.value[1])
    // 主色
    if (songDetail.value?.al?.picUrl) {
      getDominantColor(songDetail.value?.al?.picUrl).then((color) => {
        globalStore.setColor(color)
      })
    }
    // 更新状态管理器
    musicStore.updateInfo(songUrl.value?.url, songDetail.value)

    // 更新时间管理器
    timeState.value = {
      stop: false,
      previousTime: 0
    }
    // 获取逐字歌词
    lyric.value = (await getLyric(id))?.lrc?.lyric
  } catch (error) {
    console.error(error)
  }
}

// 单曲播放详情
const songShow = ref(false)
const toggleShow = () => {
  songShow.value = !songShow.value
}
const globalStore = useGlobalStore()
defineExpose({ show, playerVisible, songShow })

// 播放器相关逻辑

const audio = ref(null)
const timeState = ref({
  stop: false,
  previousTime: 0
})

const pb1 = ref(null)
const pb2 = ref(null)
const timeupdate = (e) => {
  if (timeState.value.stop) return
  // 更新 currentTime 值
  timeState.value.previousTime = musicStore.currentTime

  musicStore.updateTime(e.target.currentTime)
}

// 进度条相关
const progressChange = (val) => {
  timeState.value.stop = true
  musicStore.updateTime(val)
  audio.value.currentTime = val
  // 检查歌曲是否结束，结束的话重新播放
  if (audio.value.ended) {
    audio.value.play()
  }
  setTimeout(() => {
    timeState.value.stop = false
  }, 50)
}
// 鼠标拖动开始时禁用 timeupdate
const handleMouseDown = () => {
  timeState.value.stop = true
}

// 鼠标拖动结束时恢复 timeupdate
const handleMouseUp = () => {
  timeState.value.stop = false
}

const handlePause = () => {
  audio.value.pause()
  musicStore.stop = true
}
const handlePlay = () => {
  audio.value.play()
  musicStore.stop = false
}

// 音量
const volumeUpdate = (val) => {
  audio.value.volume = val
}
</script>

<template>
  <div
    class="music-player-container wh-full fd-col overflow-hidden no-select"
    v-show="playerVisible"
  >
    <audio
      @timeupdate="timeupdate"
      @ended="end"
      @seeked="seeked"
      ref="audio"
      class="plyr-audio"
      :src="songUrl.url"
      preload="auto"
      autoplay
    />
    <div
      class="desc-content wh-full z-1003 absolute left-0 top-0 translate-y-100%"
      :class="songShow ? 'show' : ''"
      :style="{ background: `${globalStore.color}` }"
    >
      <div class="song-content w-full h-89% relative">
        <div
          class="song-header h-90! w-full p-y-10 pl-40 absolute top-0 left-0 z-9999 p-r-200"
        >
          <div class="left p-r-200" :class="songShow ? 'window-container' : ''">
            <div class="down cp mr-25 btn1 no-drag" @click="songShow = false">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#fff"
                  stroke-width="2"
                  d="m2 8.35l10.173 9.823L21.997 8"
                ></path>
              </svg>
            </div>
            <div class="full cp btn1"></div>
          </div>
          <div class="right"></div>
        </div>
        <div class="rhythm-box wh-full absolute top-0 left-0" v-show="songShow">
          <div
            class="cover-0 cut-img left-0 top-0"
            :style="{ backgroundImage: `url(${songDetail?.al?.picUrl})` }"
          ></div>
          <div
            class="cover-1 cut-img left-50vw top-0"
            :style="{ backgroundImage: `url(${songDetail?.al?.picUrl})` }"
          ></div>
          <div
            class="cover-2 cut-img left-50vw top-50vh"
            :style="{ backgroundImage: `url(${songDetail?.al?.picUrl})` }"
          ></div>
          <div
            class="cover-3 cut-img left-0 top-50vh"
            :style="{ backgroundImage: `url(${songDetail?.al?.picUrl})` }"
          ></div>
        </div>
        <!-- 歌词区域 -->
        <div class="lyric-area p-t-90 absolute top-0 left-0 wh-full">
          <lyric-container :lyric="lyric"></lyric-container>
        </div>
      </div>
      <div
        class="timeline w-full absolute left-0 bottom-11% z-9999"
        v-show="songShow"
      >
        <progress-bar
          :song="songDetail"
          :duration="songUrl?.time / 1000"
          ref="pb1"
          @change="progressChange"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
        ></progress-bar>
      </div>
      <div class="song-play-box w-full h-11% f-b p-x-25 z-1002 relative">
        <div
          class="dark absolute wh-full top-0 left-0 bg-#0000003f z-1004"
        ></div>
        <div class="info w-25% h-full f-b z-1005">
          <div class="song-handle f-a pl-40 wh-full">
            <div class="collect mr-20 cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#d2d2d2"
                  d="m11.066 8.004l.184-.005h7.5a3.25 3.25 0 0 1 3.245 3.065l.005.185v7.5a3.25 3.25 0 0 1-3.066 3.245l-.184.005h-7.5a3.25 3.25 0 0 1-3.245-3.066L8 18.75v-7.5a3.25 3.25 0 0 1 3.066-3.245M18.75 9.5h-7.5a1.75 1.75 0 0 0-1.744 1.606l-.006.144v7.5a1.75 1.75 0 0 0 1.607 1.744l.143.006h7.5a1.75 1.75 0 0 0 1.744-1.607l.006-.143v-7.5a1.75 1.75 0 0 0-1.75-1.75M15 11a.75.75 0 0 1 .75.75v2.498h2.5a.75.75 0 0 1 0 1.5h-2.5v2.502a.75.75 0 0 1-1.5 0v-2.502h-2.5a.75.75 0 1 1 0-1.5h2.5V11.75A.75.75 0 0 1 15 11m.582-6.767l.052.177l.693 2.588h-1.553l-.588-2.2a1.75 1.75 0 0 0-2.144-1.238L4.798 5.502a1.75 1.75 0 0 0-1.27 1.995l.032.148l1.942 7.244A1.75 1.75 0 0 0 7 16.176v1.506a3.25 3.25 0 0 1-2.895-2.228l-.052-.176l-1.941-7.245a3.25 3.25 0 0 1 2.12-3.928l.178-.052l7.244-1.941a3.25 3.25 0 0 1 3.928 2.12"
                ></path>
              </svg>
            </div>
            <div class="comment mr-20 cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#d2d2d2"
                  d="M17 9H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-4 4H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20"
                ></path>
              </svg>
            </div>
            <div class="share mr-20 cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="#d2d2d2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  color="#d2d2d2"
                >
                  <path
                    d="M11.026 3a9.028 9.028 0 0 0 1.003 18A9.03 9.03 0 0 0 21 13"
                  ></path>
                  <path
                    d="m21 6.025l-1-.002c-3.737-.01-5.605-.015-6.918.93c-.437.313-.82.695-1.135 1.131C11 9.395 11 11.264 11 15m10-8.975a.7.7 0 0 0-.175-.472C20.06 4.647 18.071 3 18.071 3M21 6.025a.7.7 0 0 1-.174.422C20.06 7.353 18.07 9 18.07 9"
                  ></path>
                </g>
              </svg>
            </div>
            <div class="download cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#d2d2d2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16.004V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M12 4.5v11m3.5-3.5L12 15.5L8.5 12"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="audio-container f-1 z-1005">
          <detail-center
            @play="handlePlay"
            @pause="handlePause"
            :isPlay="!timeState.stop"
          ></detail-center>
        </div>
        <div class="handle w-25% z-1005">
          <detail-right
            @input="volumeUpdate"
            @volume="volumeUpdate"
          ></detail-right>
        </div>
      </div>
    </div>
    <div
      class="brief-content w-full h-11% bg-#2d2d38 absolute left-0 bottom-0 z-1000 f-b p-x-25"
    >
      <div class="song-info w-25% h-full f-s">
        <div
          class="cover-img rounded-50% wh-62 f-c cursor-pointer"
          :class="musicStore.stop ? 'animation-pause' : ''"
          @click="toggleShow"
        >
          <img
            :src="songDetail?.al?.picUrl"
            alt=""
            class="w-65% h-65% rounded-50%"
          />
        </div>
        <div class="song-inc fd-col justify-between ml-10 h-62 p-y-6 w-200">
          <div class="song-name w-full">
            <div class="marquee-content">
              <span class="fs-15 fw-500 cursor-pointer">{{
                songDetail?.name
              }}</span>
              -
              <span
                class="fs-12 color-#969696 hover:color-#fff cursor-pointer mr-20"
                v-if="songDetail?.ar?.length > 0"
                @click.stop="$router.push(`/singer?id=${songDetail?.ar[0].id}`)"
                >{{ songDetail?.ar[0].name }}</span
              >
            </div>
            <div class="marquee-content">
              <span class="fs-15 fw-500 cursor-pointer">{{
                songDetail?.name
              }}</span>
              -
              <span
                class="fs-12 color-#969696 hover:color-#fff cursor-pointer mr-20"
                v-if="songDetail?.ar?.length > 0"
                @click.stop="$router.push(`/singer?id=${songDetail?.ar[0].id}`)"
                >{{ songDetail?.ar[0].name }}</span
              >
            </div>
          </div>
          <div class="song-handle f-s">
            <div class="collect mr-10 cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#969696"
                  d="m11.066 8.004l.184-.005h7.5a3.25 3.25 0 0 1 3.245 3.065l.005.185v7.5a3.25 3.25 0 0 1-3.066 3.245l-.184.005h-7.5a3.25 3.25 0 0 1-3.245-3.066L8 18.75v-7.5a3.25 3.25 0 0 1 3.066-3.245M18.75 9.5h-7.5a1.75 1.75 0 0 0-1.744 1.606l-.006.144v7.5a1.75 1.75 0 0 0 1.607 1.744l.143.006h7.5a1.75 1.75 0 0 0 1.744-1.607l.006-.143v-7.5a1.75 1.75 0 0 0-1.75-1.75M15 11a.75.75 0 0 1 .75.75v2.498h2.5a.75.75 0 0 1 0 1.5h-2.5v2.502a.75.75 0 0 1-1.5 0v-2.502h-2.5a.75.75 0 1 1 0-1.5h2.5V11.75A.75.75 0 0 1 15 11m.582-6.767l.052.177l.693 2.588h-1.553l-.588-2.2a1.75 1.75 0 0 0-2.144-1.238L4.798 5.502a1.75 1.75 0 0 0-1.27 1.995l.032.148l1.942 7.244A1.75 1.75 0 0 0 7 16.176v1.506a3.25 3.25 0 0 1-2.895-2.228l-.052-.176l-1.941-7.245a3.25 3.25 0 0 1 2.12-3.928l.178-.052l7.244-1.941a3.25 3.25 0 0 1 3.928 2.12"
                ></path>
              </svg>
            </div>
            <div class="comment mr-10 cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#969696"
                  d="M17 9H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-4 4H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20"
                ></path>
              </svg>
            </div>
            <div class="share mr-10 cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="#969696"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  color="#969696"
                >
                  <path
                    d="M11.026 3a9.028 9.028 0 0 0 1.003 18A9.03 9.03 0 0 0 21 13"
                  ></path>
                  <path
                    d="m21 6.025l-1-.002c-3.737-.01-5.605-.015-6.918.93c-.437.313-.82.695-1.135 1.131C11 9.395 11 11.264 11 15m10-8.975a.7.7 0 0 0-.175-.472C20.06 4.647 18.071 3 18.071 3M21 6.025a.7.7 0 0 1-.174.422C20.06 7.353 18.07 9 18.07 9"
                  ></path>
                </g>
              </svg>
            </div>
            <div class="download cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#969696"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16.004V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M12 4.5v11m3.5-3.5L12 15.5L8.5 12"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="audio-container f-1">
        <detail-center
          @play="handlePlay"
          @pause="handlePause"
          :isPlay="!timeState.stop"
        ></detail-center>
      </div>
      <div class="handle w-25%">
        <detail-right
          @input="volumeUpdate"
          @volume="volumeUpdate"
        ></detail-right>
      </div>
    </div>
    <div
      class="timeline w-full absolute left-0 bottom-11% z-1006"
      v-show="!songShow"
    >
      <progress-bar
        :song="songDetail"
        :duration="songUrl?.time / 1000"
        ref="pb2"
        @change="progressChange"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
      ></progress-bar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music-player-container {
  transition: all 0.3s ease;
  .show {
    transform: translateY(0) !important;
  }
  .collect,
  .comment {
    svg:hover path {
      fill: #fff;
    }
  }
  .share {
    svg:hover g {
      stroke: #fff;
      color: #fff;
    }
  }
  .download,
  .down {
    svg:hover path {
      stroke: #fff;
    }
  }
  .brief-content {
    .song-info {
      .animation-pause {
        animation-play-state: paused !important;
      }
      .cover-img {
        animation: imgRotate 35s linear infinite;
        animation-play-state: running;
        background-image: url('@/assets/bg1.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .song-inc {
        overflow: hidden;
        white-space: nowrap;
        .song-name {
          display: inline-block;
          .marquee-content {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 5s linear infinite;
          }
        }
      }
    }
  }
  .desc-content {
    transition: all 0.3s ease;
    // background: rgba(0, 0, 0, 0.3);
    .rhythm-box {
      filter: blur(120px);
      .cut-img {
        position: absolute;
        background-size: 200% 200%;
        background-repeat: no-repeat;
        width: 50vw;
        height: 50vh;
        transition: all 0.5s ease 0s;
        // animation: 80s linear 0s infinite normal none running cut-rotate;
      }
      .cover-0 {
        background-position: 0 0;
        animation: 80s linear 0s infinite normal none running cut-rotate0;
      }
      .cover-1 {
        background-position: 100% 0;
        animation: 80s linear 0s infinite normal none running cut-rotate1;
      }
      .cover-2 {
        background-position: 100% 100%;
        animation: 80s linear 0s infinite normal none running cut-rotate2;
      }
      .cover-3 {
        background-position: 0 100%;
        animation: 80s linear 0s infinite normal none running cut-rotate3;
      }
    }
    .btn1 {
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 1px solid #969696ff;
      border-radius: 5px;
      width: 4vw;
      height: 4vw;
      // background: #9696961a;
    }
    .song-play-box {
      backdrop-filter: blur(60px) saturate(210%);
    }
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
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100%));
  }
}
@keyframes cut-rotate0 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes cut-rotate1 {
  0% {
    transform: rotate(50deg);
  }
  100% {
    transform: rotate(410deg);
  }
}
@keyframes cut-rotate2 {
  0% {
    transform: rotate(110deg);
  }
  100% {
    transform: rotate(470deg);
  }
}
@keyframes cut-rotate3 {
  0% {
    transform: rotate(210deg);
  }
  100% {
    transform: rotate(570deg);
  }
}
.no-select {
  -webkit-user-select: none; /* 针对 Safari 和 Chrome */
  -moz-user-select: none; /* 针对 Firefox */
  -ms-user-select: none; /* 针对 IE 和 Edge */
  user-select: none; /* 标准属性 */
}
</style>
