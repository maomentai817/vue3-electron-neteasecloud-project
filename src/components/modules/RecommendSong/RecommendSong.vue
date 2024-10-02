<script setup>
import { useRouter } from 'vue-router'
import { highlight } from '@/utils/format'

defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  kw: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const navigateToSinger = (id) => {
  router.push(`/singer?id=${id}`)
}

const navigateToMV = (id) => {
  router.push(`/mv?id=${id}`)
}
</script>

<template>
  <div class="re-song-item f-s cursor-pointer w-35vw p-10 rounded-15">
    <div class="left wh-60 rounded-15 bg-#d2d2d2 flex-shrink-0 relative">
      <img
        :src="item?.al?.picUrl || item?.album?.picUrl"
        alt=""
        class="wh-full rounded-15"
      />
      <div class="msk wh-full top-0 left-0 absolute rounded-15">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="#d2d2d2"
          class="absolute top-50% left-50% translate-x--50% translate-y--50%"
          width="22"
          height="22"
        >
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
      </div>
    </div>
    <div class="right fd-col ml-12 w-25vw justify-between fs-13 h-60">
      <div class="name fw-600 fs-16 text-overflow">
        <span v-html="highlight(item?.name, kw)"></span>
      </div>
      <div class="info f-s color-#ff3a3a">
        <div
          class="reason fs-12 fw-600 rounded-3 p-x-2 bo-#ec4141 mr-5 max-w-8vw text-overflow"
          v-if="item?.reason"
        >
          {{ item.reason }}
        </div>
        <div
          class="vip fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
          v-if="item?.fee === 1"
        >
          vip
        </div>
        <div
          class="mv fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
          v-if="item?.mv !== 0"
          @click.stop="navigateToMV(item.mv)"
        >
          mv&#9654;
        </div>
        <div
          class="origin fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
          v-if="item?.originCoverType === 1"
        >
          原唱
        </div>
        <div class="artisrs f-s text-overflow f-1" v-if="item?.ar">
          <template v-for="(a, i) in item.ar" :key="i">
            <div
              class="artist color-#d2d2d2cc"
              @click.stop="navigateToSinger(a.id)"
            >
              {{ a.name }}
            </div>
            <span class="color-#d2d2d2cc m-x-2" v-if="i < item.ar.length - 1"
              >/</span
            >
          </template>
        </div>
        <div class="artisrs f-s text-overflow f-1" v-else>
          <template v-for="(a, i) in item?.artists" :key="i">
            <div
              class="artist color-#d2d2d2cc"
              @click.stop="navigateToSinger(a.id)"
            >
              {{ a.name }}
            </div>
            <span
              class="color-#d2d2d2cc m-x-2"
              v-if="i < item.artists.length - 1"
              >/</span
            >
          </template>
        </div>
      </div>
      <div class="alia fs-12" v-if="item?.alia && item?.alia?.length">
        <span v-html="highlight(item.alia[0], kw)"></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.re-song-item {
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
  .reason {
    background-color: #37242a;
    line-height: 1.2;
  }
  .vip,
  .mv,
  .origin {
    background-color: transparent;
    line-height: 1.2;
  }
  .artist {
    &:hover {
      color: #d2d2d2;
    }
  }
}
</style>
