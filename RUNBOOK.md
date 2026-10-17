# Порядок запуска Northline

## 1. Создать бота

1. Откройте [@BotFather](https://t.me/BotFather) → `/newbot`.
2. Имя, например: `Northline Lead`.
3. Username, например: `NorthlineLeadBot` (должен быть свободен).
4. Скопируйте токен.

## 2. Настроить бот на ПК

В папке `U:\Telegram-бот-northline`:

```bat
copy .env.example .env
notepad .env
```

Заполните:

```env
BOT_TOKEN=вставьте_токен
BOT_USERNAME=NorthlineLeadBot
```

```bat
npm install
npm start
```

В Telegram откройте `t.me/NorthlineLeadBot` → `/start` → пройдите сценарий.  
Карточка заявки появится в окне терминала.

## 3. Подключить лендинг

В папке `U:\Лендинг`:

```bat
copy .env.example .env
```

```env
VITE_BOT_URL=https://t.me/NorthlineLeadBot
```

Перезапустите `npm run dev` (или сделайте `npm run build` перед деплоем на Vercel — добавьте ту же переменную в настройках проекта).

На лендинге кнопки:
- **Запросить демо** — форма на сайте;
- **Открыть в Telegram** — бот Northline.

## 4. Скрины для кейса портфолио (позже)

После живого прогона обновите `case-tg-02…04` в `U:\Сайт-портфолио\public\` реальными скринами Telegram.

## 5. Что пока не делаем

- Уведомления менеджеру в Telegram (сейчас только консоль).
- Хостинг бота на VPS (сейчас ПК должен быть включён и `npm start` запущен).
