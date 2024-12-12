import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fs from 'fs';
import { CaslModule } from 'src/common/modules/casl/casl.module';

@Module({
  imports: [
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
    PrismaModule,
    CaslModule,
  ],
  providers: [BlogsService],
  exports: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
