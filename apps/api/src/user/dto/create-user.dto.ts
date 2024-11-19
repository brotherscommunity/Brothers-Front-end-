import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nickName: string;

  @IsString()
  userName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Validate that each element in the array is a string
  languages: string[];

  @IsDateString()
  dob: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  telegramUserName: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  vkId: string;

  @IsString()
  @IsOptional()
  facebookId: string;

  @IsString()
  @IsOptional()
  weChatId: string;

  @IsString()
  @IsOptional()
  instagramUserName: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  referalId: string;

  // @IsEnum(Sex)
  // sex: Sex;
  @IsString()
  sex: string;

  //   vkId;

  //   facebookId;

  //   wechatId;

  //   city;

  //   country;

  //   state;

  //   password;

  //   referalId;
}
