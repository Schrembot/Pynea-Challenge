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
import {
  ApiOperation,
  ApiTags,
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../modules/users/dto/update-user.dto';
import {
  ResponseUserDtoItem,
  ResponseUserDtoList,
  ResponseUserDtoNull,
} from '../modules/users/dto/response-user.dto';

@Controller('api/users')
@ApiTags('Users')
@UseFilters(new HttpExceptionFilter())
export class ApiController {
  constructor(private readonly usersModule: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiCreatedResponse({
    description: 'Created',
    type: ResponseUserDtoItem,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return {
      data: await this.usersModule.createUser(createUserDto),
      error: null,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve Users' })
  @ApiOkResponse({
    description: 'OK',
    type: ResponseUserDtoList,
  })
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
  @ApiOperation({ summary: 'Retrieve User' })
  @ApiOkResponse({
    description: 'OK',
    type: ResponseUserDtoItem,
  })
  @ApiNotFoundResponse()
  async getUserById(@Param('id') id: string): Promise<any> {
    const user = await this.usersModule.getUser(id);

    if (!user) throw new NotFoundException('User not found');
    // TODO: Different behaviour if it's an Admin requesting User data
    if (user.deleted) throw new NotFoundException('User not found');

    return {
      data: user,
      error: null,
    };
  }

  @Patch(`:id`)
  @ApiOperation({ summary: 'Update User' })
  @ApiOkResponse({
    description: 'OK',
    type: ResponseUserDtoItem,
  })
  @ApiNotFoundResponse()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return {
      data: await this.usersModule.updateUser(id, updateUserDto),
      error: null,
    };
  }

  @Delete(`:id`)
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete User' })
  @ApiNoContentResponse({
    description: 'No content',
    type: ResponseUserDtoNull,
  })
  async deleteUser(@Param('id') id: string): Promise<any> {
    await this.usersModule.deleteUser(id);

    return {
      data: {},
      error: null,
    };
  }

  @Delete(``)
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async deleteUsers(): Promise<any> {
    await this.usersModule.clearDeletedUsers();

    return {
      data: [],
      error: null,
    };
  }
}
