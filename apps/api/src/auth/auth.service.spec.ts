import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { UserService } from '../user/user.service';
// import { JwtService } from '@nestjs/jwt';
// import { ConflictException } from '@nestjs/common';
// import * as argon2 from 'argon2'; // Importing argon2 for mocking
// import refreshConfig from './config/refresh.config';
// import { CreateUserDto } from '../user/dto/create-user.dto';
// import { StatusOk } from './types/status-ok';

// jest.mock('../user/user.service'); // Mocking user service
// jest.mock('@nestjs/jwt'); // Mocking JWT service
// jest.mock('argon2'); // Mocking argon2 for hashing

// describe('AuthService', () => {
//   let authService: AuthService;
//   let userService: UserService;
//   let jwtService: JwtService;
//   let refreshTokenConfig: any;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: UserService,
//           useValue: {
//             findByEmail: jest.fn(),
//             create: jest.fn(),
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             signAsync: jest.fn(),
//           },
//         },
//         {
//           provide: refreshConfig.KEY,
//           useValue: { refreshTokenExpiry: '1h' }, // Mocked config value
//         },
//       ],
//     }).compile();

//     authService = module.get<AuthService>(AuthService);
//     userService = module.get<UserService>(UserService);
//     jwtService = module.get<JwtService>(JwtService);
//     refreshTokenConfig = module.get<any>(refreshConfig.KEY);
//   });

//   describe('register', () => {
//     it('should throw ConflictException if the user already exists', async () => {
//       const createUserDto: CreateUserDto = {
//         firstName: 'John',
//         lastName: 'Doe',
//         nickName: 'Johnny',
//         userName: 'johnd',
//         languages: ['English', 'Spanish'],
//         dob: new Date(),
//         email: 'johnd@example.com',
//         telegramUserName: 'john_telegram',
//         phoneNumber: '1234567890',
//         vkId: 'john_vk',
//         facebookId: 'john_fb',
//         weChatId: 'john_wechat',
//         instagramUserName: 'john_insta',
//         country: 'USA',
//         state: 'California',
//         password: 'securePassword123!',
//         referalId: 'ref123',
//         sex: 'male',
//       };

//       // Mock the behavior of `findByEmail` to return a user already existing
//       userService.findByEmail = jest.fn().mockResolvedValueOnce({ id: 1 });

//       await expect(authService.register(createUserDto)).rejects.toThrow(
//         ConflictException,
//       );
//     });

//     it('should create a new user and return status "ok" if successful', async () => {
//       const createUserDto: CreateUserDto = {
//         firstName: 'John',
//         lastName: 'Doe',
//         nickName: 'Johnny',
//         userName: 'johnd',
//         languages: ['English', 'Spanish'],
//         dob: new Date(),
//         email: 'johnd@example.com',
//         telegramUserName: 'john_telegram',
//         phoneNumber: '1234567890',
//         vkId: 'john_vk',
//         facebookId: 'john_fb',
//         weChatId: 'john_wechat',
//         instagramUserName: 'john_insta',
//         country: 'USA',
//         state: 'California',
//         password: 'securePassword123!',
//         referalId: 'ref123',
//         sex: 'male',
//       };

//       // Mock the behavior of `findByEmail` to return null (no existing user)
//       userService.findByEmail = jest.fn().mockResolvedValueOnce(null);
//       userService.create = jest.fn().mockResolvedValueOnce(true);

//       // Mock the hashing behavior
//       (argon2.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

//       const result = await authService.register(createUserDto);

//       expect(result.status).toBe('ok');
//       expect(result.message).toBe(
//         'Account has been created. Please sign in to continue.',
//       );
//       // expect(userService.create).toHaveBeenCalledWith({
//       //   password: 'hashedPassword',
//       //   email: createUserDto.email,
//       //   userName: createUserDto.userName,
//       //   // other fields...
//       // });
//       expect(userService.create).toHaveBeenCalledWith(createUserDto);
//     });
//   });

//   // You can write additional tests for the `signIn`, `signOut`, and other methods similarly.
// });
