import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  f_name: string;

  @ApiProperty()
  @IsNotEmpty()
  l_name: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
