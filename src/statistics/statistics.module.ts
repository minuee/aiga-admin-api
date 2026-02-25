
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './controllers/statistics.controller';
import { StatisticsService } from './services/statistics.service';
import { AigaUser } from '@entities/AigaUser';
import { Chatting } from '@entities/Chatting';
import { ChatSearchLog } from '@entities/ChatSearchLog';
import { ChatSearchProposal } from '@entities/ChatSearchProposal';
import { Doctor } from '@entities/Doctor';
import { Hospital } from '@entities/Hospital';
import { DataHistory } from '@entities/DataHistory';
import { StandardDeptSpec } from '@entities/StandardDeptSpec';
import { StandardSpecialty }  from '@entities/StandardSpecialty';
import { DoctorEvaluation } from '@entities/DoctorEvaluation'; // DoctorEvaluation 엔티티 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Hospital, DoctorEvaluation, StandardDeptSpec, StandardSpecialty, DataHistory], 'default'), // DoctorEvaluation 추가
    TypeOrmModule.forFeature(
      [AigaUser, Chatting, ChatSearchLog, ChatSearchProposal],
      'service',
    ),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
