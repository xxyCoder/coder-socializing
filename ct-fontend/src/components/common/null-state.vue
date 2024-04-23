<template>
  <div class="null-state">
    <img src="@/assets/logo.png">
    <h1>请先登录~</h1>
    <router-link to="/login">去登录</router-link>
  </div>
</template>

<style scoped lang="scss">
@import "../../common/style/func.scss";

.null-state {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    height: responsive(200, vh);
  }
}
</style>