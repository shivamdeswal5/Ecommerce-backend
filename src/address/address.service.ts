import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dto/create-address-dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepository) {}

  async create(dto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepo.create(dto);
    return this.addressRepo.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepo.find();
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(id: string, dto: UpdateAddressDto): Promise<Address> {
    await this.findOne(id); 
    await this.addressRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Address> {
    const address = await this.findOne(id);
    const result = await this.addressRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Address not found');
    return address;
  }
}
