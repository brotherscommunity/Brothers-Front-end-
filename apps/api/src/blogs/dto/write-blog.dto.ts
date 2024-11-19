import { IsArray, IsOptional, IsString } from 'class-validator';

export class writeBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  @IsString({ each: true })
  references: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsOptional()
  videoLink: string;
}
