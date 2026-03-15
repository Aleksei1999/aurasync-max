import { Bot, Keyboard } from '@maxhub/max-bot-api';

// Получаем токен из переменных окружения
const BOT_TOKEN = process.env.MAX_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('MAX_BOT_TOKEN is not set');
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

// URL мини-приложения (deep link для открытия внутри MAX)
const WEBAPP_URL = 'https://max.ru/id030698930459_bot?startapp';

// Регистрируем команды бота
bot.api.setMyCommands([
  {
    name: 'start',
    description: 'Начать работу с AuraSync',
  },
  {
    name: 'app',
    description: 'Открыть приложение',
  },
  {
    name: 'help',
    description: 'Помощь',
  },
]);

// Обработка команды /start
bot.command('start', async (ctx) => {
  const user = ctx.update.message?.sender;
  const userName = user?.name || 'друг';

  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.link('Открыть AuraSync', WEBAPP_URL)],
  ]);

  await ctx.reply(
    `Привет, ${userName}! ✨\n\n` +
    `Добро пожаловать в AuraSync — твой персональный помощник для гормонального баланса и ментального здоровья.\n\n` +
    `Что умеет AuraSync:\n` +
    `🧘 Персональные практики дыхания и медитации\n` +
    `📊 Отслеживание настроения и энергии\n` +
    `🌙 Программы для сна и восстановления\n` +
    `⚡ SOS-техники для снятия стресса\n\n` +
    `Нажми кнопку ниже, чтобы начать!`,
    { attachments: [keyboard] }
  );
});

// Обработка команды /app
bot.command('app', async (ctx) => {
  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.link('Открыть AuraSync', WEBAPP_URL)],
  ]);

  await ctx.reply(
    'Нажми кнопку, чтобы открыть приложение:',
    { attachments: [keyboard] }
  );
});

// Обработка команды /help
bot.command('help', async (ctx) => {
  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.link('Открыть приложение', WEBAPP_URL)],
  ]);

  await ctx.reply(
    `Как пользоваться AuraSync:\n\n` +
    `1. Открой приложение по кнопке ниже\n` +
    `2. Пройди короткий онбординг\n` +
    `3. Выполняй ежедневные практики\n` +
    `4. Отслеживай своё состояние\n\n` +
    `Команды бота:\n` +
    `/start — приветствие и начало работы\n` +
    `/app — открыть приложение\n` +
    `/help — эта справка`,
    { attachments: [keyboard] }
  );
});

// Обработка события bot_started (когда пользователь начинает диалог)
bot.on('bot_started', async (ctx) => {
  const user = ctx.update.user;
  const userName = user?.name || 'друг';
  const payload = ctx.update.payload;

  // Для deep link с параметром: https://max.ru/bot?startapp=param
  const webappUrl = payload
    ? `https://max.ru/id030698930459_bot?startapp=${payload}`
    : WEBAPP_URL;

  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.link('Открыть AuraSync', webappUrl)],
  ]);

  await ctx.reply(
    `Привет, ${userName}! ✨\n\n` +
    `Рада тебя видеть! Нажми кнопку ниже, чтобы открыть AuraSync.`,
    { attachments: [keyboard] }
  );
});

// Обработка любых текстовых сообщений
bot.on('message_created', async (ctx) => {
  // Игнорируем команды (они обрабатываются отдельно)
  const text = ctx.update.message?.body?.text;
  if (!text || text.startsWith('/')) return;

  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.link('Открыть AuraSync', WEBAPP_URL)],
  ]);

  await ctx.reply(
    `Для работы со мной используй приложение AuraSync.\n\n` +
    `Нажми кнопку ниже или введи /help для справки.`,
    { attachments: [keyboard] }
  );
});

// Запуск бота
console.log('Starting AuraSync MAX Bot...');
bot.start();
console.log('Bot is running!');
