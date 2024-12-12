import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { BlogsService } from 'src/modules/blogs/blogs.service';
import { formatBlogs } from 'src/common/helpers/formatBlogs';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { AppAbility } from 'src/common/modules/casl/casl-ability.factory/casl-ability.factory';
import { subject } from '@casl/ability';
import { Action } from 'src/common/enums/action.enum';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private blogsService: BlogsService,
    private configService: ConfigService,
  ) {}

  async checkUpdatePermission(userId: number, ability: AppAbility) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || ability.cannot(Action.Update, subject('User', user))) {
      throw new ForbiddenException('You are not allowed to update this user');
    }
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(signUpDto: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: signUpDto,
    });
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const data = {
      f_name: updateUserDto.f_name,
      l_name: updateUserDto.l_name,
      bio: updateUserDto.bio,
    };

    if (file) {
      data['avatar'] =
        this.configService.get<string>('BASE_URL') + '/' + file.path;
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  async getUserPosts(userId: number, order?: Record<string, 'asc' | 'desc'>) {
    const blogs = await this.blogsService.findMany(
      {
        authorId: userId,
      },
      order,
    );

    const result = formatBlogs(blogs);

    return result;
  }
}
