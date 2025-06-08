import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './review/review.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          logging: true,
          entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
            migrations: [path.resolve(__dirname, '../database/migrations/*-migration.ts')],
          autoLoadEntities: true,
      }
    ),
    }),
    UserModule,
    AddressModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ReviewModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
