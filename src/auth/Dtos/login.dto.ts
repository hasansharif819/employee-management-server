import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'nasimhelal@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;
}
