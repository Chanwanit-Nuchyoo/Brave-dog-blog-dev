import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthOpenApi } from 'src/common/decorators/auth-openapi.decorator';
import { formatUser } from 'src/common/helpers/formatUser';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('me')
  @AuthOpenApi()
  @UseGuards(AuthGuard)
  me(@Req() req: Request) {
    return formatUser(req.user);
  }
}
