import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { AigaUsersController } from './controllers/aiga-users.controller';
import { AigaUsersService } from './services/aiga-users.service';
import { Chatting } from 'src/typeorm/entities/Chatting';
import { TokenResetLog } from 'src/typeorm/entities/TokenResetLog';

@Module({
  imports: [
    TypeOrmModule.forFeature([AigaUser, Chatting, TokenResetLog], 'service'),
  ],
  controllers: [AigaUsersController],
  providers: [AigaUsersService],
})
export class AigaUsersModule {}
