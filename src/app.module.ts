import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ApiModule } from './api/api.module';

import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    ApiModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      formatError: (
        formattedError: GraphQLFormattedError,
        originalError: GraphQLError,
      ): GraphQLFormattedError => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: originalError?.message,
          locations: formattedError.locations,
          path: formattedError.path,
          extensions: formattedError.extensions,
        };
        return graphQLFormattedError;
      },
    }),
    PrometheusModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
