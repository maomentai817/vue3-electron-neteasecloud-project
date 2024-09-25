<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>{{ route.query.keywords }}</template>

<style lang="scss" scoped></style>
