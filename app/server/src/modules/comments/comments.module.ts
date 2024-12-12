import { Module, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { CaslModule } from 'src/common/modules/casl/casl.module';

@Module({
  imports: [PrismaModule, CaslModule],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
