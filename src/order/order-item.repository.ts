import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
  constructor(private readonly dataSource: DataSource) {
    super(OrderItem, dataSource.createEntityManager());
  }

}