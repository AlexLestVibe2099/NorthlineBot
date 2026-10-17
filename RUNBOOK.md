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
MANAGER_CHAT_IDS=
```

```bat
npm install
npm start
```

### Уведомления менеджеру

1. Напишите боту `/myid` — он пришлёт ваш numeric chat id.
2. Впишите в `.env`: `MANAGER_CHAT_IDS=123456789` (ваш id).
3. Перезапустите `npm start`.
4. Менеджер хотя бы раз должен нажать `/start` у бота (иначе Telegram не даст писать первым).

Сменить получателя: замените id в `MANAGER_CHAT_IDS` и перезапустите бота.  
Несколько менеджеров: `MANAGER_CHAT_IDS=111,222`.

Пройдите сценарий заявки — карточка уйдёт менеджеру в Telegram и продублируется в терминале.

## 3. Подключить лендинг

В папке `U:\Лендинг`:

```bat
copy .env.example .env
```

```env
VITE_BOT_URL=https://t.me/NorthlineLeadBot
```

Перезапустите `npm run dev` (или `npm run build` / переменная в Vercel).

На лендинге:
- **Запросить демо** — форма на сайте;
- **Открыть в Telegram** — бот Northline.

## 4. Скрины для кейса портфолио (позже)

После живого прогона обновите `case-tg-02…04` в `U:\Сайт-портфолио\public\`.

## 5. Что пока не делаем

- Хостинг бота на VPS (сейчас ПК должен быть включён и `npm start` запущен).
