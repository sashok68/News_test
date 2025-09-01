# NewsApp - Мобильное приложение для новостей


## Технологический стек

- **React Native CLI** (не Expo)
- **TypeScript**
- **React Navigation** (Stack Navigator)
- **Styled Components** для стилизации
- **Axios** для HTTP запросов
- **NewsAPI** для получения новостей

## Установка и запуск

### Предварительные требования

1. Node.js (v18 или выше)
2. React Native CLI
3. Android Studio / Xcode (для эмуляторов)
4. API ключ от NewsAPI.org

### Установка зависимостей

```bash
cd NewsApp
npm install
```

### Настройка API ключа

1. Зарегистрируйтесь на [NewsAPI.org](https://newsapi.org/)
2. Получите бесплатный API ключ
3. Откройте файл `src/services/newsApi.ts`
4. Замените `YOUR_API_KEY_HERE` на ваш реальный API ключ:

```typescript
const NEWS_API_KEY = 'ваш_api_ключ_здесь';
```

### Запуск приложения

#### Для Android:

```bash
npx react-native run-android
```

#### Для iOS:

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## Структура проекта

```
src/
├── components/           # Переиспользуемые компоненты
│   ├── styled/          # Стилизованные компоненты
│   ├── NewsCard.tsx     # Карточка новости
│   └── SearchAndFilters.tsx # Поиск и фильтры
├── navigation/          # Настройка навигации
│   ├── AppNavigator.tsx # Основной навигатор
│   └── types.ts         # Типы для навигации
├── screens/            # Экраны приложения
│   ├── NewsListScreen.tsx    # Главный экран со списком
│   └── NewsDetailScreen.tsx  # Детальная страница
├── services/           # API сервисы
│   └── newsApi.ts      # Сервис для работы с NewsAPI
└── types/              # TypeScript типы
    └── news.ts         # Типы для новостей
```

## Функционал

### Главный экран (NewsList)
- Отображение списка новостей в виде карточек
- Пагинация по 10 новостей на страницу
- Поиск новостей по ключевым словам
- Фильтрация по категориям
- Pull-to-refresh для обновления
- Обработка состояний загрузки и ошибок

### Детальная страница (NewsDetail)
- Полное отображение новости с изображением
- Информация об авторе, источнике и дате
- Кнопка "Назад" для возврата к списку
- Кнопка "Открыть в браузере" для перехода к полной статье

## API Integration

Приложение использует NewsAPI v2 с эндпоинтами:
- `/top-headlines` - для получения топ новостей
- `/everything` - для поиска новостей



