import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique email address of the user',example: 'user@gmail.com'})

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    minLength: 6,
    maxLength: 32,
    example: 'password123',
  })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @MaxLength(32, { message: 'Password must be at most 32 characters.' })
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Shivam',
  })
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Deswal',
  })
  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string; 

  @ApiProperty({
    description: 'Phone number of the user',
    required: false,
    example: '9876543210',
  })
  @IsOptional()
  @IsPhoneNumber('IN')
  phoneNumber?: string;
} 
