<script setup>
import { ref, onUnmounted } from 'vue'
import { getLoginQr, getLoginQrKey, getLoginQrSta } from '@/api/login'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'

const dialogVisible = ref(false)
const key = ref('')
const qrUrl = ref('')
const flag = ref(false) // 是否授权中
const isSucceed = ref(false)
let timer = null
const userStore = useUserStore()

const init = async () => {
  const {
    data: { unikey }
  } = await getLoginQrKey()
  key.value = unikey
  // 之前
  const {
    data: { qrimg }
  } = await getLoginQr(key.value, true)
  qrUrl.value = qrimg
  // end

  timer = setInterval(async () => {
    // 状态验证
    // 800 二维码不存在或已过期, 801 等待扫码, 802 授权中, 803 授权登录成功
    const { code, message, cookie } = await getLoginQrSta(key.value)
    if (code === 800) {
      clearInterval(timer)
      init()
    } else if (code === 802) {
      flag.value = true
    } else if (code === 803) {
      clearInterval(timer)
      isSucceed.value = true
      localStorage.setItem('MUSIC_U', cookie)
      console.log(message)
      ElMessage.success('授权登录成功')
      dialogVisible.value = false
      // 获取用户信息
      userStore.getUserInfo()
      userStore.getPlayList()
    }
  }, 3000)
  return timer
}

onUnmounted(() => {
  clearInterval(timer)
})

const show = () => {
  dialogVisible.value = true
  init()
}

const close = () => {
  flag.value = false
  isSucceed.value = false
  dialogVisible.value = false
  clearInterval(timer)
}

defineExpose({ show, dialogVisible })
</script>

<template>
  <el-dialog
    @close="close"
    v-model="dialogVisible"
    title="使用网易云音乐app扫码登录"
    width="30%"
    class="login"
    draggable="true"
  >
    <div>
      <img v-if="!flag" :src="qrUrl" alt="" id="qr-img" />
      <h1 v-else>{{ isSucceed ? '授权登陆成功' : '授权中...' }}</h1>
    </div>
    <template v-if="false" #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-dialog) {
  backdrop-filter: blur(60px) saturate(210%);
  background-color: rgba(40, 40, 40, 0.7);
}
:deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
}
:deep(.el-dialog__title) {
  color: #d2d2d2;
}
</style>
