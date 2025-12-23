import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe, Query, NotFoundException } from '@nestjs/common';
import { AigaUsersService } from '../services/aiga-users.service';
import { CreateAigaUserDto } from '../dtos/CreateAigaUser.dto';
import { UpdateAigaUserDto } from '../dtos/UpdateAigaUser.dto';
import { PageDto, PageOptionsDto } from 'src/config/pagination';

@Controller('aiga-users')
export class AigaUsersController {
  constructor(private readonly aigaUsersService: AigaUsersService) {}

  @Post()
  createAigaUser(@Body() createAigaUserDto: CreateAigaUserDto) {
    return this.aigaUsersService.createAigaUser(createAigaUserDto);
  }

  @Get()
  async getAigaUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CreateAigaUserDto>> {
    try {
      let retData:any = {
        data : [],
        meta : {
          currentPage : 0,
          pageCount : 0,
          totalCount : 0,
          isOrder : 'default',
          orderBy : 'ASC',
          orderName : 'null'
        }
      }
      const users:any = await this.aigaUsersService.findAigaUsers(pageOptionsDto);
      if ( users.length > 0 ) {
        retData = {
          data : users,
          meta : {
            currentPage : pageOptionsDto.page,
            pageCount : pageOptionsDto.take,
            orderBy : pageOptionsDto.order,
            orderName : pageOptionsDto.orderName,
            isAll : pageOptionsDto.isAll,
            totalCount : parseInt(users[0].totalCount)
          }
        }
        return retData;
      }
      return retData; // 데이터가 없는 경우 빈 retData 반환
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('AigaUser not found');
    }
  }

  @Get(':user_id')
  getAigaUserById(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.aigaUsersService.getAigaUser(user_id);
  }

  @Patch(':user_id')
  updateAigaUserById(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() updateAigaUserDto: UpdateAigaUserDto,
  ) {
    return this.aigaUsersService.updateAigaUser(user_id, updateAigaUserDto);
  }

  @Delete(':user_id')
  deleteAigaUserById(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.aigaUsersService.deleteAigaUser(user_id);
  }
}
