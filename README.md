## Challenge

Response to [Backend Hiring Challenge](https://teampynea.notion.site/Backend-Hiring-Challenge-NestJS-de26c804d8bb42e589dde964e044fa30).

### Summary

| Task                                    | Completion |
| --------------------------------------- | ---------- |
| 1. Project setup                        | ✅         |
| 2. User Entity                          | ✅         |
| 3. GraphQL Schema                       | ✅         |
| 4. User CRUD Operations                 | ✅         |
| 5. Validation                           | ✅         |
| 6. Testing                              | ✅         |
| 7. Documentation                        | ✅         |
| 8a. Bonus: Authentication/Authorization | ❌         |
| 8b. Bonus: Sorting & Filtering          | ✅         |
| 8c. Bonus: Dockerize App                | ✅         |

In addition to the outlined requirements:

- Task 8b: Sort and Filters are implemented on the GraphQL API only
- Task 8c: Application is dockerized and can be run stand-alone or as part of a docker-compose setup. Both options are described below.
- A deleteUser endpoint has been added which will anonymise a user and change their password. This is in part to facilitate testing, part in fulfilling the D in CRUD, and to raise considerations for a real use-case.
- A REST API is setup with a generated OpenAPI spec to mirror the GraphQL API functionality.
- A bare-bones monitoring system is in place with Prometheus and Grafana which can track the instance's health and default signals.

## Running the app

The application is available to run directly, via docker and via docker-compose

**To get up and running fast:**

1. Set credentials in the .env file
2. Run the entire system with: `docker compose up -d`

**To install locally in development mode:**

1. Set credentials in the .env file
2. Start a Postgres instance is required on port 5432 either directly or in a container.
3. Install the app `npm  install --force`. **Note, some peer dependencies are not yet updated**
4. Run the migration script to set up the database: `npm run migrate:dev`
5. Run the application in watch mode: `npm run start:dev`
6. Alternatively, combine migration & start with: `npm run start:migrate:dev`

The API can also be run with standard NestJS calls:

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

**To run in a container:**

1. Set credentials in the .env file
2. Start a Postgres instance is required on port 5432 either directly or in a container.
3. Set the PG account data in the .env file to access the PG database
4. Build API image: `docker build -t pynea-api .`
5. Launch the container: `docker run --rm -it --env-file=./.env -e POSTGRES_HOST=host.docker.internal -p 3000:3000 --name=pynea-api pynea-api`

**Viewing the API**

All approaches will launch on http://localhost:3000 by default

| Feature               | Endpoint                        | Notes                    |
| --------------------- | ------------------------------- | ------------------------ |
| GraphQL playground    | http://localhost:3000/graphql   |
| REST API              | http://localhost:3000/api/users |
| OpenAPI documentation | http://localhost:3000/api/docs  |
| Prometheus            | http://localhost:9090           | Only with docker-compose |
| Grafana               | http://localhost:9091           | Only with docker-compose |

Grafana's credentials are set in the `.env` file.

## GraphQL API

#### Creating a User:

```
mutation CreateUser {
	createUser(data:{ firstName:"John", lastName:"Appleseed", email:"j.appleseed@gmail.com", password:"31D3!de£3ded"}) {
	    id
	    firstName
	    lastName
	    email
	}
}
```

- firstName and lastName may not be blank
- emails must pass IsEmail constraint
- password must be between 8 and 50 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol to pass the [IsStrongPassword](https://www.npmjs.com/package/validator) constraint

#### Retrieving a User:

```
{
	getUser(id: "8c7390c8-9069-44a9-ad12-55acb1efa0f3") {
		id
		firstName
		lastName
		email
		password
	}
}
```

- The User's ID is required to perform the query, which is available from getUser and listUsers queries.

#### Listing Users:

```
{
	listUsers {
		id
		firstName
		lastName
		email
	}
}

# Example with sorting on firstName and filtering emails ending in @gmail.com:
{
	listUsers (sort:{firstName:desc} where:{email:{endsWith:"@gmail.com"}}) {
		firstName
	}
}
```

**Sorting**
Sorting can arrange items by one or more fields in ascending or descending order.

- Fields: **firstName**, **lastName**, **email**
- Order: **asc** or **desc**

**Filtering**
Filtering is based on one or more fields by with a comparison operation:

- Fields: **firstName**, **lastName**, **email**
- Operation and Value: one the following keywords to compare the value to:

| Operation  | Description                   | Value type      |
| ---------- | ----------------------------- | --------------- |
| equals     | strict equality               | String          |
| lt         | less than                     | String          |
| lte        | less or equal to              | String          |
| gt         | greather than                 | String          |
| gte        | greater or equal to           | String          |
| contains   | does field contain value      | String          |
| startsWith | does field begin with value   | String          |
| endsWith   | does field end with value     | String          |
| in         | is field included in list     | Array\<String\> |
| notIn      | is field not included in list | Array\<String\> |

#### Updating a User:

```
mutation UpdateUser {
	updateUser(id:"0ae72de6-f313-4f30-bd03-56e16715606f", data:{ firstName:"Jane", lastName:"Doe"}) {
		id
		firstName
		lastName
		email
	}
}
```

- The User's ID is required to perform the update, which is available from getUser and listUsers queries.
- The data object can update **firstName**, **lastName**, **email** and **password** fields only.
- Fields are subject to the same constraints as the **CreateUser** mutation

#### Deleting a User:

```
mutation DeleteUser {
	deleteUser(id:"0ae72de6-f313-4f30-bd03-56e16715606f"}) {
		id
		firstName
		lastName
	}
}
```

- The User's ID is required to perform the deletion, which is available from getUser and listUsers queries.
- Users are soft-deleted and their details anonymised. See the _Deleting Users_ section below for details.

## Testing

End-to-end tests all GraphQL operations and REST endpoints for a range of expected responses and error states. A Postgres database is required prior to launching the end-to-end test.

```bash
# e2e tests
npm  run  test:e2e
```

## Deleting users

This functionality has been setup as a soft-delete by adding a 'deleted' flag to the User entity. List operations will always filter out deleted users.

An assumption has been made that hard-deleting users in a social application will have cascading effects on other user's experience (comments, posts, participation, etc...), so a soft-delete and anonymisation approach is in place. Some territories have stricter policies over data deletion than others and a soft-delete allows us to remove the data in the least damaging way for the application.

When a user is deleted, their PPI on the User object will be set to:
|Field | New value|
|--|--|
|id|{retained / not changed}
|firstName|DELETED|
|lastName|DELETED|
|email|{id}@DELETED.COM|
|deleted|true|
|password|{hashed new random string}|

Preserving the User ID should retain other entity integrity, changing the email will mean the individual can re-register on the platform if they choose to, and the password change will prevent that individual from logging into their old account and avoid retaining a sensitive datapoint.

The _deleteUser_ mutation is implemented in GQL and a _DELETE /users/:id_ is implemented in the REST API.

## Todos

- **GraphQL documentation**: Unsure of best practice compared to REST's OpenAPI equivalent. Online literature suggests the playground, but some static generators available but as paid solutions. [GraphDoc](https://github.com/2fd/graphdoc#readme) is open-source but it has not been updated in 2 years.
- **GraphQL Sorting/Filtering**: Unsure if the approach taken is right - it feels... odd. I've had to replicate functionality which appears in Nest's types but I might be missing a trick on how to get the query inputs into the resolver in a neater way. This is the reason the **not** and **mode** operations are not implemented.
- **Authentication**: Would have liked to add the guards and authentication with login/logout/password reset with a JWT token and backed by a Redis instance. Passport is the obvious choice. Email verification service would be nice too.
- **Authorization**: With the authentication in place, this would enable user access controls and admin accounts. This would ensure a user's data can only be updated that User or a site Admin. This also has implications for listUser queries and what fields can be returned.
- **Password returned by GraphQL**: Queries are able to request a user's password in the query call. This is a serious problem and have not got around to solving it.
- **Pagination on GraphQL listUsers**: While sorting and filtering is available, pagination is not. A decision should be made for limits, and cursor or skipping approaches.
- **Sorting, Filtering and Pagination not on REST API**: Not required here but would be good for consistency.
- **GraphQL error messaging**: Not as developer-friendly as REST API in some cases.
- **Monitoring**: No bespoke charts or alerts set up for the server.
- **DELETE /api/users**: This undocumented endpoint is designed to hard-delete users flagged as soft-deleted. This is mainly used in end-to-end tests. The endpoint is hidden from the OpenAPI spec and would ideally be gated behind an admin access control.
- **Monitoring**: Basic out-of-the-box installation, no extra dashboards or alerts set up.
- **HATEOS on responses**: Return the available actions for an object and pass back to clients. This would need an extra _actions_ object on responses to describe what functions are allowed to be performed and the endpoints for them.
- **Caching strategies**: Not implemented.
- **Tests**: Would be nice to break these up a bit more, remove dependency on Postgres, maybe use sqlite.
- **CI**: Not part of a pipeline and tests not included in deployment at present.
