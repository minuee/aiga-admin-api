import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAnalysisStatisticsDto {
  @IsString()
  start_date: string;

  @IsString()
  end_date: string;
  
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsString()
  @IsIn(['doctor', 'hospital', 'keyword', 'token'])
  searchType?: 'doctor' | 'hospital' | 'keyword' | 'token';

  @IsOptional()
  @IsString()
  keyword?: string;
}
