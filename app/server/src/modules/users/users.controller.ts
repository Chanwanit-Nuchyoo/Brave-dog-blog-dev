import {
  Controller,
  DefaultValuePipe,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Query,
  Body,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ParseOrderQueryPipe } from 'src/common/pipes/parse-order-query.pipe';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { formatUser } from 'src/common/helpers/formatUser';
import { AuthOpenApi } from 'src/common/decorators/auth-openapi.decorator';
import { GetUserPostQuery, UpdateUserRequestBody } from './users.openapi';
import { UseFileUpload } from 'src/common/decorators/use-file-upload.decorator';
import {
  AppAbility,
  CaslAbilityFactory,
} from 'src/common/modules/casl/casl-ability.factory/casl-ability.factory';
import { Request } from 'express';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.usersService.findOne({ id: userId });
    return formatUser(user);
  }

  @Put(':id')
  @AuthOpenApi()
  @UseFileUpload('avatar')
  @ApiBody({
    type: 'object',
    schema: UpdateUserRequestBody,
  })
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    this.usersService.checkUpdatePermission(
      userId,
      this.caslAbilityFactory.createForUser(req.user),
    );

    const updatedUser = formatUser(
      await this.usersService.updateUser(userId, updateUserDto, file),
    );

    return updatedUser;
  }

  @Get(':id/blogs')
  @ApiQuery(GetUserPostQuery)
  async getUserPosts(
    @Param('id', ParseIntPipe) userId: number,
    @Query(
      'order',
      new DefaultValuePipe('published:desc'),
      new ParseOrderQueryPipe(),
    )
    order?: Record<string, 'asc' | 'desc'>,
  ) {
    return this.usersService.getUserPosts(userId, order);
  }
}
