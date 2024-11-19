import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

//rename this userRepository and move it to shared/Repositories/user...
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUserName(userName: string) {
    return await this.prisma.user.findUnique({
      where: {
        userName,
      },
    });
  }

  async findOne(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
  async updateRefreshToken(userId: number, token: string | null) {
    console.log(token, userId);
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: token,
      },
    });
  }

  async updateUser(userId: number, value: UpdateUser) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: value,
    });
  }
}

interface UpdateUser extends Omit<UpdateUserDto, 'dob'> {
  dob: Date;
}
