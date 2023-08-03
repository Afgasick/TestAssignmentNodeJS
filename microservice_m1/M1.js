// Модули и зависимости
const express = require('express');
const amqp = require('amqplib');
const logger = require('../logger');

const app = express();
const PORT = 3000;

var n = 0;

// Функция для отправки задания в RabbitMQ
async function sendTaskToQueue(task) {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const queue = 'tasks_queue';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(task), { persistent: true });

  logger.info('Задание отправлено в очередь:', task);

  setTimeout(() => conn.close(), 1000);
}

// Обработка HTTP запросов
app.post('/process', (req, res) => {
  const requestData = req.body; // Предположим, что данные приходят в теле запроса

  // Обработка данных и формирование задания
  const task = JSON.stringify({ type: 'process_data', data: requestData });

  // Отправляем задание в RabbitMQ
  sendTaskToQueue(task)
    .then(() => {
      res.status(200).json({ message: 'Задание отправлено в обработку' });
    })
    .catch((err) => {
      console.error('Ошибка отправки задания в RabbitMQ:', err);
      res.status(500).json({ error: 'Ошибка отправки задания в обработку' });
      logger.error('Ошибка отправки задания в обработку', err);
    });

});

// Запуск HTTP сервера
app.listen(PORT, () => {
  logger.info(`Микросервис М1 запущен на порту ${PORT}`);
});

//sendTaskToQueue()
