import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    mainConfig(app);
    await app.init();
  });

  const graphql_endpoint = '/graphql';
  let new_user_id: string = '';

  /*
  // First run should have an empty array of users as the DB should be clean
  it('/api/users (GET) [200: Empty list]', async () => {
    return await request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual([]);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBeNull();
      });
  });

  // Fail to register a user due to bad email
  it('/api/users (POST) [400: Invalid value given for email]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid_email',
        password: '1£efi3EFWk3i3',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Email must be an email');
      });
  });

  // Fail to register a user due to weak password
  it('/api/users (POST) [400: Password too weak]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'j.doe@gmail.com',
        password: 'password',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Password is not strong enough');
      });
  });

  // Fail to register a user due to short password
  it('/api/users (POST) [400: Password too short (and weak)]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'j.doe@gmail.com',
        password: 'p',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(
          'Password length Must be between 6 and 50 charcters\nPassword is not strong enough',
        );
      });
  });

  // Fail to register a user due to long password
  it('/api/users (POST) [400: Password too long]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'j.doe@gmail.com',
        password:
          '1dWE£f2f321dWE£f2f321dWE£f2f321dWE£f2f321dWE£f2f321dWE£f2f32',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(
          'Password length Must be between 6 and 50 charcters',
        );
      });
  });

  // Fail to register a user due to firstName being an int
  it('/api/users (POST) [400: Invalid value given for name]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 1,
        lastName: 'Doe',
        email: 'j.doe@gmail.com',
        password: '1£efi3EFWk3i3',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('FirstName must be a string');
      });
  });

  // Fail to register a user due to missing email
  it('/api/users (POST) [400: Missing email]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        password: '1£efi3EFWk3i3',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(
          'Email must be an email\nEmail should not be empty',
        );
      });
  });

  // Fail to register a user due to missing password
  it('/api/users (POST) [400: Missing password]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@hotmail.com',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(
          'Password length Must be between 6 and 50 charcters\nPassword should not be empty\nPassword is not strong enough',
        );
      });
  });

  // Fail to register a user due to missing email and password, email is reported missing first
  it('/api/users (POST) [400: Missing email & password]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(
          'Email must be an email\nEmail should not be empty\nPassword length Must be between 6 and 50 charcters\nPassword should not be empty\nPassword is not strong enough',
        );
      });
  });

  // Fail to register a user due to missing fields
  it('/api/users (POST) [400: Missing fields]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(
          'FirstName must be a string\nFirstName should not be empty\nLastName must be a string\nLastName should not be empty\nEmail must be an email\nEmail should not be empty\nPassword length Must be between 6 and 50 charcters\nPassword should not be empty\nPassword is not strong enough',
        );
      });
  });

  // Register a user
  it('/api/users (POST) [201: Successfully register user]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@hotmail.com',
        password: '1£efi3EFWk3i3',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('firstName');
        expect(res.body.data).toHaveProperty('lastName');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('password');
        expect(res.body.data).toHaveProperty('createdAt');
        expect(res.body.data).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBeNull();

        new_user_id = res.body.data.id;
      });
  });

  // Register the same user again, expect this to fail
  it('/api/users (POST) [409: Conflict, email already exists]', async () => {
    return await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@hotmail.com',
        password: '1£efi3EFWk3i3',
      })
      .expect(409)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Email already in use');
      });
  });

  // List users again, it should have users
  it('/api/users (GET) [200: Items in list]', async () => {
    return await request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0]).toHaveProperty('id');
        expect(res.body.data[0]).toHaveProperty('firstName');
        expect(res.body.data[0]).toHaveProperty('lastName');
        expect(res.body.data[0]).toHaveProperty('email');
        expect(res.body.data[0]).toHaveProperty('password');
        expect(res.body.data[0]).toHaveProperty('createdAt');
        expect(res.body.data[0]).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBeNull();

        // User returned should be the same as the user created - check their IDs match
        expect(res.body.data[0].id).toBe(new_user_id);
      });
  });

  // Fetch the newly created user
  it('/api/users/:id (GET) [200: Get the new user by ID]', async () => {
    return await request(app.getHttpServer())
      .get(`/api/users/${new_user_id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('firstName');
        expect(res.body.data).toHaveProperty('lastName');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('password');
        expect(res.body.data).toHaveProperty('createdAt');
        expect(res.body.data).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBeNull();

        // User returned should be the same as the user created - check their IDs match
        expect(res.body.data.id).toBe(new_user_id);
      });
  });

  // Find non-existant user
  it('/api/users/:id (GET) [404: Non-existant User]', async () => {
    return await request(app.getHttpServer())
      .get(`/api/users/1234`)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('User not found');
      });
  });

  // Update the user
  it('/api/users/:id (PATCH) [200: Update user name]', async () => {
    return await request(app.getHttpServer())
      .patch(`/api/users/${new_user_id}`)
      .send({
        firstName: 'Jane',
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('firstName');
        expect(res.body.data).toHaveProperty('lastName');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('password');
        expect(res.body.data).toHaveProperty('createdAt');
        expect(res.body.data).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBeNull();

        // User returned should be the same as the user created - check their IDs match
        expect(res.body.data.id).toBe(new_user_id);
        expect(res.body.data.firstName).toBe('Jane');
      });
  });

  // Delete the user
  it('/api/users/:id (DELETE) [200: Remove this user]', async () => {
    return await request(app.getHttpServer())
      .delete(`/api/users/${new_user_id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual({});
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(null);
      });
  });

  // Find deleted user
  it('/api/users/:id (GET) [404: Do not find deleted Users]', async () => {
    return await request(app.getHttpServer())
      .get(`/api/users/${new_user_id}`)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('User not found');
      });
  });

  // List users again, but ensure deleted users are excluded
  it('/api/users (GET) [200: Ensure deleted users not listed]', async () => {
    return await request(app.getHttpServer())
      .get(`/api/users`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(0);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBeNull();
      });
  });

  // Clear all deleted users
  it('/api/users (DELETE) [200: Reset table]', async () => {
    return await request(app.getHttpServer())
      .delete('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual([]);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(null);
      });
  });

  // Spacer
  it('------------------------------------------------------------------------------------------', () => {
    expect(true).toBe(true);
  });

  //
  // REPEAT ALL ABOVE STEPS IN GQL
  //

  // First run should have an empty array of users as the DB should be clean
  it(`${graphql_endpoint} (getUsers Query) []`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
            listUsers {
              id
              firstName
              lastName
              email
            }
          }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body.data.listUsers).toBeInstanceOf(Array);
        expect(res.body.data.listUsers.length).toEqual(0);
      });
  });

  // Fail to register a user due to invalid email
  it(`${graphql_endpoint} (createUser Mutation) [Invalid value given for email]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe", email:"invalid_email", password:"1£efi3EFWk3i3"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe('Email must be an email');
      });
  });

  // Fail to register a user due to weak password
  it(`${graphql_endpoint} (createUser Mutation) [Invalid value given for email]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe", email:"j.doe@gmail.com", password:"password"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'Password is not strong enough',
        );
      });
  });

  // Fail to register a user due to short password
  it(`${graphql_endpoint} (createUser Mutation) [Password is too short (and weak)]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe", email:"j.doe@gmail.com", password:"p"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'Password length Must be between 6 and 50 charcters\nPassword is not strong enough',
        );
      });
  });

  // Fail to register a user due to long password
  it(`${graphql_endpoint} (createUser Mutation) [Password is too long]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe", email:"j.doe@gmail.com", password:"1dWE£f2f321dWE£f2f321dWE£f2f321dWE£f2f321dWE£f2f321dWE£f2f32"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'Password length Must be between 6 and 50 charcters',
        );
      });
  });

  // Fail to register a user due to firstName being an int
  it(`${graphql_endpoint} (createUser Mutation) [Invalid value given for name]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:7, lastName:"Doe", email:"j.doe@gmail.com", password:"1£efi3EFWk3i3"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'String cannot represent a non string value: 7',
        );
      });
  });

  // Fail to register a user due to missing email
  it(`${graphql_endpoint} (createUser Mutation) [Missing email]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe", password:"1£efi3EFWk3i3"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'Field "NewUser.email" of required type "String!" was not provided.',
        );
      });
  });

  // Fail to register a user due to missing password
  it(`${graphql_endpoint} (createUser Mutation) [Missing password]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe", email:"j.doe@gmail.com"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'Field "NewUser.password" of required type "String!" was not provided.',
        );
      });
  });

  // Fail to register a user due to missing email and password
  it(`${graphql_endpoint} (createUser Mutation) [Missing email and password]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe"}) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'Field "NewUser.email" of required type "String!" was not provided.',
        );
        expect(res.body.errors[1]).toHaveProperty('message');
        expect(res.body.errors[1].message).toBe(
          'Field "NewUser.password" of required type "String!" was not provided.',
        );
      });
  });

  // Fail to register a user due to all missing fields
  it(`${graphql_endpoint} (createUser Mutation) [Missing data]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ }) {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(
          'Field "NewUser.firstName" of required type "String!" was not provided.',
        );
        expect(res.body.errors[1]).toHaveProperty('message');
        expect(res.body.errors[1].message).toBe(
          'Field "NewUser.lastName" of required type "String!" was not provided.',
        );
        expect(res.body.errors[2]).toHaveProperty('message');
        expect(res.body.errors[2].message).toBe(
          'Field "NewUser.email" of required type "String!" was not provided.',
        );
        expect(res.body.errors[3]).toHaveProperty('message');
        expect(res.body.errors[3].message).toBe(
          'Field "NewUser.password" of required type "String!" was not provided.',
        );
      });
  });

  // Register a user
  it(`${graphql_endpoint} (createUser Mutation) []`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"John", lastName:"Doe", email:"j.doe@gmail.com" password:"1£efi3EFWk3i3"}) {
           id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body.data.createUser).not.toBeNull();
        expect(Object.keys(res.body.data.createUser)).toEqual([
          'id',
          'firstName',
          'lastName',
          'email',
        ]);
        expect(res.body.data.createUser.firstName).toBe('John');
        expect(res.body.data.createUser.lastName).toBe('Doe');
        expect(res.body.data.createUser.email).toBe('j.doe@gmail.com');

        new_user_id = res.body.data.createUser.id;
      });
  });

  // Register the same user again, expect this to fail
  it(`${graphql_endpoint} (createUser Mutation) [Email already registered]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
          createUser(data:{ firstName:"John", lastName:"Doe", email:"j.doe@gmail.com" password:"1£efi3EFWk3i3"}) {
          id
          firstName
          lastName
          email
      }
    }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.errors).toBeInstanceOf(Array);
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe('Email already in use');
        // Should have better support for res.body.errors[0].extensions.code from INTERNAL_SERVER_ERROR to CONFLICT in this case... another time.
      });
  });

  // List users again, it should have users
  it(`${graphql_endpoint} (getUsers Query) []`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
            listUsers {
              id
              firstName
              lastName
              email
            }
          }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body.data.listUsers).toBeInstanceOf(Array);
        expect(res.body.data.listUsers.length).toEqual(1);
        expect(res.body.data.listUsers[0]).toHaveProperty('id');
        expect(res.body.data.listUsers[0]).toHaveProperty('firstName');
        expect(res.body.data.listUsers[0]).toHaveProperty('lastName');
        expect(res.body.data.listUsers[0]).toHaveProperty('email');

        // User returned should be the same as the user created - check their IDs match
        expect(res.body.data.listUsers[0].id).toBe(new_user_id);
      });
  });

  // Fetch the newly created user
  it(`${graphql_endpoint} (getUser Query) []`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
          getUser(id: "${new_user_id}") {
            id
            firstName
            lastName
            email
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('getUser');
        expect(res.body.data.getUser).toBeInstanceOf(Object);
        expect(res.body.data.getUser).toHaveProperty('id');
        expect(res.body.data.getUser).toHaveProperty('firstName');
        expect(res.body.data.getUser).toHaveProperty('lastName');
        expect(res.body.data.getUser).toHaveProperty('email');

        // User returned should be the same as the user created - check their IDs match
        expect(res.body.data.getUser.id).toBe(new_user_id);
      });
  });

  // Find non-existant user
  it(`${graphql_endpoint} (getUser Query) [User not found]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
        getUser(id: "1234") {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveProperty('getUser');
        expect(res.body.data.getUser).toBeNull();
      });
  });

  // Update the user
  it(`${graphql_endpoint} (updateUser Mutation) []`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation UpdateUser {
          updateUser(id:"${new_user_id}", data:{ firstName:"Jane", lastName:"Doe"}) {
            id
            firstName
            lastName
            email
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('updateUser');
        expect(res.body.data.updateUser).toBeInstanceOf(Object);
        expect(res.body.data.updateUser).toHaveProperty('id');
        expect(res.body.data.updateUser).toHaveProperty('firstName');
        expect(res.body.data.updateUser).toHaveProperty('lastName');

        expect(res.body.data.updateUser.firstName).toBe('Jane');
        expect(res.body.data.updateUser.lastName).toBe('Doe');

        // User returned should be the same as the user created - check their IDs match
        expect(res.body.data.updateUser.id).toBe(new_user_id);
        expect(res.body.data.updateUser.firstName).toBe('Jane');
      });
  });

  // Delete the user
  it(`${graphql_endpoint} (deleteUser Mutation) []`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation DeleteUser {
          deleteUser(id:"${new_user_id}") {
             id
            firstName
            lastName
            email
            password
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('deleteUser');
        expect(res.body.data.deleteUser).toBeInstanceOf(Object);
        expect(res.body.data.deleteUser).toHaveProperty('id');
        expect(res.body.data.deleteUser).toHaveProperty('firstName');
        expect(res.body.data.deleteUser).toHaveProperty('lastName');

        expect(res.body.data.deleteUser.firstName).toBe('DELETED');
        expect(res.body.data.deleteUser.lastName).toBe('DELETED');
        expect(res.body.data.deleteUser.email).toBe(
          `${new_user_id}@DELETED.COM`,
        );
      });
  });

  // Find deleted user
  it(`${graphql_endpoint} (getUser Query) [Do not find deleted Users]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
        getUser(id: "${new_user_id}") {
          id
          firstName
          lastName
          email
        }
      }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveProperty('getUser');
        expect(res.body.data.getUser).toBeNull();
      });
  });

  // List users again, but ensure deleted users are excluded
  it(`${graphql_endpoint} (getUsers Query) [Ensure deleted users not listed]`, () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
            listUsers {
              id
              firstName
              lastName
              email
            }
          }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body.data.listUsers).toBeInstanceOf(Array);
        expect(res.body.data.listUsers.length).toEqual(0);
      });
  });
  */

  // Clear all deleted users
  it('/api/users (DELETE) [200: Reset table]', async () => {
    return await request(app.getHttpServer())
      .delete('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual([]);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(null);
      });
  });

  // Register a set of new users
  it(`${graphql_endpoint} (createUser Mutation) [x4]`, async () => {
    await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"Alice", lastName:"Doe", email:"alice.doe@gmail.com" password:"1£efi3EFWk3i3"}) {
           id
          firstName
          lastName
          email
        }
      }`,
      });

    await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
        createUser(data:{ firstName:"Bob", lastName:"Doe", email:"bob.doe@gmail.com" password:"1£efi3EFWk3i3"}) {
           id
          firstName
          lastName
          email
        }
      }`,
      });
    await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
          createUser(data:{ firstName:"Charlie", lastName:"Doe", email:"charlie.doe@hotmail.com" password:"1£efi3EFWk3i3"}) {
             id
            firstName
            lastName
            email
          }
        }`,
      });

    await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `mutation CreateUser {
          createUser(data:{ firstName:"David", lastName:"Doe", email:"david.doe@yahoo.com" password:"1£efi3EFWk3i3"}) {
             id
            firstName
            lastName
            email
          }
        }`,
      });

    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
          listUsers {
            firstName
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data.listUsers.length).toEqual(4);
      });
  });

  // Sort users on firstName ASC
  it(`${graphql_endpoint} (listUsers [sort:firstName ASC]`, async () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
          listUsers (sort:{firstName:asc}) {
            firstName
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data.listUsers.length).toEqual(4);
        expect(res.body.data.listUsers).toEqual([
          { firstName: 'Alice' },
          { firstName: 'Bob' },
          { firstName: 'Charlie' },
          { firstName: 'David' },
        ]);
      });
  });

  // Sort users on firstName DESC
  it(`${graphql_endpoint} (listUsers [sort:firstName DESC]`, async () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
          listUsers (sort:{firstName:desc}) {
            firstName
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data.listUsers.length).toEqual(4);
        expect(res.body.data.listUsers).toEqual([
          { firstName: 'David' },
          { firstName: 'Charlie' },
          { firstName: 'Bob' },
          { firstName: 'Alice' },
        ]);
      });
  });

  // Filter users on email
  it(`${graphql_endpoint} (listUsers [filter: email ends with "@gmail.com"]`, async () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
          listUsers (where:{email:{endsWith:"@gmail.com"}}) {
            firstName
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data.listUsers.length).toEqual(2);
        expect(res.body.data.listUsers).toEqual([
          { firstName: 'Alice' },
          { firstName: 'Bob' },
        ]);
      });
  });

  // Filter users on email, sort by name DESC
  it(`${graphql_endpoint} (listUsers [sort: firstName DESC, filter: email ends with "@gmail.com"]`, async () => {
    return await request(app.getHttpServer())
      .post(graphql_endpoint)
      .send({
        query: `{
          listUsers (sort:{firstName:desc} where:{email:{endsWith:"@gmail.com"}}) {
            firstName
          }
        }`,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data.listUsers.length).toEqual(2);
        expect(res.body.data.listUsers).toEqual([
          { firstName: 'Bob' },
          { firstName: 'Alice' },
        ]);
      });
  });

  // // Clear all deleted users
  // it('/api/users (DELETE) [200: Reset table]', async () => {
  //   return await request(app.getHttpServer())
  //     .delete('/api/users')
  //     .expect(200)
  //     .then((res) => {
  //       expect(res.body).toHaveProperty('data');
  //       expect(res.body.data).toEqual([]);
  //       expect(res.body).toHaveProperty('error');
  //       expect(res.body.error).toBe(null);
  //     });
  // });
});
