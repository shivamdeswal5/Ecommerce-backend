import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),CategoryModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Product).extend(ProductRepository.prototype),
      inject: [DataSource],
    },
  ],
  exports: [ProductRepository],
})
export class ProductModule {}