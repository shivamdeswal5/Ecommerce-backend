import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { AddressRepository } from './address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [
    AddressService,
    {
      provide: AddressRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Address).extend(AddressRepository.prototype);
      },
      inject: [DataSource],
    },
  ],
  exports: [AddressRepository],
})
export class AddressModule {}
