import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query()
  async getUser(@Args('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Query()
  async listUsers(
    @Args('sort') sort: Object,
    @Args('where') where: Array<Object>,
  ) {
    let filter = JSON.parse(
      JSON.stringify({ ...(where ? where[0] : {}), deleted: false }),
    );
    return this.usersService.listUsers({ where: filter, orderBy: sort });
  }

  @Mutation()
  async createUser(@Args('data') data: CreateUserDto) {
    return await this.usersService.createUser(data);
  }

  @Mutation()
  async updateUser(@Args('id') id: string, @Args('data') data: UpdateUserDto) {
    return await this.usersService.updateUser(id, data);
  }

  @Mutation()
  async deleteUser(@Args('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
