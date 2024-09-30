<script setup>
import { formatNumber, formatTimestampDay, highlight } from '@/utils/format'

defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: 'playlist'
  },
  kw: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    class="pane-list-item p-x-10 rounded-10 fs-13 cursor-pointer"
    @click="
      $router.push(
        type === 'playlist'
          ? `/play-list?id=${item.id}`
          : `/album?id=${item.id}`
      )
    "
  >
    <div class="pane-item-content f-b h-70 fw-600 color-#969696">
      <div class="item-id relative w-8%">
        <span class="id-count opacity-100">{{
          index.toString().padStart(2, '0')
        }}</span>
        <span class="icon absolute top-0 left-0 opacity-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="wh-20"
            fill="#d2d2d2cc"
          >
            <path
              d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
            />
          </svg>
        </span>
      </div>
      <div class="item-name f-1 text-overflow pr-30 f-s">
        <div class="cover-img w-4.5vw h-4.5vw rounded-15 flex-shrink-0">
          <img
            :src="item?.coverImgUrl || item?.picUrl"
            alt=""
            class="wh-full rounded-15"
          />
        </div>
        <div class="name fs-14 ml-20 text-overflow pr-30">
          <span v-html="highlight(item?.name, kw)"></span>
        </div>
      </div>
      <template v-if="type === 'playlist'">
        <div class="item-num w-12%">{{ item?.trackCount }}首</div>
        <div
          class="item-creator w-20% text-overflow pr-30 hover:color-#fff"
          @click.stop="$router.push(`/user?uid=${item?.creator?.userId}`)"
        >
          {{ item?.creator?.nickname }}
        </div>
        <div class="item-count w-12%">{{ formatNumber(item?.playCount) }}</div>
      </template>
      <template v-else-if="type === 'album'">
        <div class="item-artist w-24% text-overflow flex-shrink-0 pr-20 mr-10">
          <span
            v-for="(artist, index) in item?.artists"
            :key="index"
            class="artist-item"
          >
            <span
              class="hover:color-#fff"
              @click.stop="$router.push(`/singer?id=${artist.id}`)"
              >{{ artist.name }}</span
            >
            <span v-if="index !== item?.artists.length - 1">/</span>
          </span>
        </div>
        <div class="item-publish w-20%">
          {{ formatTimestampDay(item?.publishTime) }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pane-list-item {
  &:hover {
    background-color: #ffffff0f !important;
    .id-count {
      opacity: 0;
    }
    .icon {
      opacity: 1;
    }
  }
}
</style>
