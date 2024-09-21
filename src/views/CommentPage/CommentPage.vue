<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="comment-page-containe p-x-20">
    <CommentArea
      :is-brief="false"
      :title="route.query.title"
      :type="route.query.type"
      :id="route.query.id"
    ></CommentArea>
  </div>
</template>

<style lang="scss" scoped></style>
