<script setup>
import { useRoute } from 'vue-router'
import { getMvDetail, getMvUrl, getMvInfo } from '@/api/mv'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getDominantColor } from '@/utils/getMainColor'
import { useGlobalStore } from '@/stores'
import { NumberOutlined, SmileOutlined } from '@ant-design/icons-vue'
import { useIntersectionObserver } from '@vueuse/core'

const route = useRoute()
const globalStore = useGlobalStore()

const mvDetail = ref({})
const mvInfo = ref({})
const mvUrl = ref({})
const init = async () => {
  try {
    const [res1, res2, res3] = await Promise.all([
      getMvDetail(route.query.id),
      getMvInfo(route.query.id),
      getMvUrl(route.query.id)
    ])

    mvDetail.value = res1?.data
    mvInfo.value = res2
    mvUrl.value = res3?.data
  } catch (error) {
    console.error('xixi', error)
  }
}

onMounted(async () => {
  await init()
  if (mvDetail.value.cover) {
    getDominantColor(mvDetail.value.cover).then((color) => {
      globalStore.setBackgroundStyle(color)
    })
  }
  const video = document.querySelector('video')
  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src)
    // console.log(video.videoWidth, video.videoHeight)
  }
})

const isShow = ref(false)
const toggle = () => {
  isShow.value = !isShow.value
}

// 小屏逻辑
// 当大屏离开可视区域, 停止播放, 小屏显示并同步时间
const bigPlayer = ref(null)
const line = ref(null)
const showSmallPlayer = ref(false)
const { stop } = useIntersectionObserver(line, ([{ isIntersecting }]) => {
  if (!isIntersecting) {
    showSmallPlayer.value = true
  } else {
    showSmallPlayer.value = false
  }
})
onBeforeUnmount(() => {
  stop()
})

const aspectRatio = ref(0)
const getAspectRatio = () => {
  if (bigPlayer.value) {
    const videoWidth = bigPlayer.value.videoWidth
    const videoHeight = bigPlayer.value.videoHeight
    aspectRatio.value = (videoWidth / videoHeight).toFixed(2)
  }
}
</script>

