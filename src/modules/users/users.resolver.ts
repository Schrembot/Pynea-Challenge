import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query()
  async getUser(@Args('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Query()
  async listUsers() {
    const where = {
      deleted: false,
    };

    return this.usersService.listUsers({ where });
  }

  @Mutation()
  async createUser(@Args('data') data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Mutation()
  async updateUser(@Args('id') id: string, @Args('data') data: UpdateUserDto) {
    return this.usersService.updateUser(id, data);
  }

  @Mutation()
  async deleteUser(@Args('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
