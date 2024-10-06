<script setup>
import { useMusicStore, useUserStore } from '@/stores'
import { computed, watch } from 'vue'

const musicStore = useMusicStore()
const userStore = useUserStore()

const timerTansform = (seconds) => {
  // 将秒转换为 xx:xx
  const minutes = Math.floor(seconds / 60)
  const secondLeft = seconds % 60
  return `${('0' + minutes).slice(-2)}:${('0' + secondLeft).slice(-2)}`
}

// 音量控制
const model = computed({
  get: () => userStore.volume * 100,
  set: (val) => (userStore.volume = val / 100)
})
const volumeHandler = (target) => {
  model.value = target ? 0 : userStore.volume * 100
}

const change = (val) => {
  model.value = val
  userStore.volume = val / 100
}

const emit = defineEmits(['input', 'volume'])
const input = (val) => {
  emit('input', val / 100)
}

watch(
  () => model.value,
  (val) => {
    emit('volume', val / 100)
  }
)
</script>

<template>
  <div class="detail-right f-s fs-13" v-if="musicStore.songInfo?.id">
    <div class="timer f-b m-r-10% w-105">
      <span class="current w-50 flex-shrink-0">{{
        timerTansform(parseInt(musicStore.currentTime))
      }}</span>
      <span class="mr-5">/</span>
      <span class="duration w-50">{{
        timerTansform(musicStore.songInfo?.dt / 1000)
      }}</span>
    </div>
    <div class="list-draw cp m-r-8%">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <g id="indent_increase_fill" fill="none">
            <path
              d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
            />
            <path
              fill="#d2d2d2"
              d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-5a1.5 1.5 0 0 1 0 3h-9a1.5 1.5 0 0 1 0-3zM3.643 9.173l.29.152.344.188c.062.034.126.07.191.108l.416.244.457.282a24.355 24.355 0 0 1 .953.635l.407.292.183.136.46.355.124.1c.214.173.205.52-.02.702l-.261.207-.319.242-.375.274-.429.3-.234.158-.247.163c-.17.11-.332.212-.488.308l-.445.268-.398.229-.346.189-.29.15c-.253.13-.525-.036-.551-.332l-.04-.51-.036-.65-.018-.504-.01-.556v-.608l.011-.586.02-.527.026-.464.042-.566c.027-.316.325-.51.583-.38ZM20 7.5a1.5 1.5 0 0 1 0 3h-9a1.5 1.5 0 0 1 0-3zm0-5a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z"
            />
          </g>
        </svg>
      </span>
    </div>
    <div class="volume f-s">
      <div class="icon cp m-r-10 f-c">
        <span v-if="model > 0" @click="volumeHandler(true)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <g id="volume_fill" fill="none">
              <path
                d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
              />
              <path
                fill="#d2d2d2"
                d="M13.26 3.3a1.1 1.1 0 0 1 1.734.78l.006.114v15.612a1.1 1.1 0 0 1-1.643.957l-.096-.062L6.68 16H4a2 2 0 0 1-1.995-1.85L2 14v-4a2 2 0 0 1 1.85-1.995L4 8h2.68zm6.407 3.483A6.985 6.985 0 0 1 22 12a6.985 6.985 0 0 1-2.333 5.217 1 1 0 1 1-1.334-1.49A4.985 4.985 0 0 0 20 12c0-1.48-.642-2.81-1.667-3.727a1 1 0 1 1 1.334-1.49m-2 2.236A3.992 3.992 0 0 1 19 11.999a3.991 3.991 0 0 1-1.333 2.982 1 1 0 0 1-1.422-1.4l.088-.09c.41-.368.667-.899.667-1.491a1.99 1.99 0 0 0-.548-1.376l-.119-.115a1 1 0 1 1 1.334-1.49"
              />
            </g>
          </svg>
        </span>
        <span v-else @click="volumeHandler(false)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <g id="volume_off_fill" fill="none">
              <path
                d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
              />
              <path
                fill="#d2d2d2"
                d="M4.596 8 15 18.404v1.402a1.1 1.1 0 0 1-1.74.895L6.68 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM15 4.194v9.392l1.113 1.113a1 1 0 0 1 .132-1.119l.088-.089c.41-.368.667-.899.667-1.491a1.99 1.99 0 0 0-.548-1.376l-.119-.115a1 1 0 0 1 1.334-1.49A3.993 3.993 0 0 1 19 12a3.99 3.99 0 0 1-1.333 2.981 1 1 0 0 1-1.13.142l1.47 1.47a.999.999 0 0 1 .326-.866A4.985 4.985 0 0 0 20 12c0-1.48-.642-2.81-1.667-3.727a1 1 0 1 1 1.334-1.49A6.985 6.985 0 0 1 22 12a6.985 6.985 0 0 1-2.333 5.217.998.998 0 0 1-.788.248l1.606 1.606a1 1 0 0 1-1.414 1.414L3.515 4.93a1 1 0 1 1 1.414-1.414L8.275 6.86l4.986-3.562A1.1 1.1 0 0 1 15 4.194"
              />
            </g>
          </svg>
        </span>
      </div>
      <el-slider
        v-model="model"
        @change="change"
        @input="input"
        :show-tooltip="false"
        :show-stops="false"
        style="width: 80px; overflow: hidden"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-slider__button-wrapper) {
  cursor: pointer !important;
  width: 1px;
  height: 1px;
}
:deep(.el-slider__button) {
  display: none;
}
:deep(.el-slider__bar) {
  background-color: rgb(236, 65, 65) !important;
  height: 5px;
  border-radius: 3px;
}
:deep(.el-slider__runway) {
  height: 5px;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
