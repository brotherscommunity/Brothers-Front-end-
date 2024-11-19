import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogRepository } from 'src/shared/repositories/blog.repository';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService, BlogRepository],
})
export class BlogsModule {}
