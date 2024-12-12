import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Blog, BlogComments, User } from '@prisma/client';
import { Action } from 'src/common/enums/action.enum';

export type AppAbility = PureAbility<
  [
    string,
    (
      | Subjects<{
          User: User;
          Blog: Blog;
          BlogComments: BlogComments;
        }>
      | 'all'
    ),
  ],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (!user) {
      can(Action.Read, 'all');
      return build();
    }

    if (user.isAdmin) {
      can(Action.Manage, 'all');
      return build();
    }

    can(Action.Read, 'all');

    can(Action.Update, 'User', { id: user.id });

    can(Action.Create, 'Blog');
    can(Action.Update, 'Blog', { authorId: user.id });
    can(Action.Delete, 'Blog', { authorId: user.id });

    can(Action.Create, 'BlogComments');
    can(Action.Update, 'BlogComments', { userId: user.id });
    can(Action.Delete, 'BlogComments', { userId: user.id });

    return build();
  }
}
