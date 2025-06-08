import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Category).extend(CategoryRepository.prototype);
      },
      inject: [DataSource],
    },
  ],
  exports: [CategoryRepository],
})
export class CategoryModule {}