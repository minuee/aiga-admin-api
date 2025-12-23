import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { AigaUsersController } from './controllers/aiga-users.controller';
import { AigaUsersService } from './services/aiga-users.service';
import { Chatting } from 'src/typeorm/entities/Chatting';

@Module({
  imports: [TypeOrmModule.forFeature([AigaUser, Chatting], 'service')],
  controllers: [AigaUsersController],
  providers: [AigaUsersService],
})
export class AigaUsersModule {}
