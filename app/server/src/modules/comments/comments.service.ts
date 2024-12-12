import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { AppAbility } from 'src/common/modules/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/common/enums/action.enum';
import { subject } from '@casl/ability';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async checkUpdatePermission(id: number, ability: AppAbility) {
    const comment = await this.prisma.blogComments.findUnique({
      where: {
        id,
      },
    });

    if (
      !comment ||
      ability.cannot(Action.Update, subject('BlogComments', comment))
    ) {
      throw new ForbiddenException(
        'You do not have access to update this comment',
      );
    }
  }

  async checkDeletePermission(id: number, ability: AppAbility) {
    const comment = await this.prisma.blogComments.findUnique({
      where: {
        id,
      },
    });

    if (
      !comment ||
      ability.cannot(Action.Delete, subject('BlogComments', comment))
    ) {
      throw new ForbiddenException(
        'You do not have access to delete this comment',
      );
    }
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.blogComments.update({
      where: {
        id,
      },
      data: {
        content: updateCommentDto.content,
      },
    });
  }

  async deleteComment(id: number) {
    await this.prisma.blogComments.delete({
      where: {
        id,
      },
    });
  }
}
