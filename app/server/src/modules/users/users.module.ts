import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { UsersController } from './users.controller';
import { BlogsModule } from 'src/modules/blogs/blogs.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fs from 'fs';
import { CaslModule } from 'src/common/modules/casl/casl.module';

@Module({
  imports: [
    PrismaModule,
    BlogsModule,
    CaslModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req: any, file, cb) => {
          const userId = req.user.id;
          const uploadFolder = `files/users/${userId}`;
          fs.mkdirSync(uploadFolder, { recursive: true });
          cb(null, uploadFolder);
        },
        filename: (req, file, cb) => {
          const filename = `${new Date().getTime()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
