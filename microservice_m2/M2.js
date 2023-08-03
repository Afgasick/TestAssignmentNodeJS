// Модули и зависимости
const amqp = require('amqplib');
const logger = require('../logger');

// Функция для обработки задания
async function processTask(task) {

  logger.info('Задание было успешно обработано:', task);
}

// Подписка на очередь RabbitMQ для получения заданий
async function subscribeToQueue() {
  const conn = await amqp.connect('amqp://127.0.0.1');
  const channel = await conn.createChannel();

  const queue = 'tasks_queue';

  await channel.assertQueue(queue, { durable: true });
  channel.consume(
    queue,
    (msg) => {
      const task = msg.content.toString();
      processTask(task); // Обработка задания

      channel.ack(msg); // Подтверждение выполнения задания 
    },
    { noAck: false }
  );
  logger.info('Микросервис М2 запущен и готов к обработке заданий из очереди.');
}

subscribeToQueue()