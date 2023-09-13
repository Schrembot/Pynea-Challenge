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
        - [x] Sorting
        - [x] Dockerize

# Details:

## GraphQL

    # Playground: http://localhost:3000/graphql
    # Tested
    # TODO: Work out best approach to remove 'password' from user(s) response for security
    # TODO: Messaging back to user isn't as user-friendly as REST API

## EXTRA: REST API

    # OpenAPI setup: http://localhost:3000/api/docs
    # Tested
    # A "clearDeletedUsers" method exists to clear out the DB which shouldn't be sent into production, need to work on that
    # Missing fields prioritises the password over any/all missing fields
    # Ready for some HATEOS inputs

## EXTRA: Both [DELETE /users/:id] and [DeleteUser] mutation are soft-delete for the purposes of a Social Network based on:

    # Don't want to break entities in collaborative environment, posts etc.
    # Local laws may apply which are more/less strict on what to keep and what to delete
    # Soft-delete anonymises Users.
    # Emails are changed to {id}@DELETED.COM
    # Password changed to prevent log in against credentials

## EXTRA: Prometheus + Grafana

    # TODO
