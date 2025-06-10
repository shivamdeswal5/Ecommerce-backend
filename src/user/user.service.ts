import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserQueryDto } from './dto/find-all-user-query.dto.ts';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService, 
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existing) {
      throw new HttpException('User with this email already exists', 400);
    }

    const newUser = this.userRepository.create(createUserDto);
    // await this.mailService.sendMail(
    //   newUser.email,
    //   'Welcome to Zenmomk',
    //   `Hello ${newUser.firstName},\n\nThank you for registering with Zenmomk!.\n\nBest regards,\nZenmomk Team`,
    // );  
    return await this.userRepository.save(newUser);
  }

  async findAll(query: FindAllUserQueryDto) {
  const { page = 1, limit = 10, search } = query;

  const qb = this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.addresses', 'address'); 

  if (search) {
    qb.andWhere(
      `(LOWER(user.firstName) LIKE LOWER(:search) 
        OR LOWER(user.lastName) LIKE LOWER(:search) 
        OR LOWER(user.email) LIKE LOWER(:search))`,
      { search: `%${search}%` },
    );
  }

  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();



  return {
    data,
    total,
    page,
    limit,
  };
}


  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses'],
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (existing) {
        throw new HttpException('Email already in use by another user', 400);
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
