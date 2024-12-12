import { IsNotEmpty } from 'class-validator';

export class UpdateBlogDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  summary: string;
  @IsNotEmpty()
  content: string;
}
