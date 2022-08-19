import { IsEmail, IsNotEmpty } from 'class-validator';
import { BeforeInsert } from 'typeorm';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
