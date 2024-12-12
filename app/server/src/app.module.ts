import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CaslModule } from './common/modules/casl/casl.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME_IN_MINUTES: Joi.number().required(),
        BASE_URL: Joi.string().required(),
        FILES_URL: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
    CommentsModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
