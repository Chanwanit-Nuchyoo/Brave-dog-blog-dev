import { CaslAbilityFactory } from './../../common/modules/casl/casl-ability.factory/casl-ability.factory';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { AuthOpenApi } from 'src/common/decorators/auth-openapi.decorator';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Put(':id')
  @AuthOpenApi()
  @UseGuards(AuthGuard)
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    this.commentsService.checkUpdatePermission(
      id,
      this.caslAbilityFactory.createForUser(req.user),
    );

    return this.commentsService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthOpenApi()
  @UseGuards(AuthGuard)
  deleteComment(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    this.commentsService.checkDeletePermission(
      id,
      this.caslAbilityFactory.createForUser(req.user),
    );

    return this.commentsService.deleteComment(id);
  }
}
