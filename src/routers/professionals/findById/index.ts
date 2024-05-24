import Http, { context } from '@/service/http';
import { TypeServicesEnum } from '@prisma/client';
import { error, t } from 'elysia';

export const findById = new Http().use(context).get(
  '/:id',
  async ({ params: { id }, db }) => {
    const response = await db.users.findUnique({
      where: {
        id,
        type: 'professional',
      },
      select: {
        id: true,
        name: true,
        image: true,
        profile: {
          select: {
            bio: true,
            socials: {
              select: {
                id: true,
                url: true,
              },
            },
            approach: {
              select: {
                id: true,
                name: true,
              },
            },
            specialties: {
              select: {
                id: true,
                name: true,
              },
            },
            service: true,
            address: {
              select: {
                street: true,
                number: true,
                complement: true,
                neighborhood: true,
                city: true,
                state: true,
                stateCode: true,
                country: true,
                countryCode: true,
              },
            },
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            conversations: true,
          },
        },
      },
    });

    if (!response) {
      return error('Bad Request', {
        message: 'Profissional não encontrado',
      });
    }

    if (!response.profile || !response.profile.address) {
      return error('Bad Request', {
        message: 'Profissional sem perfil cadastrado',
      });
    }

    return {
      id: response.id,
      name: response.name,
      image: response.image || undefined,
      profile: {
        bio: response.profile.bio,
        specialties: response.profile.specialties,
        approach: response.profile.approach,
        service: response.profile.service,
      },
      address: {
        street: response.profile.address.street,
        number: response.profile.address.number,
        complement: response.profile.address.complement || undefined,
        neighborhood: response.profile.address.neighborhood,
        city: response.profile.address.city,
        state: response.profile.address.state,
        state_code: response.profile.address.stateCode,
        country: response.profile.address.country,
        country_code: response.profile.address.countryCode,
      },
      _count: {
        followers: response._count.followers,
        following: response._count.following,
        connections: response._count.conversations,
      },
    };
  },
  {
    response: {
      200: t.Object({
        id: t.String(),
        name: t.String(),
        image: t.Optional(t.String()),
        profile: t.Optional(
          t.Object({
            bio: t.String(),
            approach: t.Optional(
              t.Array(
                t.Object({
                  id: t.String(),
                  name: t.String(),
                })
              )
            ),
            specialties: t.Optional(
              t.Array(
                t.Object({
                  id: t.String(),
                  name: t.String(),
                })
              )
            ),
            service: t.Array(t.Enum(TypeServicesEnum)),
          })
        ),
        address: t.Object({
          street: t.String(),
          number: t.Number(),
          complement: t.Optional(t.String()),
          neighborhood: t.String(),
          city: t.String(),
          state: t.String(),
          state_code: t.String(),
          country: t.String(),
          country_code: t.String(),
        }),
        _count: t.Object({
          followers: t.Number(),
          following: t.Number(),
          connections: t.Number(),
        }),
      }),
      400: t.Object({
        message: t.String(),
      }),
    },
  }
);
