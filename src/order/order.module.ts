import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';
import { UserRepository } from '../user/user.repository';
import { ProductRepository } from '../product/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Order).extend(OrderRepository.prototype),
      inject: [DataSource],
    },
    {
      provide: OrderItemRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(OrderItem).extend(OrderItemRepository.prototype),
      inject: [DataSource],
    },
    UserRepository,
    ProductRepository,
  ],
  exports: [OrderRepository, OrderItemRepository],
})
export class OrderModule {}