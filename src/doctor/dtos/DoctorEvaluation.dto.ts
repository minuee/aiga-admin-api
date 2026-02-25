import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DoctorEvaluationDto {
  @ApiProperty({ description: '의사 평가 ID' })
  @IsNumber()
  doctorEvalId: number;

  @ApiProperty({ description: '의사 ID' })
  @IsNumber()
  doctorId: number;

  @ApiProperty({ description: '데이터 버전 ID' })
  @IsNumber()
  dataVersionId: number;

  @ApiProperty({ description: '표준 진료과', required: false })
  @IsOptional()
  @IsString()
  standardSpec: string | null;

  @ApiProperty({ description: '친절도', required: false })
  @IsOptional()
  @IsNumber()
  kindness: number | null;

  @ApiProperty({ description: '만족도', required: false })
  @IsOptional()
  @IsNumber()
  satisfaction: number | null;

  @ApiProperty({ description: '설명', required: false })
  @IsOptional()
  @IsNumber()
  explanation: number | null;

  @ApiProperty({ description: '추천도', required: false })
  @IsOptional()
  @IsNumber()
  recommendation: number | null;

  @ApiProperty({ description: '환자 점수', required: false })
  @IsOptional()
  @IsNumber()
  patientScore: number | null;

  @ApiProperty({ description: '논문 점수', required: false })
  @IsOptional()
  @IsNumber()
  paperScore: number | null;

  @ApiProperty({ description: '공개 점수', required: false })
  @IsOptional()
  @IsNumber()
  publicScore: number | null;

  @ApiProperty({ description: '동료 점수 (TEXT)', required: false })
  @IsOptional()
  @IsString()
  peerScore: string | null;

  @ApiProperty({ description: '생성일시' })
  @IsDateString()
  createAt: Date;

  @ApiProperty({ description: '수정일시', required: false })
  @IsOptional()
  @IsDateString()
  updateAt: Date | null;
}
