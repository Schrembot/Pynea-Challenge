import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [UsersModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
