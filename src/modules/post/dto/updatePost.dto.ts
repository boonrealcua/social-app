import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
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
