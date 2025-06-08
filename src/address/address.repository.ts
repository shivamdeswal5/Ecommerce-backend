import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressRepository extends Repository<Address> {
  constructor(private readonly dataSource: DataSource) {
    super(Address, dataSource.createEntityManager());
  }


}
