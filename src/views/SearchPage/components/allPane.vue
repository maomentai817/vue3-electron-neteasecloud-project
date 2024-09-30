<script setup>
import RecommendSong from '@/components/modules/RecommendSong/RecommendSong.vue'
import { formatNumber } from '@/utils/format'
import squareItem from './squareItem.vue'
import mvBox from '@/views/SingerCenter/components/mvBox.vue'
import simiSinger from '@/views/SingerCenter/components/simiSinger.vue'
import userItem from './userItem.vue'
import { highlight } from '@/utils/format'

defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  first: {
    type: Object,
    default: () => {}
  },
  follower: {
    type: Number,
    default: 0
  },
  kw: {
    type: String,
    default: ''
  },
  mv: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['pane'])
const paneChange = (e) => {
  emit('pane', e)
}
</script>

<template>
  <div class="all-pane-container fd-col mt-20">
    <div
      class="first-line f-s p-15 rounded-15 cursor-pointer w-40%"
      v-if="first?.id"
    >
      <div class="left">
        <div class="cover-img wh-60 rounded-50% relative">
          <img :src="first.picUrl" alt="" class="wh-full rounded-50%" />
          <div class="msk wh-full top-0 left-0 absolute rounded-50%">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              fill="#fff"
              class="absolute top-50% left-50% translate-x--45% translate-y--50%"
              width="26"
              height="26"
            >
              <path
                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="right fd-col justify-between ml-15 h-60">
        <div class="title fs-18 fw-600 color-#fff">
          歌手: <span v-html="highlight(first.name, kw)"></span>
        </div>
        <div class="info f-b">
          <div class="count mr-15">专辑: {{ first.albumSize }}</div>
          <div class="funs">粉丝: {{ formatNumber(follower) }}</div>
        </div>
      </div>
    </div>
    <div class="song mt-20" v-if="data?.song?.songs">
      <div
        class="title fw-600 fs-20 color-#fff cursor-pointer w-12%"
        @click="paneChange('首单曲')"
      >
        单曲 >
      </div>
      <div class="song-content mt-10 f-b flex-wrap">
        <template
          v-for="(item, index) in data?.song?.songs.slice(0, 6)"
          :key="index"
        >
          <RecommendSong :item="item" :kw="kw" class="w-49%" />
        </template>
      </div>
    </div>
    <div class="playlist mt-20" v-if="data?.playList?.playLists">
      <div
        class="title fw-600 fs-20 color-#fff cursor-pointer w-12%"
        @click="paneChange('个歌单')"
      >
        歌单 >
      </div>
      <div class="play-list-content mt-10 f-b">
        <template
          v-for="(item, index) in data?.playList?.playLists?.slice(0, 4)"
          :key="index"
        >
          <div class="w-25%">
            <squareItem
              :item="item"
              :kw="kw"
              type="playlist"
              @click="$router.push(`/play-list?id=${item?.id}`)"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="mv mt-20" v-if="mv">
      <div
        class="title fw-600 fs-20 color-#fff cursor-pointer w-12%"
        @click="paneChange('个MV')"
      >
        MV >
      </div>
      <div class="mv-content f-s">
        <!-- <mvBox :mv="mv" :img="mv?.cover" /> -->
        <template v-for="(item, index) in mv" :key="index">
          <mvBox
            :mv="item"
            :img="item?.cover"
            :kw="kw"
            class="mr-25"
            @click="$router.push(`/mv?id=${item?.id}`)"
          />
        </template>
      </div>
    </div>
    <div class="dj mt-20" v-if="data?.voicelist?.resources">
      <div
        class="title fw-600 fs-20 color-#fff cursor-pointer w-12%"
        @click="paneChange('video')"
      >
        播单 >
      </div>
      <div class="dj-content mt-10 f-s">
        <template
          v-for="(item, index) in data?.voicelist?.resources?.slice(0, 3)"
          :key="index"
        >
          <div class="w-25%">
            <squareItem :item="item?.baseInfo" type="dj" :kw="kw" />
          </div>
        </template>
      </div>
    </div>
    <div class="artist mt-20" v-if="data?.artist?.artists">
      <div
        class="title fw-600 fs-20 color-#fff cursor-pointer w-12%"
        @click="paneChange('位歌手')"
      >
        歌手 >
      </div>
      <div class="artist-content f-s">
        <template v-for="(item, index) in data?.artist?.artists" :key="index">
          <simiSinger :singer="item" :kw="kw" class="m-r-10" />
        </template>
      </div>
    </div>
    <div class="album mt-20" v-if="data?.album?.albums">
      <div
        class="title fw-600 fs-20 color-#fff cursor-pointer w-12%"
        @click="paneChange('张专辑')"
      >
        专辑 >
      </div>
      <div class="album-content mt-10 f-s">
        <template v-for="(item, index) in data?.album?.albums" :key="index">
          <div class="w-25%">
            <squareItem
              :item="item"
              :kw="kw"
              type="album"
              @click="$router.push(`/album?id=${item?.id}`)"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="user mt-20" v-if="data?.user?.users">
      <div
        class="title fw-600 fs-20 color-#fff cursor-pointer w-12%"
        @click="paneChange('个用户')"
      >
        用户 >
      </div>
      <div class="user-content f-s">
        <template v-for="(item, index) in data?.user?.users" :key="index">
          <div class="w-25%">
            <userItem
              :user="item"
              :kw="kw"
              class="m-r-10"
              @click="$router.push(`/user?uid=${item?.userId}`)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.first-line {
  transition: all 0.3s;
  &:hover {
    background-color: #ffffff1f;
    .msk {
      opacity: 1;
    }
  }
  .msk {
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
