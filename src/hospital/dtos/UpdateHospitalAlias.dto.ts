import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHospitalAliasDto {
  @ApiProperty({ description: '별칭 ID' })
  @IsNumber()
  @IsNotEmpty()
  aid: number;

  @ApiProperty({ description: '변경할 별칭 이름' })
  @IsString()
  @IsNotEmpty()
  alias_name: string;
}
