import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const verify = new Http().use(context).post(
  '/verify',
  async ({ body, db }) => {
    const isConversations = await db.conversations.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: body.users,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (isConversations) {
      return {
        id: isConversations.id,
      };
    }

    const conversation = await db.conversations.create({
      data: {
        users: {
          connect: body.users.map((item) => ({
            id: item,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return {
      id: conversation.id,
    };
  },
  {
    body: t.Object({
      users: t.Array(t.String()),
    }),
    response: {
      200: t.Object({
        id: t.String(),
      }),
    },
  }
);
