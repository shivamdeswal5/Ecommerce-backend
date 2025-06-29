import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { MailModule } from 'src/mail/mail.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(User).extend(UserRepository.prototype);
      },
      inject: [DataSource],
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
