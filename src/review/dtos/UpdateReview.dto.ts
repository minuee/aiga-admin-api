import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  review_id: number;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;
  
  @ApiProperty()
  @IsNotEmpty()
  doctor_id: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  total_score: number;

  @ApiProperty()
  @IsOptional()
  kindness_score: number;

  @ApiProperty()
  @IsOptional()
  explaination_score: number;

  @ApiProperty()
  @IsOptional()
  satisfaction_score: number;

  @ApiProperty()
  @IsOptional()
  recommand_score: number;

  @ApiProperty()
  @IsOptional()
  nickname: string;
}