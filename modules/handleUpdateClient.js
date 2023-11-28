import {sendData, sendError} from "./send.js";
import fs from "node:fs/promises";
import {CLIENTS} from "../index.js";


export const handleUpdateClient = (req, res, segments) => {
  let body = ''
  try {
    req.on('data', chunk => {
      body += chunk
    });
  } catch (e) {
    console.error('Ошибка при чтении запроса:', e.message);
    sendError(res, 500, 'Ошибка сервера при чтении запроса');
  }
  req.on('end', async () => {
    try {
      const updateDataClient = JSON.parse(body);

      if (!updateDataClient.fullName || !updateDataClient.phone || !updateDataClient.ticketNumber || !updateDataClient.booking) {
        sendError(res, 400, 'Неверные основные данные клиента');
        return;
      }
      console.log(!updateDataClient.booking.every(item => item.comedian && item.time), 'updateDataClient.booking.every(item => item.comedian && item.time)')
      if (!updateDataClient.booking && (!updateDataClient.booking.length && !Array.isArray(updateDataClient.booking) && !updateDataClient.booking.every(item => item.comedian && item.time))) {
        sendError(res, 400, 'Неверно заполнены поля бронирования');
        return;
      }
      const clientData = await fs.readFile(CLIENTS, 'utf8');
      const clients = JSON.parse(clientData);

      const clientIndex = clients.findIndex(c => c.ticketNumber === segments[1]);

      if (clientIndex === -1) {
        sendError(res, 404, 'Клиент с данным номером билета не найден');
        return;
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateDataClient
      }

      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, clients[clientIndex]);
    } catch (e) {
      console.error(`error: ${e.message}`);
      sendError(res, 500, 'Ошибка сервера');

    }
  })
}