<template>
  <div class="mv-container fd-col justify-center items-center relative">
    <div class="vi-area w-85% relative">
      <video
        :src="mvUrl.url"
        autoplay
        controls
        width="100%"
        preload="auto"
        ref="bigPlayer"
        :poster="mvDetail.cover"
        class="absolute"
        @loadedmetadata="getAspectRatio"
        :class="showSmallPlayer ? 'sm-vi' : ''"
      ></video>
      <div
        class="placeholder wh-full"
        :style="{ 'aspect-ratio': aspectRatio }"
      ></div>
    </div>
    <div class="video-line h-1" ref="line"></div>
    <div class="video-info fd-col w-85% mt-15">
      <div class="header f-s fs-20 fw-600 mb-5">{{ mvDetail.name }}</div>
      <div class="artists fs-13 w-full" :class="isShow ? '' : 'flex-start'">
        <span class="mr-5 w-5%" :class="isShow ? '' : 'f-sh'">歌手 :</span>
        <span class="group1" :class="isShow ? '' : 'txt'">
          <template v-for="(a, i) in mvDetail.artists" :key="i">
            <router-link :to="{ path: '/singer', query: { id: a.id } }">
              <span class="color-#d2d2d2cc">{{ a.name }}</span>
            </router-link>
            <span v-if="i < mvDetail.artists.length - 1" class="m-x-2">/</span>
          </template>
        </span>
        <span
          class="color-#4c6397 cursor-pointer ml-10"
          @click="toggle"
          :class="isShow ? '' : 'f-sh'"
          >{{ isShow ? '收起' : '展开' }}</span
        >
      </div>
      <div class="info f-b mt-10 fs-12 fw-400 color-#d2d2d2cc">
        <div class="left f-c">
          <div class="publish-time">
            <span>发布时间: </span>
            <span>{{ mvDetail.publishTime }}</span>
          </div>
          <div class="pay-count ml-20">
            <span>播放: </span>
            <span>{{ mvDetail.playCount }}</span>
          </div>
        </div>
        <div class="right f-e">
          <div class="like ml-15 f-c">
            <span class="mr-5">{{ mvInfo.likedCount }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
            >
              <path
                fill="#d2d2d2cc"
                d="M1.36 9.495v7.157h3.03l.153.018c2.813.656 4.677 1.129 5.606 1.422c1.234.389 1.694.484 2.531.54c.626.043 1.337-.198 1.661-.528c.179-.182.313-.556.366-1.136a.68.68 0 0 1 .406-.563c.249-.108.456-.284.629-.54c.16-.234.264-.67.283-1.301a.68.68 0 0 1 .339-.57c.582-.337.87-.717.93-1.163c.066-.493-.094-1.048-.513-1.68a.683.683 0 0 1 .176-.936c.401-.282.621-.674.676-1.23c.088-.886-.477-1.541-1.756-1.672a9.4 9.4 0 0 0-3.394.283a.68.68 0 0 1-.786-.95c.5-1.058.778-1.931.843-2.607c.085-.897-.122-1.547-.606-2.083c-.367-.406-.954-.638-1.174-.59c-.29.062-.479.23-.725.818c-.145.348-.215.644-.335 1.335c-.115.656-.178.952-.309 1.34c-.395 1.176-1.364 2.395-2.665 3.236a12 12 0 0 1-2.937 1.37a.7.7 0 0 1-.2.03zm-.042 8.52c-.323.009-.613-.063-.856-.233c-.31-.217-.456-.559-.459-.953l.003-7.323c-.034-.39.081-.748.353-1.014c.255-.25.588-.368.94-.36h2.185A10.5 10.5 0 0 0 5.99 6.95c1.048-.678 1.82-1.65 2.115-2.526c.101-.302.155-.552.257-1.14c.138-.789.224-1.156.422-1.628c.41-.982.948-1.462 1.69-1.623c.73-.158 1.793.263 2.465 1.007c.745.824 1.074 1.855.952 3.129q-.079.82-.454 1.844a10.5 10.5 0 0 1 2.578-.056c2.007.205 3.134 1.512 2.97 3.164c-.072.712-.33 1.317-.769 1.792c.369.711.516 1.414.424 2.1c-.106.79-.546 1.448-1.278 1.959c-.057.693-.216 1.246-.498 1.66a2.9 2.9 0 0 1-.851.834c-.108.684-.335 1.219-.706 1.595c-.615.626-1.714.999-2.718.931c-.953-.064-1.517-.18-2.847-.6c-.877-.277-2.693-.737-5.43-1.377zm1.701-8.831a.68.68 0 0 1 .68-.682a.68.68 0 0 1 .678.682v7.678a.68.68 0 0 1-.679.681a.68.68 0 0 1-.679-.681z"
              ></path>
            </svg>
          </div>
          <div class="sub ml-15 f-c">
            <span class="mr-5">{{ mvDetail.subCount }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="#d2d2d2cc"
                d="m11.066 8.004l.184-.005h7.5a3.25 3.25 0 0 1 3.245 3.065l.005.185v7.5a3.25 3.25 0 0 1-3.066 3.245l-.184.005h-7.5a3.25 3.25 0 0 1-3.245-3.066L8 18.75v-7.5a3.25 3.25 0 0 1 3.066-3.245M18.75 9.5h-7.5a1.75 1.75 0 0 0-1.744 1.606l-.006.144v7.5a1.75 1.75 0 0 0 1.607 1.744l.143.006h7.5a1.75 1.75 0 0 0 1.744-1.607l.006-.143v-7.5a1.75 1.75 0 0 0-1.75-1.75M15 11a.75.75 0 0 1 .75.75v2.498h2.5a.75.75 0 0 1 0 1.5h-2.5v2.502a.75.75 0 0 1-1.5 0v-2.502h-2.5a.75.75 0 1 1 0-1.5h2.5V11.75A.75.75 0 0 1 15 11m.582-6.767l.052.177l.693 2.588h-1.553l-.588-2.2a1.75 1.75 0 0 0-2.144-1.238L4.798 5.502a1.75 1.75 0 0 0-1.27 1.995l.032.148l1.942 7.244A1.75 1.75 0 0 0 7 16.176v1.506a3.25 3.25 0 0 1-2.895-2.228l-.052-.176l-1.941-7.245a3.25 3.25 0 0 1 2.12-3.928l.178-.052l7.244-1.941a3.25 3.25 0 0 1 3.928 2.12"
              ></path>
            </svg>
          </div>
          <div class="share ml-15 f-c">
            <span class="mr-5">{{ mvInfo.shareCount }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="#d2d2d2cc"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                color="#d2d2d2cc"
                class="share-g"
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
          <div class="haosi ml-15">举办</div>
        </div>
      </div>
    </div>
    <div class="comments-area mt-30 w-85%">
      <div class="header mb-15 relative">
        <span class="fw-600 fs-18 color-#fff">全部评论</span>
        <span class="fs-12 translate-y--25% absolute">{{
          mvInfo.commentCount
        }}</span>
      </div>
      <div class="my-comment rounded-20 mb-40 bg-#ffffff1a h-110 relative pt-5">
        <a-textarea
          v-model:value="myComment"
          show-count
          :maxlength="140"
          :bordered="false"
          placeholder="说些什么吧"
          :autoSize="{ minRows: 3, maxRows: 3 }"
        />
        <div class="handle absolute right-10 bottom-3 f-e">
          <div class="tag item f-c">
            <NumberOutlined />
          </div>
          <div class="at item f-c text-center">@</div>
          <div class="emoji item f-c">
            <SmileOutlined />
          </div>
          <div class="submit item f-c ml-20 mr-10">发布</div>
        </div>
      </div>
      <CommentArea
        :is-brief="true"
        title="精彩评论"
        :type="1"
        :id="route.query.id"
      ></CommentArea>
      <CommentArea
        :is-brief="false"
        title="最新评论"
        :type="1"
        :id="route.query.id"
      ></CommentArea>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex-start {
  display: flex;
  justify-content: start;
  align-items: center;
}
.txt {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.f-sh {
  flex-shrink: 0;
}
.right {
  svg {
    cursor: pointer;
    &:hover {
      path {
        fill: #d2d2d2;
      }
      .share-g {
        path {
          stroke: #d2d2d2;
          color: #d2d2d2;
          fill: none;
        }
      }
    }
  }
  .haosi {
    cursor: pointer;
    &:hover {
      color: #d2d2d2;
    }
  }
}
:deep(.ant-input-textarea-show-count::after) {
  float: left !important;
  color: #d2d2d2cc;
  font-size: 12px;
  margin-left: 15px;
  margin-top: 10px;
}
:deep(.ant-input) {
  scrollbar-width: 0 !important;
  color: #d2d2d2cc;
  height: 65px;
  &::placeholder {
    color: #d2d2d299;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
.item {
  color: #d2d2d2cc;
  cursor: pointer;
  margin-left: 12px;
  &:hover {
    color: #fff;
  }
}
.sm-vi {
  position: fixed;
  width: 30%;
  bottom: 12%;
  right: 30px;
  border-radius: 5px;
  z-index: 100;
}
.placeholder {
  width: 100%;
  height: 100%;
  display: block;
  // aspect-ratio: 16 / 9;
}
</style>
