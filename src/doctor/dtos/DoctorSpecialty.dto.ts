import { ApiProperty } from '@nestjs/swagger';

export class DoctorSpecialtyDto {
  @ApiProperty()
  specialty_id: number;

  @ApiProperty()
  specialty: string;
}
