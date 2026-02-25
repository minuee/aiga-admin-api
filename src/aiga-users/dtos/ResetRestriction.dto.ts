
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetRestrictionDto {
  @IsString()
  @IsNotEmpty()
  adminId: string;
}
