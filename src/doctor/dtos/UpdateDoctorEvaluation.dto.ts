import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDoctorEvaluationDto {
  @IsNumber()
  @IsOptional()
  kindness?: number;

  @IsNumber()
  @IsOptional()
  satisfaction?: number;

  @IsNumber()
  @IsOptional()
  explanation?: number;

  @IsNumber()
  @IsOptional()
  recommendation?: number;

  @IsNumber()
  @IsOptional()
  patientScore?: number;

  @IsNumber()
  @IsOptional()
  paperScore?: number;

  @IsNumber()
  @IsOptional()
  publicScore?: number;

  @IsString()
  @IsOptional()
  peerScore?: string;
}
