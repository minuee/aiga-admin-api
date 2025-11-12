import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { Review } from 'src/typeorm/entities/Review';
import { Doctor } from 'src/typeorm/entities/Doctor'; // Doctor 엔티티 임포트
import { ReviewsController } from './controllers/reviews/reviews.controller';
import { ReviewsService } from './services/reviews/reviews.service';
import { AigaUser } from 'src/typeorm/entities/AigaUser';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review,AigaUser], 'service'), // 'service' 연결용
    TypeOrmModule.forFeature([Doctor], 'default'), // 'default' 연결용
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}