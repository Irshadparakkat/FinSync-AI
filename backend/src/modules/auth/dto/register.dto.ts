import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AUTH } from '../constants/auth.constants';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'john@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    minLength: AUTH.PASSWORD_MIN_LENGTH,
    description: `Minimum ${AUTH.PASSWORD_MIN_LENGTH} characters`,
  })
  @IsString()
  @MinLength(AUTH.PASSWORD_MIN_LENGTH)
  @MaxLength(128)
  password!: string;
}
