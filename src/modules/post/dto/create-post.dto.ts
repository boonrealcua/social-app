import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    required: true,
  })
  content: string;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  private: boolean;
}
