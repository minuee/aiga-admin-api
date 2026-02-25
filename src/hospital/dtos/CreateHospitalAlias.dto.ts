import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHospitalAliasDto {
  @ApiProperty({ description: '병원 HID' })
  @IsString()
  @IsNotEmpty()
  hid: string;

  @ApiProperty({ description: '표준 이름' })
  @IsString()
  @IsNotEmpty()
  standard_name: string;

  @ApiProperty({ description: '약칭' })
  @IsString()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty({ description: '별칭 이름' })
  @IsString()
  @IsNotEmpty()
  alias_name: string;
}
