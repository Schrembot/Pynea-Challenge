import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: `User's first name` })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: `User's last name` })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'j.doe@gmail.com',
    description: `User's email address`,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password1234aBcD!', description: `User's password` })
  @IsStrongPassword()
  @IsNotEmpty()
  @Length(6, 50, {
    message: 'Password length Must be between 6 and 50 charcters',
  })
  password: string;
}
