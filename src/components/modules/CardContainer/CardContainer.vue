<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <el-card class="page-container rounded-20 color-#d2d2d2">
    <template #header v-if="title">
      <div class="header f-b">
        <b>{{ title }}</b>
        <div class="extra f-s">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <div class="content h-full fd-col">
      <slot></slot>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  box-sizing: border-box;
  background-color: #ffffff1a;
  border: none;
  :deep(.el-card__header) {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  :deep(.el-card__body) {
    padding-top: 12px;
    padding-bottom: 12px;
    overflow: auto;
    height: 100%;
  }
  .content {
    max-height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none !important;
    }
  }
}
</style>
