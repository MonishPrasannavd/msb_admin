<template>
  <div class="auth-pre-layout">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'AuthPreLayout'
}
</script>

<style scoped>
.auth-pre-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style> 