import Http, { context } from '@/service/http';
import { TypeMessageEnum } from '@prisma/client';
import { t } from 'elysia';

export const websocket = new Http().use(context).ws('/chats', {
  open(ws) {
    ws.subscribe('group-chat');
  },
  close(ws) {
    ws.unsubscribe('group-chat');
  },
  async message(ws, message) {
    // const response = await ws.data.db.conversations.update({
    //   where: {
    //     id: message.id,
    //   },
    //   data: {
    //     messages: {
    //       create: {
    //         type: message.type,
    //         content: message.message,
    //         senderId: message.sender,
    //       },
    //     },
    //   },
    // });

    ws.publish('group-chat', message);
    ws.send(message);
  },
  body: t.Object({
    id: t.String(),
    type: t.Enum(TypeMessageEnum),
    message: t.String(),
    sender: t.String(),
  }),
});
