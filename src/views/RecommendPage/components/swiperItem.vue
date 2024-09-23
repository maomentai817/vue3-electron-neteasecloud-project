<script setup>
import { getDominantColor } from '@/utils/getMainColor'
import { formatNumber } from '@/utils/format'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSongListDetail } from '@/api/music'

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  img: {
    type: String,
    default: ''
  },
  idx: {
    type: Number,
    default: -1
  }
})

const mainColor = ref('')
const top3 = ref([])

onMounted(async () => {
  if (props.img) {
    mainColor.value = await getDominantColor(props.img)
  }
  const res = await getSongListDetail(props.item?.id, 0, 3)
  top3.value = res.songs.map((item) => item.name)
})

const router = useRouter()
const navgateToPlaylist = (id) => {
  router.push(`/play-list?id=${id}`)
}
</script>

<template>
  <div
    class="swiper-item-container h-200 w-full rounded-15 relative cursor-pointer m-x-8"
    :style="{ backgroundImage: `url(${img})` }"
    @click="navgateToPlaylist(item.id)"
  >
    <div class="count fs-12 fw-600 absolute top-5 right-5">
      {{ formatNumber(item.playCount || item.playcount) }}
    </div>
    <div
      class="info w-full h-50 absolute left-0 bottom-0"
      :style="{ backgroundColor: mainColor }"
    >
      <div class="txt absolute p-x-10 p-t-3 w-full">
        <div class="brief wh-full color-#fff">
          {{ item.name }}
        </div>
        <div class="top3 w-60% mt-3">
          <p class="text-overflow fs-12 fw-400">
            {{ top3[0] ? `1 ${top3[0]}` : '' }}
          </p>
          <p class="text-overflow fs-12 fw-400">
            {{ top3[1] ? `2 ${top3[1]}` : '' }}
          </p>
          <p class="text-overflow fs-12 fw-400">
            {{ top3[2] ? `3 ${top3[2]}` : '' }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="msk wh-35 rounded-50% absolute f-c absolute bottom-15 right-10 bg-#fff"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        width="20"
        height="20"
        :style="{ fill: mainColor }"
      >
        <path
          d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
        />
      </svg>
    </div>
    <div
      class="cover wh-full absolute top-0 right-0 rounded-15"
      :style="{
        backgroundImage: `linear-gradient(transparent 0%, ${mainColor} 40%)`
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.nth1 {
  margin-left: 0;
}
.nthl {
  margin-right: 0;
}
.swiper-item-container {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  .count {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  }
  &:hover {
    box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
    .msk {
      opacity: 1;
    }
    .cover {
      opacity: 1;
    }
    .info {
      .txt {
        transform: translateY(-60%);
      }
    }
  }
  .info {
    z-index: 10;
    .txt {
      transition: all 0.3s;
      .brief {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        &::after {
          content: '';
          display: inline-block;
          width: 100%;
          visibility: hidden; /* 隐藏的伪元素占用第二行空间 */
          line-height: inherit;
        }
      }
      .top3 {
        color: #fff;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
      }
    }
  }
  .msk {
    opacity: 0;
    transition: all 0.3s;
    z-index: 11;
  }
  .cover {
    opacity: 0;
    transition: all 0.3s;
  }
}
</style>
