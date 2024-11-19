import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { StatusOk } from 'src/auth/types/status-ok';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService2 } from './user.service.2';
import { Public } from 'src/shared/decorators/public.decorator';
import { ProfileDto } from './dto/profile-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService2) {}

  @Post('update-profile')
  UpdateProfile(@Req() req, @Body() dto: UpdateUserDto): Promise<StatusOk> {
    return this.userService.updateUser(req.user.id, dto);
  }

  @Public()
  @Get(':id')
  getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getProfile(id);
  }
}
