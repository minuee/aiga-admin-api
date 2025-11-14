import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opinion } from 'src/typeorm/entities/Opinion';
import { Doctor } from 'src/typeorm/entities/Doctor'; // Doctor 엔티티 임포트
import { OpinionsController } from './controllers/opinions/opinions.controller';
import { OpinionsService } from './services/opinions/opinion.service';
import { AigaUser } from 'src/typeorm/entities/AigaUser';

@Module({
  imports: [
    TypeOrmModule.forFeature([Opinion,AigaUser], 'service'), // 'service' 연결용
    TypeOrmModule.forFeature([Doctor], 'default'), // 'default' 연결용
  ],
  controllers: [OpinionsController],
  providers: [OpinionsService],
})
export class OpinionsModule {}