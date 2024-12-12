import { ConfigService } from '@nestjs/config';
import { CreateBlogDto } from './dtos/create-blog.dto';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { generateSlug } from 'src/common/helpers/generate-slug';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { Prisma, User } from '@prisma/client';
import { formatBlogs } from 'src/common/helpers/formatBlogs';
import { CreateBlogCommentDto } from './dtos/create-blog-comment.dto';
import {
  AppAbility,
  CaslAbilityFactory,
} from 'src/common/modules/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/common/enums/action.enum';
import { subject } from '@casl/ability';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async checkDeletePermission(slug: string, ability: AppAbility) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!blog || ability.cannot(Action.Delete, subject('Blog', blog))) {
      throw new ForbiddenException(
        'You do not have permission to delete this blog',
      );
    }
  }

  async checkUpdatePermission(slug: string, ability: AppAbility) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!blog || ability.cannot(Action.Update, subject('Blog', blog))) {
      throw new ForbiddenException(
        'You do not have permission to update this blog',
      );
    }
  }

  async findMany(
    blogWhereInput: Prisma.BlogWhereInput,
    order?: Record<string, 'asc' | 'desc'>,
  ) {
    return this.prisma.blog.findMany({
      include: {
        author: {
          select: {
            f_name: true,
            l_name: true,
            avatar: true,
          },
        },
      },
      where: blogWhereInput,
      orderBy: order,
    });
  }

  async getBlogs(
    take: number,
    skip: number,
    order: Record<string, 'asc' | 'desc'>,
  ) {
    const total = await this.prisma.blog.count();
    const totalPages = Math.ceil(total / take);
    const blogs = await this.prisma.blog.findMany({
      include: {
        author: {
          select: {
            f_name: true,
            l_name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      take,
      skip,
      orderBy: order,
    });

    const hasNext = skip + take < total;
    const result = formatBlogs(blogs);
    const transformedBlogs = await firstValueFrom(result);

    return {
      take: take,
      total,
      totalPages,
      hasNext,
      blogs: transformedBlogs,
    };
  }

  async getBlog(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            f_name: true,
            l_name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async createBlog(
    userId: number,
    createBlogDto: CreateBlogDto,
    file: Express.Multer.File,
  ) {
    const blog = await this.prisma.blog.create({
      data: {
        title: createBlogDto.title,
        slug: generateSlug(createBlogDto.title),
        summary: createBlogDto.summary,
        content: createBlogDto.content,
        authorId: userId,
        coverImage: file
          ? this.configService.get<string>('BASE_URL') + '/' + file.path
          : `https://picsum.photos/id/${Math.floor(Math.random() * 1084) + 1}/800/600`,
      },
    });

    return blog;
  }

  async updateBlog(
    slug: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    const data = {
      title: updateBlogDto.title,
      summary: updateBlogDto.summary,
      content: updateBlogDto.content,
    };

    if (file) {
      data['coverImage'] =
        this.configService.get<string>('BASE_URL') + '/' + file.path;
    }

    const blog = await this.prisma.blog.update({
      where: {
        slug,
      },
      data,
    });

    return blog;
  }

  async readBlog(slug: string) {
    const blog = await this.prisma.blog.update({
      where: {
        slug,
      },
      data: {
        read: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            f_name: true,
            l_name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return blog;
  }

  async deleteBlog(slug: string) {
    await this.prisma.blog.delete({
      where: {
        slug,
      },
    });
  }

  async canLike(slug: string, userId: number) {
    const isAlreadyLiked = await this.prisma.blogLikes.findFirst({
      where: {
        blog: {
          slug,
        },
        user: {
          id: userId,
        },
      },
    });
    return {
      canLike: !isAlreadyLiked,
    };
  }

  async like(slug: string, userId: number) {
    await this.prisma.blogLikes
      .create({
        data: {
          blog: {
            connect: {
              slug,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      })
      .catch((err) => {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Already liked');
        }

        throw new InternalServerErrorException();
      });
  }

  async unLike(slug: string, userId: number) {
    await this.prisma.blogLikes.deleteMany({
      where: {
        blog: {
          slug,
        },
        user: {
          id: userId,
        },
      },
    });
  }

  async getBlogComments(slug: string) {
    return this.prisma.blogComments.findMany({
      where: {
        blog: {
          slug,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            f_name: true,
            l_name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async createBlogComment(
    slug: string,
    userId: number,
    createBlogCommentDto: CreateBlogCommentDto,
  ) {
    return this.prisma.blogComments.create({
      data: {
        content: createBlogCommentDto.content,
        blog: {
          connect: {
            slug,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async deleteBlogComment(commentId: number) {
    await this.prisma.blogComments.delete({
      where: {
        id: commentId,
      },
    });
  }
}
