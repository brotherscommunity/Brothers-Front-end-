import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService2 } from './user.service.2';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserService2],
})
export class UserModule {}
