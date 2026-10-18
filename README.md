# Vue Lottery App

Навчальний веб-застосунок для управління користувачами та розіграшу переможців lottery, рефакторений відповідно до архітектурної методології Feature-Sliced Design (FSD).

---

## Стек технологій

- **Фреймворк**: Vue 3 (Composition API, `<script setup>`)
- **Мова**: TypeScript
- **Збирач**: Vite
- **Стейт-менеджер**: Pinia + `pinia-plugin-persistedstate`
- **Маршрутизація**: Vue Router (з Navigation Guards)
- **UI-бібліотека**: PrimeVue (з власними обгортками у `shared/ui`)
- **Валідація форм**: VeeValidate + Yup
- **Архітектурний лінтер**: Steiger (`npm run lint:fsd`)
- **Стилізація**: SCSS, підтримка світлої та адаптивної темно-фіолетової/темно-сірої теми

---

## Архітектура Feature-Sliced Design (FSD)

Проєкт розділений на 6 ізольованих шарів із суворим дотриманням напрямку залежностей (згори донизу) та публічного API (`index.ts`) для кожного слайса:

1. **`app/`** — ініціалізація застосунку, Vue Router, реєстрація сервісів у `ServiceProvider`, глобальні стилі та підключення Pinia/PrimeVue.
2. **`pages/`** — сторінки застосунку (`Home`, `About`, `Users`, `Login`, `NotFound`).
3. **`widgets/`** — великі самодостатні блоки інтерфейсу (`AppHeader`, `UsersTableWidget`).
4. **`features/`** — бізнес-фічі та дії користувача (`auth`, `user-form`, `theme`).
5. **`entities/`** — предметні сутності (`user`, `session`): типи, Pinia stores, сервіси.
6. **`shared/`** — перевикористовуваний код без бізнес-логіки: `HttpClient`, `ServiceProvider`, UI-обгортки (`AppButton`, `AppInput`, `AppTable`, `AppConfirmDialog`).

---

## Діаграма залежностей шарів 

```mermaid
graph TD
    App[app] --> Pages[pages]
    App --> Widgets[widgets]
    App --> Features[features]
    App --> Entities[entities]
    App --> Shared[shared]

    Pages --> Widgets
    Pages --> Features
    Pages --> Entities
    Pages --> Shared

    Widgets --> Features
    Widgets --> Entities
    Widgets --> Shared

    Features --> Entities
    Features --> Shared

    Entities --> Shared

    Shared