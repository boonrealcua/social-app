import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  profileImg: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  birthDate: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  instagramUrl: string;

  @ApiProperty()
  linkedinUrl: string;

  @ApiProperty()
  facebookUrl: string;
}
