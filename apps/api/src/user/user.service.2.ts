//! rename this to userService

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { StatusOk } from 'src/auth/types/status-ok';
import { UpdateUserDto } from './dto/update-user.dto';
import { transformToDto } from 'src/utils';
import { profileEnd } from 'console';
import { ProfileDto } from './dto/profile-dto';

@Injectable()
export class UserService2 {
  constructor(private readonly userService: UserService) {}

  async updateUser(id: number, dto: UpdateUserDto): Promise<StatusOk> {
    //! update updatedAt

    //redundunt checking

    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('No user found with this id!');

    //check if there another account with same email
    const accountWithSameEmail = await this.userService.findByEmail(dto.email);
    if (accountWithSameEmail && accountWithSameEmail.id !== id)
      throw new ConflictException(
        'An account is existed with same email adderess.',
      );
    let dob = user.dob;
    try {
      dob = new Date(dto.dob);
    } catch (_) {}
    await this.userService.updateUser(id, { ...dto, dob: dob });
    return { message: 'Account updated successfully.', status: '200' };
  }

  async getProfile(userId: number): Promise<ProfileDto> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('No user found with this id!');
    return transformToDto(ProfileDto, user);
  }
}
