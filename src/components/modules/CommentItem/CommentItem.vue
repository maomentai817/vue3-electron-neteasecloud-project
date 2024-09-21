<script setup>
defineProps({
  comment: {
    type: Object,
    default: () => {}
  }
})
</script>

<template>{{ comment.content }}</template>

<style lang="scss" scoped></style>
