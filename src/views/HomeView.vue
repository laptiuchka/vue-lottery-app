<template>
  <div class="home-page">
    <div class="jumbotron">
      <h1>Ласкаво просимо до Lottery app!</h1>
      <p class="lead">
        Інтерактивний додаток для проведення лотерей, управління учасниками та авторизації користувачів.
      </p>
    </div>

    <div class="card info-card">
      <h3>Використані технології:</h3>
      <ul>
        <li><strong>Vue 3</strong> (Composition API, Script Setup)</li>
        <li><strong>TypeScript</strong> для суворої типізації даних</li>
        <li><strong>Vue Router 4</strong> для організації маршрутизації та переходів</li>
        <li><strong>Pinia</strong> для керування глобальним станом авторизації</li>
        <li><strong>VeeValidate + Yup</strong> для комплексної валідації форм</li>
        <li><strong>Sass</strong> та <strong>Bootstrap</strong> для стилізації</li>
        <li><strong>DummyJSON REST API</strong> для отримання та симуляції збереження даних</li>
      </ul>

      <div class="repo-link">
        <a
          href="https://github.com/laptiuchka/vue-lottery-app"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-github"
        >
          Репозиторій проєкту на GitHub ↗
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  .jumbotron {
    background-color: #fbf9fe;
    border: 1px solid #eee8f8;
    border-radius: 12px;
    padding: 2.2rem;
    margin-bottom: 2rem;

    h1 {
      margin-top: 0;
      color: #7751be;
      font-size: 2rem;
      font-weight: 700;
    }

    .lead {
      color: #6d6679;
      font-size: 1.05rem;
      margin-bottom: 0;
    }
  }

  .info-card {
    background: #ffffff;
    border: 1px solid #ede8f5;
    border-radius: 12px;
    padding: 1.75rem;

    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: #3b3546;
    }

    ul {
      line-height: 1.85;
      color: #554e60;
      margin-bottom: 1.5rem;
    }

    .btn-github {
      display: inline-block;
      background-color: #906cd4;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #7751be;
      }
    }
  }
}
</style>