import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from 'src/typeorm/entities/Notice';
import { Doctor } from 'src/typeorm/entities/Doctor'; // Doctor 엔티티 임포트
import { NoticesController } from './controllers/notices/notices.controller';
import { NoticesService } from './services/notices/notice.service';
import { AigaUser } from 'src/typeorm/entities/AigaUser';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice,AigaUser], 'service'), // 'service' 연결용
    TypeOrmModule.forFeature([Doctor], 'default'), // 'default' 연결용
  ],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticeModule {}