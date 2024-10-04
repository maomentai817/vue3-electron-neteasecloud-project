<script setup>
import { computed } from 'vue'
import { useMusicStore, useGlobalStore } from '@/stores'

const props = defineProps({
  song: {
    type: Object,
    default: () => {}
  },
  duration: {
    type: Number,
    default: 0
  }
})

const musicStore = useMusicStore()
const globalStore = useGlobalStore()

const model = computed({
  get: () => (musicStore.currentTime / props.duration) * 100,
  set: (val) => musicStore.updateTime((val * props.duration) / 100)
})

const emit = defineEmits(['change'])
const change = (val) => {
  emit('change', (val * props.duration) / 100)
}
</script>

<template>
  <el-slider
    v-model="model"
    @change="change"
    :show-tooltip="false"
    :show-stops="false"
    :step="0.000001"
    class="w-full items-end!"
    v-if="song?.id"
  />
</template>

<style lang="scss" scoped>
:deep(.el-slider__button-wrapper) {
  cursor: pointer !important;
  display: none;
}
:deep(.el-slider__button) {
  display: none;
}
:deep(.el-slider__runway) {
  height: 1px;
  width: 100%;
  // padding: 15px 0;
  background-color: transparent;
}
:deep(.el-slider__bar) {
  height: 1px;
  background-color: rgb(236, 65, 65);
  border-radius: 0;
}
:deep(.el-slider) {
  width: 100%;
  align-items: end;
}
</style>
<style lang="scss">
.music-player-container {
  .desc-content {
    .el-slider__bar {
      height: 6px;
      background-image: linear-gradient(
        to right,
        v-bind('globalStore.colors[0]'),
        v-bind('globalStore.colors[1]')
      );
      opacity: 0.8;
      border-radius: 6px;
      background-color: transparent;
    }
  }
}
</style>
