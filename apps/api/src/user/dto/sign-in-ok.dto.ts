import { Expose } from 'class-transformer';

export class SigninOkDto {
  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  //   @Expose()
  //   followers: number;

  //   @Expose()
  //   following: number;

  @Expose()
  referalId: string | null;

  @Expose()
  city: string;

  @Expose()
  country: string;

  @Expose()
  role: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
