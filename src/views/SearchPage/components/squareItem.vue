<script setup>
import { formatNumber, formatTimestampDay, highlight } from '@/utils/format'

defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  type: {
    type: String,
    default: 'dj'
  },
  kw: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    class="dj-item m-r-15 fd-col rounded-15 relative cursor-pointer p-b-15 flex-shrink-0"
  >
    <div
      class="play-count absolute color-#fff fw-600 fs-13 top-2.5% right-5% z-10"
      v-if="item?.playCount"
    >
      ▶{{ formatNumber(item?.playCount) }}
    </div>
    <div class="msk wh-full absolute z-9 top-0 left-0 rounded-15"></div>
    <div class="cover-img w-full rounded-15 aspect-ratio-square">
      <img
        :src="item?.intervenePicUrl || item?.picUrl || item?.coverImgUrl"
        alt=""
        class="wh-full rounded-15 filter-brightness-90 aspect-ratio-square object-fill"
      />
      <div class="icon absolute right-5% translate-y--120% wh-50 rounded-50%">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 16 16"
          class="absolute top-50% left-50% translate-x--50% translate-y--50%"
        >
          <!-- 定义遮罩 -->
          <defs>
            <mask id="svg-mask">
              <!-- 白色的圆圈区域 -->
              <circle cx="8" cy="8" r="8" fill="white" />
              <!-- 用来镂空的箭头部分 -->
              <path
                d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"
                fill="black"
                transform="scale(0.75) translate(2.8, 2.8)"
              ></path>
            </mask>
          </defs>

          <!-- 圆圈填充白色，并应用遮罩 -->
          <circle cx="8" cy="8" r="8" fill="white" mask="url(#svg-mask)" />
        </svg>
      </div>
    </div>
    <div class="info fd-col mt-10 pl-20 p-r-10">
      <div class="name color-#fff text-overflow">
        <span v-html="highlight(item?.name, kw)"></span>
      </div>
      <div class="dj-info f-s fs-12" v-if="type === 'dj'">
        <div class="voice mr-8 flex-shrink-0">
          声音: {{ item?.programCount }}
        </div>
        <div class="djer text-overflow">by {{ item?.dj?.nickname }}</div>
      </div>
      <div class="al-info f-s fs-10" v-if="type === 'album'">
        <div class="artist m-r-8 f-1 text-overflow z-1000">
          <template v-for="(artist, index) in item?.artists" :key="artist.id">
            <span class="text-overflow color-#969696 hover:color-#fff">{{
              artist.name
            }}</span>
            <span v-if="index !== item?.artists?.length - 1" class="m-x-2"
              >/</span
            >
          </template>
        </div>
        <div class="date w-48% flex-shrink-0 color-#969696">
          {{ formatTimestampDay(item?.publishTime) }}
        </div>
      </div>
      <div class="pl-creator fs-11 mt-3" v-if="type === 'playlist'">
        {{ item?.creator?.nickname }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dj-item {
  transition: opacity 0.5s;
  &:hover {
    .msk {
      opacity: 1;
    }
    .icon {
      opacity: 1;
    }
  }
  .msk {
    background-color: #ffffff1f;
    opacity: 0;
  }
  .icon {
    opacity: 0;
  }
}
</style>
