import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { ParseOrderQueryPipe } from 'src/common/pipes/parse-order-query.pipe';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { CreateBlogCommentDto } from './dtos/create-blog-comment.dto';
import { AuthOpenApi } from 'src/common/decorators/auth-openapi.decorator';
import { UseFileUpload } from 'src/common/decorators/use-file-upload.decorator';
import { Request } from 'express';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import {
  AppAbility,
  CaslAbilityFactory,
} from 'src/common/modules/casl/casl-ability.factory/casl-ability.factory';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { Action } from 'src/common/enums/action.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';

const schema = {
  type: 'object',
  required: ['title', 'summary', 'content'],
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    content: { type: 'string' },
    coverImage: {
      type: 'string',
      format: 'binary',
    },
  },
};

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  @ApiQuery({ name: 'take', required: false, default: 10 })
  @ApiQuery({ name: 'page', required: false, default: 1 })
  @ApiQuery({ name: 'order', required: false, default: 'published:desc' })
  getBlogs(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query(
      'order',
      new DefaultValuePipe('published:desc'),
      new ParseOrderQueryPipe(),
    )
    order?: Record<string, 'asc' | 'desc'>,
  ) {
    return this.blogsService.getBlogs(take, (page - 1) * take, order);
  }

  @Get(':slug')
  getBlog(@Param('slug') slug: string) {
    return this.blogsService.getBlog(slug);
  }

  @Post()
  @AuthOpenApi()
  @UseFileUpload('coverImage')
  @ApiBody({
    schema,
  })
  @CheckPolicies((ability: AppAbility) => ability.can('create', 'Blog'))
  @UseGuards(AuthGuard, PoliciesGuard)
  createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.blogsService.createBlog(userId, createBlogDto, file);
  }

  @Put(':slug')
  @AuthOpenApi()
  @UseFileUpload('coverImage')
  @ApiBody({
    schema: {
      type: 'object',
      properties: schema.properties,
    },
  })
  @UseGuards(AuthGuard)
  updateBlog(
    @Param('slug') slug: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    this.blogsService.checkUpdatePermission(
      slug,
      this.caslAbilityFactory.createForUser(req.user),
    );

    return this.blogsService.updateBlog(slug, updateBlogDto, file);
  }

  @Get(':slug/read')
  readBlog(@Param('slug') slug: string) {
    return this.blogsService.readBlog(slug);
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthOpenApi()
  @UseGuards(AuthGuard)
  deleteBlog(@Param('slug') slug: string, @Req() req: Request) {
    this.blogsService.checkDeletePermission(
      slug,
      this.caslAbilityFactory.createForUser(req.user),
    );

    return this.blogsService.deleteBlog(slug);
  }

  @Get(':slug/can-like')
  @AuthOpenApi()
  @UseGuards(AuthGuard)
  canLike(@Param('slug') slug: string, @Req() req: any) {
    const userId = req.user.id;
    return this.blogsService.canLike(slug, userId);
  }

  @Post(':slug/like')
  @AuthOpenApi()
  @UseGuards(AuthGuard)
  like(@Param('slug') slug: string, @Req() req: any) {
    const userId = req.user.id;
    return this.blogsService.like(slug, userId);
  }

  @Delete(':slug/unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthOpenApi()
  @UseGuards(AuthGuard)
  unLike(@Param('slug') slug: string, @Req() req: any) {
    const userId = req.user.id;
    return this.blogsService.unLike(slug, userId);
  }

  @Get(':slug/comments')
  @UseGuards(PoliciesGuard)
  getBlogComments(@Param('slug') slug: string) {
    return this.blogsService.getBlogComments(slug);
  }

  @Post(':slug/comments')
  @AuthOpenApi()
  @CheckPolicies((ability: AppAbility) => {
    return ability.can(Action.Create, 'BlogComments');
  })
  @UseGuards(AuthGuard, PoliciesGuard)
  createBlogComment(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Body() createBlogCommentDto: CreateBlogCommentDto,
  ) {
    const userId = req.user.id;
    return this.blogsService.createBlogComment(
      slug,
      userId,
      createBlogCommentDto,
    );
  }
}
