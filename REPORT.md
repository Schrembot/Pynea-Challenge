# Overview

    1.  Project is NestJS following site recommendations along with Prisma.  Postgres is setup via Docker
    2.  User entity setup, plus delete flag
    3.  GraphQL schema setup, PLUS REST API
    4.  CRUD operations added, both GQL & REST
    5.  Validation done, see tests
    6.  E2E tests for both GQL & REST
    7.  Playground for GQL, OpenAPI for REST setup, TODO: Documentation
    8.  Bonus:
        - [x] Auth
        - [ ] Sorting + Filtering
        - [ ] Dockerize - Needs optimising.

## Running the application

    # Application is available to run directly, via docker and via docker-compose

    To run all at once
    - Run the entire system with: ```docker compose up -d```

    To run locally
    - Start a Postgres instance is required on port 5432 either directly or in a container.
    - Set the PG account data in the .env file to access the PG database
    - Run the migration script to set up the database: ```npm run migrate:dev```
    - Run the application: ```npm run start:dev```
    - Alternative, combine migration & start with: ```npm run test:e2e```

    To run in a container:
    - Start a Postgres instance is required on port 5432 either directly or in a container.
    - Set the PG account data in the .env file to access the PG database
    - Build API image: ```docker build -t pynea-api .```
    - Launch container: ```docker run --rm -it --env-file=./.env -e POSTGRES_HOST=host.docker.internal -p 3000:3000 --name=pynea-api pynea-api```

    In all cases, the default app will be visible on http://localhost:3000
    - GraphQL playground: http://localhost:3000/graphql
    - REST API OpenAPI: http://localhost:3000/api/docs
    - REST API Endpoints: http://localhost:3000/api/users

# Testing:

    - Testing requires a Postgres instance running with connection data in .env
    - To perform End-to-End tests: ```npm run test:e2e```

## GraphQL

    # Playground: http://localhost:3000/graphql
    # Sort and Filters
    # Tested
    # TODO: Work out best approach to remove 'password' from user(s) response for security
    # TODO: Messaging back to user isn't as user-friendly as REST API
    # TODO: Pagination

## EXTRA: REST API

    # OpenAPI setup: http://localhost:3000/api/docs
    # Endpoints: http://localhost:3000/api/users
    # Tested
    # A "clearDeletedUsers" method exists to clear out the DB which shouldn't be sent into production, need to work on that
    # TODO: Ready for some HATEOS inputs
    # TODO: Sort, Filters, Pagination

## EXTRA: Delete flag

    # [DELETE /users/:id] and [DeleteUser] mutation are soft-delete, assuming a social network product
    # Don't want to break entities in collaborative environment, posts etc.
    # Local laws may apply which are more/less strict on what to keep and what to delete
    # Soft-delete anonymises Users.
    # Emails are changed to {id}@DELETED.COM
    # Password changed to prevent log in against credentials

## EXTRA: Prometheus + Grafana

    # TODO
