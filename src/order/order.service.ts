import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';
import { UserRepository } from '../user/user.repository';
import { ProductRepository } from '../product/product.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/product/entities/product.entity';
import { Transactional } from 'typeorm-transactional';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private dataSource: DataSource,
  ) {}

  // async create(createOrderDto: CreateOrderDto) {
  //   const { userId, items } = createOrderDto;

  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) throw new NotFoundException('User not found');

  //   let totalPrice = 0;

  //   const orderItemsData: {
  //     product: Product;
  //     quantity: number;
  //     price: number;
  //   }[] = [];

  //   for (const item of items) {
  //     const product = await this.productRepository.findOne({
  //       where: { id: item.productId },
  //     });
  //     if (!product) {
  //       throw new NotFoundException(
  //         `Product with ID ${item.productId} not found`,
  //       );
  //     }

  //     const itemTotal = product.price * item.quantity;
  //     totalPrice += itemTotal;

  //     orderItemsData.push({
  //       product,
  //       quantity: item.quantity,
  //       price: product.price,
  //     });
  //   }

  //   const order = this.orderRepository.create({
  //     user,
  //     totalPrice,
  //   });

  //   const savedOrder = await this.orderRepository.save(order);

  //   for (const item of orderItemsData) {
  //     const orderItem = this.orderItemRepository.create({
  //       order: savedOrder,
  //       product: item.product,
  //       quantity: item.quantity,
  //       price: item.price,
  //     });
  //     await this.orderItemRepository.save(orderItem);
  //   }

  //   return this.orderRepository.findOne({
  //     where: { id: savedOrder.id },
  //     relations: ['user', 'items', 'items.product'],
  //   });
  // }

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { userId, items } = createOrderDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      let totalPrice = 0;

      const orderItemsData: {
        product: Product;
        quantity: number;
        price: number;
      }[] = [];

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;

        orderItemsData.push({
          product,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const order = queryRunner.manager.create(Order, {
        user,
        totalPrice,
      });

      const savedOrder = await queryRunner.manager.save(Order,order);

      for (const item of orderItemsData) {
        const orderItem = queryRunner.manager.create(OrderItem,{
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        });
        await queryRunner.manager.save(OrderItem,orderItem);
      }

      const result =  queryRunner.manager.findOne(Order,{
        where: { id: savedOrder.id },
        relations: ['user', 'items', 'items.product'],
      });
      await queryRunner.commitTransaction();
      return result;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating order:', error);
      throw new NotFoundException('Error creating order');
    } finally {
      await queryRunner.release();
      
    }
  }

  async findAll() {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.items.length > 0) {
      await this.orderItemRepository.remove(order.items);
    }

    const newItems: OrderItem[] = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findOneBy({
        id: item.productId,
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      const orderItem = this.orderItemRepository.create({
        order,
        product,
        quantity: item.quantity,
        price: product.price,
      });

      newItems.push(orderItem);
    }

    const savedItems = await this.orderItemRepository.save(newItems);

    order.items = savedItems;
    order.totalPrice = savedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return await this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.orderRepository.remove(order);
  }
}
