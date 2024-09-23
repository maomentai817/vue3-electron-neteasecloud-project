<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAlbumDetail, getAlbumDynamicDetail } from '@/api/music'
import { getDominantColor } from '@/utils/getMainColor'
import { useGlobalStore } from '@/stores'
import { formatTimestampDay } from '@/utils/format'
import {
  CaretRightFilled,
  MoreOutlined,
  NumberOutlined,
  SmileOutlined
} from '@ant-design/icons-vue'
import ListContent from '@/components/modules/ListContent/ListContent.vue'

const route = useRoute()
const albumInfo = ref({})
const albumDynamicDetail = ref({})
const globalStore = useGlobalStore()
const init = async () => {
  if (route.query.id) {
    const res = await getAlbumDetail(route.query.id)
    albumInfo.value = res
    if (albumInfo.value.album.picUrl) {
      getDominantColor(albumInfo.value.album.picUrl).then((color) => {
        globalStore.setBackgroundStyle(color)
      })
    }
    albumDynamicDetail.value = await getAlbumDynamicDetail(route.query.id)
    // console.log(albumInfo.value)
  }
}

onMounted(async () => {
  await init()
})

const activeName = ref('songs')
// 发表评论功能
const myComment = ref('')

// 跳转歌单创建者中心
const router = useRouter()
const navigateToUserCenter = (id) => {
  if (id) router.push(`/user?uid=${id}`)
  else ElNotification.warning('歌手暂未入驻')
}
</script>

<template>
  <div class="album-container fd-col duration-1000 wh-full">
    <div class="album-header flex rounded-20 duration-100">
      <CardContainer class="wh-full">
        <div class="content flex p-20 fw-600">
          <div class="avatar-box f-c wh-200 rounded-10 bg-#ffffff1a relative">
            <img
              :src="albumInfo.album?.picUrl"
              alt=""
              class="wh-full rounded-10"
            />
            <div class="msk-img wh-full absolute"></div>
          </div>
          <div class="album-info fd-col f-1 ml-30 justify-between">
            <div class="album-name fs-24 fw-600">
              {{ albumInfo.album?.name }}
            </div>
            <div class="album-artist f-s translate-y--110%">
              <div class="artist-avatar wh-25 rounded-50% f-c">
                <img
                  :src="albumInfo.album?.artist?.picUrl"
                  alt=""
                  class="wh-full rounded-50%"
                />
              </div>
              <div
                class="artist-name ml-8 color-#85b9e6 cursor-pointer hover: color-#96c8e6"
                @click="navigateToUserCenter(albumInfo.album?.artist?.userId)"
              >
                {{ albumInfo.album?.artist?.name }}
              </div>
              <div class="create-time ml-15">
                {{ formatTimestampDay(albumInfo.album?.publishTime) }} 发布
              </div>
            </div>
            <div class="album-handle f-s">
              <div class="btn bgi">
                <CaretRightFilled />
                <span>播放全部</span>
              </div>
              <div class="btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    d="M9.113 8.8c.34-.297.744-.526 1.19-.661l.247-.065l.16-.03l.176-.025l.18-.015l.184-.005h7.5a3.25 3.25 0 0 1 3.245 3.065l.005.185v7.5a3.25 3.25 0 0 1-3.066 3.245l-.184.005h-7.5a3.25 3.25 0 0 1-3.245-3.066L8 18.75v-7.5l.003-.149l.014-.19l.026-.191l.036-.186l.059-.223l.08-.236l.087-.202l.082-.162l.094-.163l.146-.217l.094-.123l.135-.156l.108-.112zM15 11a.75.75 0 0 0-.743.648l-.007.102v2.499h-2.5a.75.75 0 0 0-.743.648l-.007.102c0 .38.282.693.648.743l.102.007h2.5v2.501c0 .38.282.694.648.743L15 19a.75.75 0 0 0 .743-.648l.007-.102v-2.501h2.5a.75.75 0 0 0 .743-.649L19 15a.75.75 0 0 0-.648-.743l-.102-.007h-2.5v-2.5a.75.75 0 0 0-.648-.743zm.582-6.767l.052.177l.694 2.588H11.25A4.25 4.25 0 0 0 7 11.249v6.434a3.25 3.25 0 0 1-2.895-2.228l-.052-.176l-1.941-7.245a3.25 3.25 0 0 1 2.12-3.928l.178-.052l7.244-1.941a3.25 3.25 0 0 1 3.928 2.12"
                  ></path>
                </svg>
                <span> {{ albumDynamicDetail.subCount }}</span>
              </div>
              <div class="btn f-s">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="wh-20"
                  fill="white"
                >
                  <path
                    d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
                  />
                </svg>
                <span>下载</span>
              </div>
              <div class="btn">
                <MoreOutlined :rotate="90" />
              </div>
            </div>
          </div>
        </div>
      </CardContainer>
    </div>
    <div class="album-content m-y-30 m-x-15">
      <CardContainer class="wh-full">
        <div class="tab-content p-20 p-t-0">
          <el-tabs v-model="activeName" class="demo-class">
            <el-tab-pane name="songs">
              <template #label>
                <span>歌曲</span>
                <span class="s-count fw-400 fs-12">{{
                  albumInfo.album?.size
                }}</span>
              </template>
              <div class="song-list-container">
                <ListContent
                  :songList="albumInfo.songs"
                  :isPic="false"
                  :isPop="true"
                ></ListContent>
              </div>
            </el-tab-pane>
            <el-tab-pane name="comments">
              <template #label>
                <span>评论</span>
                <span class="s-count fw-400 fs-12">{{
                  albumDynamicDetail.commentCount
                }}</span>
              </template>
              <div class="comments-area">
                <div
                  class="my-comment rounded-20 mb-40 bg-#ffffff1a h-110 relative pt-5"
                >
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
                  :type="3"
                  :id="route.query.id"
                ></CommentArea>
                <CommentArea
                  :is-brief="false"
                  title="最新评论"
                  :type="3"
                  :id="route.query.id"
                ></CommentArea>
              </div>
            </el-tab-pane>
            <el-tab-pane name="desc" label="专辑详情">
              <div class="desc-content fd-col">
                <div class="desc-title fw-600 fs-18 mb-10">专辑介绍</div>
                <div class="desc-text">
                  <p
                    class="txt mb-8 color-#d2d2d2cc"
                    v-for="(p, i) in albumInfo.album?.description.split('\n')"
                    :key="i"
                  >
                    {{ p }}
                  </p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </CardContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.album-header {
  width: calc(87vw - 180px);
  margin: 0 auto;
  box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
  .msk-img {
    z-index: -1;
    background-image: url('@/assets/bg1.png');
    background-size: cover;
    background-repeat: no-repeat;
    transform: translateY(-10%);
  }
}
.btn {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #ffffff33;
  padding: 3px 15px;
  font-size: 14px;
  margin-right: 15px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.bgi {
  background-image: linear-gradient(#ff1168, #fc3d49);
}

:deep(.el-tabs__nav-wrap) {
  &::after {
    height: 0;
  }
}
:deep(.el-tabs__item) {
  font-size: 16px;
  color: #969696;
  &.is-active {
    color: #fff;
    font-size: 18px;
    font-weight: 800;
  }
}
:deep(.el-tabs__active-bar) {
  background-color: #ec4141;
  height: 2px;
}
:deep(.el-loading-mask) {
  background-color: transparent;
}
:deep(.s-count) {
  transform: translate(30%, -30%);
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
</style>
