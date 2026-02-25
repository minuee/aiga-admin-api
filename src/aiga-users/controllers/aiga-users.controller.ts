import { Controller,Get,Post,Body,Param,Delete,Patch,Query,Put} from '@nestjs/common';
import { AigaUsersService } from '../services/aiga-users.service';
import { CreateAigaUserDto } from '../dtos/CreateAigaUser.dto';
import { UpdateAigaUserDto } from '../dtos/UpdateAigaUser.dto';
import { PageDto, PageOptionsDto } from 'src/config/pagination';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { ResetRestrictionDto } from '../dtos/ResetRestriction.dto';

@Controller('aiga-users')
export class AigaUsersController {
  constructor(private readonly aigaUsersService: AigaUsersService) {}

  @Post()
  createAigaUser(@Body() createAigaUserDto: CreateAigaUserDto) {
    return this.aigaUsersService.createAigaUser(createAigaUserDto);
  }

  @Put('/reset-restriction/:userId')
  resetRestriction(
    @Param('userId') userId: string,
    @Body() resetDto: ResetRestrictionDto,
  ) {
    return this.aigaUsersService.resetRestriction(userId, resetDto.adminId);
  }

  @Get()
  getAigaUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<AigaUser>> {
    return this.aigaUsersService.findAigaUsers(pageOptionsDto);
  }

  @Get(':user_id')
  getAigaUserById(@Param('user_id') user_id: string) {
    return this.aigaUsersService.getAigaUser(user_id);
  }

  @Patch(':user_id')
  updateAigaUserById(
    @Param('user_id') user_id: string,
    @Body() updateAigaUserDto: UpdateAigaUserDto,
  ) {
    return this.aigaUsersService.updateAigaUser(user_id, updateAigaUserDto);
  }

  @Delete(':user_id')
  deleteAigaUserById(@Param('user_id') user_id: string) {
    return this.aigaUsersService.deleteAigaUser(user_id);
  }
}
