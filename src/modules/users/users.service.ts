import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { firstName, lastName, email, password } = createUserDto;

    if (!password) {
      throw new BadRequestException('Argument `password` is missing.');
    }

    try {
      // Try constructing the password
      const hashPassword = await bcrypt.hash(password, 10);

      // call repository layer
      const user = await this.repository.createUser({
        data: {
          firstName,
          lastName,
          email,
          password: hashPassword,
        },
      });
      // do other things in the service layer... e.g. send email verification etc...

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        switch (e.code) {
          case 'P2002':
            throw new ConflictException('Email already in use');
        }
      }

      if (e instanceof Prisma.PrismaClientValidationError) {
        // Review this - don't like this approach of split + pop
        throw new BadRequestException(e.message.split('\n').pop());
      }

      throw e;
    }
  }

  async getUser(id: string): Promise<any> {
    // call repository layer
    const user: User | null = await this.repository.getUser({ id });

    // do other things in the service layer...
    if (user?.deleted) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async listUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<any> {
    const { skip, take, cursor, where, orderBy } = params;

    // call repository layer
    const users = await this.repository.listUsers({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    // do other things in the service layer...

    return users;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<any> {
    try {
      // If the password is being updated, hash it
      if (data.password) {
        const hashPassword = await bcrypt.hash(data.password as string, 10);
        data.password = hashPassword;
      }

      // call repository layer
      const user = await this.repository.updateUser({ where: { id }, data });

      // do other things in the service layer...

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        switch (e.code) {
          case 'P2002':
            throw new ConflictException('Email already in use');
        }
      }

      if (e instanceof Prisma.PrismaClientValidationError) {
        // Review this - don't like this approach of split + pop
        throw new BadRequestException(e.message.split('\n').pop());
      }

      throw e;
    }
  }

  async deleteUser(id: string): Promise<any> {
    // Prepare to anonymise the user
    // Set the password to anything and hash it to prevent the user from logging in with their ID again
    const new_password = await bcrypt.genSalt(20);

    const data = {
      firstName: 'DELETED',
      lastName: 'DELETED',
      email: `${id}@DELETED.COM`,
      password: await bcrypt.hash(new_password as string, 10),
      deleted: true,
    };

    // call repository layer
    const user = await this.repository.updateUser({ where: { id }, data });

    // do other things in the service layer...

    return user;
  }

  // TODO: Not for production ... this is a hack to clear out deleted users
  async clearDeletedUsers(): Promise<any> {
    const where = {
      firstName: 'DELETED',
      lastName: 'DELETED',
      email: {
        contains: '@DELETED.COM',
      },
      deleted: true,
    };

    // call repository layer
    return await this.repository.deleteUsers(where);
  }
}
