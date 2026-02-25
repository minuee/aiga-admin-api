import { IsString, IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class UpdateDoctorBasicDto {
  @IsString()
  doctorname: string;

  @IsString()
  profileimgurl: string;

  @IsString()
  specialties: string;

  @IsString()
  new_doctor_url: string;

  @IsString()
  is_active?: string;
}
