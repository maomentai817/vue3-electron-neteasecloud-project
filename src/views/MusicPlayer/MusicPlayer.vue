<script setup>
import { ref } from 'vue'
import { getSongDetail, getSongUrl } from '@/api/song'
import { getMaxColorDifference, getDominantColor } from '@/utils/getMainColor'
import { useGlobalStore } from '@/stores'

const playerVisible = ref(false)
const songDetail = ref({})
const songUrl = ref({})

const colors = ref(['#13131a', '#13131a'])
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
    // 主色
    if (songDetail.value?.al?.picUrl) {
      getDominantColor(songDetail.value?.al?.picUrl).then((color) => {
        globalStore.setColor(color)
      })
    }
  } catch (error) {
    console.error(error)
  }
}
defineExpose({ show, playerVisible })

// 单曲播放详情
const songShow = ref(false)
const toggleShow = () => {
  songShow.value = !songShow.value
}
const globalStore = useGlobalStore()
</script>

<template>
  <div
    class="music-player-container wh-full fd-col overflow-hidden"
    v-show="playerVisible"
  >
    <div
      class="desc-content wh-full z-1001 absolute left-0 top-0 translate-y-100% bg-#13131a"
      :class="songShow ? 'show' : ''"
    >
      <div class="song-content w-full h-89% relative">
        <div
          class="song-header h-90! p-y-10 pl-40 absolute top-0 left-0 z-9999"
        >
          <div class="left">
            <div class="down cp mr-25 btn1" @click="songShow = false">
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
            class="cover-1 cut-img left-0 top-0"
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
      </div>
      <div
        class="song-play-box w-full h-11% f-b p-x-25 z-1002 relative"
        :style="{
          background: `linear-gradient(to right, ${colors[1]}, ${colors[0]})`
        }"
      >
        <div class="info w-25% h-full f-s">
          <div class="song-handle f-s pl-20">
            <div class="collect mr-10 cp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#d2d2d2"
                  :style="{ fill: globalStore.color }"
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
                  fill="#d2d2d2"
                  :style="{ fill: globalStore.color }"
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
                  stroke="#d2d2d2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  color="#d2d2d2"
                  :style="{
                    stroke: globalStore.color,
                    color: globalStore.color
                  }"
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
                  stroke="#d2d2d2"
                  :style="{ stroke: globalStore.color }"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16.004V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M12 4.5v11m3.5-3.5L12 15.5L8.5 12"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="audio-container f-1"></div>
        <div class="handle w-20%"></div>
      </div>
    </div>
    <div
      class="brief-content w-full h-11% bg-#2d2d38 absolute left-0 bottom-0 z-1000 f-b p-x-25"
    >
      <div class="song-info w-25% h-full f-s">
        <div
          class="cover-img rounded-50% wh-62 f-c cursor-pointer"
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
      <div class="audio-container f-1"></div>
      <div class="handle w-20%"></div>
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
      .cover-img {
        background-image: url('@/assets/bg1.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        img {
          animation: imgRotate 25s linear infinite;
        }
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
        animation: 80s linear 0s infinite normal none running cut-rotate;
      }
      .cover-0 {
        background-position: 0 0;
      }
      .cover-1 {
        background-position: 100% 0;
      }
      .cover-2 {
        background-position: 100% 100%;
      }
      .cover-3 {
        background-position: 0 100%;
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
@keyframes cut-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
