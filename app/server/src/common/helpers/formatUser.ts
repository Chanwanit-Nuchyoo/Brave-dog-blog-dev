import { User } from '@prisma/client';

export function formatUser(user: Partial<User>) {
  return {
    id: user.id,
    email: user.email,
    f_name: user.f_name,
    l_name: user.l_name,
    avatar: user.avatar,
    bio: user.bio,
  };
}
