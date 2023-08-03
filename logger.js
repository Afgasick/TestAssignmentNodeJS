const winston = require('winston');

// Создаем новый логгер с несколькими транспортами
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Записываем логи в формате JSON
  ),
  transports: [
    new winston.transports.Console(), // Записываем логи в консоль
    new winston.transports.File({ filename: 'app.log' }), // Записываем логи в файл
  ],
});

module.exports = logger;
