<script setup>
import { useRouter } from 'vue-router'

defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})

const play = () => {
  console.log(111)
}

const router = useRouter()
const navigateToSinger = (id) => {
  router.push(`/singer?id=${id}`)
}

const navigateToMV = (id) => {
  router.push(`/mv?id=${id}`)
}
</script>

<template>
  <div
    class="re-song-item flex cursor-pointer w-35vw p-10 rounded-15"
    @click="play"
  >
    <div class="left wh-60 rounded-15 bg-#d2d2d2 flex-shrink-0">
      <img
        v-img-lazy="item.al?.picUrl || item.album?.picUrl"
        alt=""
        class="wh-full rounded-15"
      />
    </div>
    <div class="right fd-col ml-12 w-25vw justify-between mb-10 fs-13">
      <div class="name fw-600 fs-16 text-overflow">{{ item.name }}</div>
      <div class="info f-s color-#ff3a3a">
        <div
          class="reason fs-12 fw-600 rounded-3 p-x-2 bo-#ec4141 mr-5 max-w-8vw"
          v-if="item.reason"
        >
          {{ item.reason }}
        </div>
        <div
          class="vip fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
          v-if="item.fee === 1"
        >
          vip
        </div>
        <div
          class="mv fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
          v-if="item.mv !== 0"
          @click.stop="navigateToMV(item.mv)"
        >
          mv&#9654;
        </div>
        <div
          class="origin fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
          v-if="item.originCoverType === 1"
        >
          原唱
        </div>
        <div class="artisrs f-s text-overflow f-1" v-if="item.ar">
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
          <template v-for="(a, i) in item.artists" :key="i">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.re-song-item {
  &:hover {
    background-color: #ffffff1f;
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
