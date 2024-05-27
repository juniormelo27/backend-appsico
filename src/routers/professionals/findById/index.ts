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
        type: true,
        name: true,
        image: true,
        email: true,
        phone: true,
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
            services: true,
            serviceLocation: {
              select: {
                displayName: true,
                street: true,
                number: true,
                complement: true,
                neighborhood: true,
                city: true,
                state: true,
                stateCode: true,
                country: true,
                countryCode: true,
                zipCode: true,
                longitude: true,
                latitude: true,
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

    return {
      id: response.id,
      name: response.name,
      image: response.image || undefined,
      profile: {
        bio: response.profile?.bio!,
        specialties: response.profile?.specialties!,
        approach: response.profile?.approach!,
        service: response.profile?.services!,
      },
      address: {
        display_name: response.profile?.serviceLocation?.[0]?.displayName!,
        street: response.profile?.serviceLocation?.[0]?.street!,
        number: response.profile?.serviceLocation?.[0]?.number!,
        complement:
          response.profile?.serviceLocation?.[0]?.complement || undefined!,
        neighborhood: response.profile?.serviceLocation?.[0]?.neighborhood!,
        city: response.profile?.serviceLocation?.[0]?.city!,
        state: response.profile?.serviceLocation?.[0]?.state!,
        state_code: response.profile?.serviceLocation?.[0]?.stateCode!,
        country: response.profile?.serviceLocation?.[0]?.country!,
        country_code: response.profile?.serviceLocation?.[0]?.countryCode!,
        zip_code: response.profile?.serviceLocation?.[0]?.zipCode!,
        latitude: response.profile?.serviceLocation?.[0]?.latitude!,
        longitude: response.profile?.serviceLocation?.[0]?.longitude!,
      },
      email: response.email,
      phone: response.phone,
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
        profile: t.Partial(
          t.Optional(
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
          )
        ),
        email: t.String(),
        phone: t.String(),
        address: t.Partial(
          t.Object({
            display_name: t.String(),
            street: t.String(),
            number: t.Number(),
            complement: t.Optional(t.String()),
            neighborhood: t.String(),
            city: t.String(),
            state: t.String(),
            state_code: t.String(),
            country: t.String(),
            country_code: t.String(),
            zip_code: t.String(),
            latitude: t.Number(),
            longitude: t.Number(),
          })
        ),
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
