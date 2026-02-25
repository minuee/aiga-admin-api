import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { DoctorCareerItemDto } from './DoctorCareerItem.dto';

export class UpdateDoctorCareerDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorCareerItemDto)
  jsondata: DoctorCareerItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorCareerItemDto)
  education: DoctorCareerItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorCareerItemDto)
  career: DoctorCareerItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorCareerItemDto)
  etc: DoctorCareerItemDto[];
}
