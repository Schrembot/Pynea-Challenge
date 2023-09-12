import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please enter a first name' })
  @IsString({ message: 'Please enter a valid first name' })
  @ApiProperty({ example: 'John', description: `User's first name` })
  firstName: string;

  @IsNotEmpty({ message: 'Please enter a last name' })
  @IsString({ message: 'Please enter a valid last name' })
  @ApiProperty({ example: 'Doe', description: `User's last name` })
  lastName: string;

  @IsNotEmpty({ message: 'Please enter a last email address' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({
    example: 'j.doe@gmail.com',
    description: `User's email address`,
  })
  email: string;

  @IsStrongPassword()
  @IsNotEmpty({ message: 'Please enter a password' })
  @Length(6, 50, {
    message: 'Password length Must be between 6 and 50 charcters',
  })
  @ApiProperty({ example: 'password1234aBcD!', description: `User's password` })
  password: string;
}
