<template>
  <div class="layout-auth">
    <div class="auth-box">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f8;
  padding: 1rem;

  .auth-box {
    width: 100%;
    max-width: 420px;
  }
}
</style>