import { IsNotEmpty } from 'class-validator';

export class CreateBlogCommentDto {
  @IsNotEmpty()
  content: string;
}
