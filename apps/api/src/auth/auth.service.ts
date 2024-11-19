import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { StatusOk } from './types/status-ok';
import { SigninOk } from './types/sign-ok';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { SigninOkDto } from 'src/user/dto/sign-in-ok.dto';
import { plainToInstance } from 'class-transformer';
import { transformToDto } from 'src/utils';
import { MyProfileDto } from 'src/user/dto/my-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<StatusOk> {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }
    const { password, dob, ...rest } = createUserDto;
    let dobDate;
    try {
      console.log(dob, 'db');
      dobDate = new Date(dob);
    } catch (_) {
      throw new BadRequestException();
    }
    const hashedPassword = await hash(password);

    await this.userService.create({
      password: hashedPassword,
      dob: dobDate,
      ...rest,
    });
    return {
      status: 'ok',
      message: 'Account has been created. Please sign in to continue.',
    };
  }

  async signIn(dto: LoginDto): Promise<SigninOkDto> {
    const { userName, password } = dto;
    const user = await this.userService.findByUserName(userName);
    if (!user) throw new UnauthorizedException('Invalid Credentials!');

    const isPasswordMatched = verify(user.password, password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    const hashedRt = await hash(refreshToken);
    await this.userService.updateRefreshToken(user.id, hashedRt);
    // return {
    //   id: user.id,
    //   username: user.userName,
    //   role: user.role,

    //   accessToken,
    //   refreshToken,
    // };
    const unfilteredReturn = { ...user, accessToken, refreshToken };
    // return plainToInstance(SigninOkDto, unfilteredReturn, {
    //   excludeExtraneousValues: true,
    // });
    return transformToDto(SigninOkDto, unfilteredReturn);
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getProfile<T>(userId: number, dto: new () => T): Promise<T> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('No user found with this id!');
    return transformToDto(dto, user);
  }

  async signOut(userId: number): Promise<StatusOk> {
    await this.userService.updateRefreshToken(userId, null);
    return { status: 'ok', message: 'Token is invalidated' };
  }

  async refreshToken(userId: number): Promise<{ accessToken: string }> {
    const { accessToken } = await this.generateTokens(userId);
    return {
      accessToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('Invalid Refresh Token!');
    let refreshTokenMatched = false;
    //if user.refreshToken is not hashed varify throws error
    try {
      refreshTokenMatched = await verify(user.refreshToken, refreshToken);
    } catch (_) {
      throw new UnauthorizedException('Invalid Refresh Token!');
    }

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');
    const currentUser = { id: user.id };
    return currentUser;
  }
}
