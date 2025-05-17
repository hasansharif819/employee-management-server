import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Sharif Hasan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'hs.sharif819@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'CTO' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  @IsOptional()
  manager_id?: number;
}
