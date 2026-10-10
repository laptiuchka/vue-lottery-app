<template>
  <div class="not-found-page">
    <h1>404</h1>
    <h2>Сторінку не знайдено</h2>
    <p>На жаль, запитувана адреса не існує або була переміщена.</p>
    <router-link to="/" class="btn-home">Повернутися на головну</router-link>
  </div>
</template>

<style scoped lang="scss">
.not-found-page {
  text-align: center;
  padding: 4rem 1rem;

  h1 {
    font-size: 5rem;
    margin: 0;
    color: #e57373;
  }

  h2 {
    font-size: 1.75rem;
    margin: 0.5rem 0 1rem;
  }

  p {
    color: #777;
    margin-bottom: 2rem;
  }

  .btn-home {
    background-color: #2bbbad;
    color: #fff;
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      background-color: #249d91;
    }
  }
}
</style>