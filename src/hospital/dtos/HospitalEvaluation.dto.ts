import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HospitalEvaluationDto {
  @ApiProperty({ description: '병원 평가 ID' })
  @IsNumber()
  hospitalEvalId: number;

  @ApiProperty({ description: '병원 ID' })
  @IsString()
  hid: string;

  @ApiProperty({ description: '데이터 버전 ID' })
  @IsNumber()
  dataVersionId: number;

  @ApiProperty({ description: '매칭된 진료과목', required: false })
  @IsOptional()
  @IsString()
  matchedDept: string | null;

  @ApiProperty({ description: '공개 점수', required: false })
  @IsOptional()
  @IsNumber()
  publicScore: number | null;

  @ApiProperty({ description: '생성일시' })
  @IsDateString()
  createAt: Date;

  @ApiProperty({ description: '수정일시', required: false })
  @IsOptional()
  @IsDateString()
  updateAt: Date | null;
}
