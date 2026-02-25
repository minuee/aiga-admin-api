import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class DoctorCareerItemDto {
  @IsString()
  @IsOptional()
  targetDate: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUrl()
  @IsOptional()
  url: string | null;

  @IsString()
  @IsOptional()
  issuer: string | null;
}
