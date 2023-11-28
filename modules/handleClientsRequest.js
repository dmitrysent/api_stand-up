import {sendData, sendError} from "./send.js";
import fs from 'node:fs/promises'
import {CLIENTS} from "../index.js";

export const handleClientsRequest = async (req, res, ticketNumber) => {
  try {
    const clientData = await fs.readFile(CLIENTS, 'utf8');
    const clients = JSON.parse(clientData);

    const client = clients.find(c => c.ticketNumber === ticketNumber);
    console.log(client, 'client')

    if (!client) {
      sendError(res, 404, 'Клиента с данным номером билета не найден');
      return;
    }

    sendData(res, client);

  } catch (err) {
    console.log(`Ошибка при обработке запроса: ${err}`);
    sendError(res, 500, 'Ошибка сервера при обработке данных')
  }
}