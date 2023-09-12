import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { HttpExceptionFilter } from '../http-exception.filter';

@Controller('api/users')
@UseFilters(new HttpExceptionFilter())
export class ApiController {
  constructor(private readonly usersModule: UsersService) {}

  @Post()
  async createUser(
    @Body()
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ): Promise<any> {
    const { firstName, lastName, email, password } = data;

    return {
      data: await this.usersModule.createUser({
        firstName,
        lastName,
        email,
        password,
      }),
      error: null,
    };
  }

  @Get()
  async getUsers(): Promise<any> {
    const where = {
      deleted: false,
    };

    return {
      data: await this.usersModule.listUsers({ where }),
      error: null,
    };
  }

  @Get(`:id`)
  async getUserById(@Param('id') id: string): Promise<any> {
    const user = await this.usersModule.getUser({ id });

    if (!user) throw new NotFoundException('User not found');
    // TODO: Different behaviour if it's an Admin requesting User data
    if (user.deleted) throw new NotFoundException('User not found');

    return {
      data: user,
      error: null,
    };
  }

  @Patch(`:id`)
  async updateUser(
    @Param('id') id: string,
    @Body()
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    },
  ): Promise<any> {
    return {
      data: await this.usersModule.updateUser({ id, data }),
      error: null,
    };
  }

  @Delete(`:id`)
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<any> {
    const data = {
      firstName: 'DELETED',
      lastName: 'DELETED',
      email: `${id}@DELETED.COM`,
      deleted: true,
    };

    await this.usersModule.updateUser({ id, data });

    return {
      data: null,
      error: null,
    };
  }

  @Delete(``)
  @HttpCode(204)
  async deleteUsers(): Promise<any> {
    await this.usersModule.clearDeletedUsers();

    return {
      data: null,
      error: null,
    };
  }
}
