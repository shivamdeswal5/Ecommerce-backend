import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './review.repository';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]),UserModule,ProductModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: ReviewRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Review).extend(ReviewRepository.prototype);
      },
      inject: [DataSource],
    },
  ],
  exports: [ReviewRepository],
})
export class ReviewModule {}