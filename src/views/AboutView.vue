<template>
  <div class="about-page">
    <div class="profile-card">
      <h2>Інформація про автора</h2>
      <p class="author-name"><strong>Автор:</strong> Лаптюк Тетяна</p>

      <div class="skills-section">
        <h3>Technical skills:</h3>
        <div class="tags">
          <span class="tag">HTML5 / CSS3 / SCSS</span>
          <span class="tag">JavaScript (ES6+)</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Vue.js 3 (Composition API)</span>
          <span class="tag">Vue Router</span>
          <span class="tag">Pinia</span>
          <span class="tag">Git & GitHub</span>
          <span class="tag">Vite</span>
          <span class="tag">REST API & JWT</span>
        </div>
      </div>

      <div class="links-section">
        <a
          href="https://github.com/laptiuchka"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-profile"
        >
          GitHub профіль ↗
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-page {
  max-width: 650px;
  margin: 0 auto;

  .profile-card {
    background: #fff;
    border: 1px solid #ede8f5;
    border-radius: 12px;
    padding: 2rem;

    h2 {
      margin-top: 0;
      color: #7751be;
      margin-bottom: 1rem;
    }

    .author-name {
      font-size: 1.1rem;
      color: #3b3546;
      margin-bottom: 1.5rem;
    }

    .skills-section {
      margin-bottom: 2rem;

      h3 {
        font-size: 1.1rem;
        color: #4b4556;
        margin-bottom: 0.75rem;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .tag {
          background-color: #f3ecfb;
          color: #6e46b8;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 600;
        }
      }
    }

    .btn-profile {
      display: inline-block;
      background-color: #906cd4;
      color: #fff;
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