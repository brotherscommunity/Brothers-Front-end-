// import { IsInt } from 'class-validator';
// import { writeBlogDto } from './write-blog.dto';
// import { Type } from 'class-transformer';

// export class EditBlogDto extends writeBlogDto {
//   @Type(() => Number) // Transform the string to a number
//   @IsInt() // Validate that it's an integer
//   id: number;
// }

import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditBlogDto {
  @Type(() => Number) // Transform the string to a number
  @IsInt()
  id: number;

  // @IsString()
  // id: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  references: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsOptional()
  videoLink: string;
}
