<script setup>
import { highlight } from '@/utils/format'

defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  kw: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    class="user-item-container fd-col items-center cursor-pointer mt-10 p-y-15 p-x-10 rounded-12 w-full"
  >
    <div
      class="img-box rounded-50% f-c mb-10 relative"
      :style="{ backgroundImage: `url(${user.avatarUrl})` }"
    >
      <div class="msk wh-full rounded-50% absolute f-c">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="white"
        >
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
      </div>
      <div
        class="v w-2.5vw h-2.5vw absolute bottom-0 right-0 z-10"
        v-if="user?.avatarDetail?.identityIconUrl"
      >
        <img
          :src="user?.avatarDetail?.identityIconUrl"
          alt=""
          class="wh-full"
        />
      </div>
    </div>
    <div class="info fd-col w-full">
      <div class="name fs-17 self-center f-b">
        <span class="mr-5"
          ><span v-html="highlight(user.nickname, kw)"></span
        ></span>
        <span v-if="user?.gender === 1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 512 512"
          >
            <path
              fill="#33abff"
              d="M442 48h-90a22 22 0 0 0 0 44h36.89l-60.39 60.39c-68.19-52.86-167-48-229.54 14.57C31.12 234.81 31.12 345.19 99 413a174.21 174.21 0 0 0 246 0c62.57-62.58 67.43-161.35 14.57-229.54L420 123.11V160a22 22 0 0 0 44 0V70a22 22 0 0 0-22-22M313.92 381.92a130.13 130.13 0 0 1-183.84 0c-50.69-50.68-50.69-133.16 0-183.84s133.16-50.69 183.84 0s50.69 133.16 0 183.84"
            ></path>
          </svg>
        </span>
        <span v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 48 48"
          >
            <g
              fill="none"
              stroke="#ee699b"
              stroke-linejoin="round"
              stroke-width="4"
            >
              <path
                d="M38.379 9.851c-5.468-5.467-14.332-5.467-19.8 0a13.96 13.96 0 0 0-4.1 9.9a13.96 13.96 0 0 0 4.1 9.9c5.468 5.467 14.332 5.467 19.8 0c5.467-5.468 5.467-14.332 0-19.8Z"
              ></path>
              <path
                stroke-linecap="round"
                d="M18.464 29.535L5.736 42.263m13.435-.707L6.443 28.828"
              ></path>
            </g>
          </svg>
        </span>
      </div>
      <div
        class="signature fs-12 text-overflow text-center"
        v-if="user?.signature"
      >
        <span v-html="highlight(user.signature, kw)"></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-item-container {
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
    :deep(.img-box .msk) {
      z-index: 2;
      opacity: 1;
    }
  }
  .img-box {
    width: calc(15vw - 30px);
    height: calc(15vw - 30px);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .msk {
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: 0.3s ease;
      svg {
        width: 35%;
        height: 35%;
      }
    }
  }
}
</style>
