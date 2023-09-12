import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let new_user_id: string = '';

  // First run should have an empty array of users as the DB should be clean
  it('/api/users (GET) [200: Empty list]', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual([]);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBeNull();
      });
  });

  // Fail to register a user due to missing email
  it('/api/users (POST) [400: Missing email]', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeNull();
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Argument `email` is missing.');
      });
  });

  // Fail to register a user due to missing password
  it('/api/users (POST) [400: Missing password]', () => {
    return request(app.getHttpServer())
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
        expect(res.body.error).toBe('Argument `password` is missing.');
      });
  });

  // Fail to register a user due to missing email and password, email is reported missing first
  it('/api/users (POST) [400: Missing email & password]', () => {
    return request(app.getHttpServer())
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
        expect(res.body.error).toBe('Argument `password` is missing.');
      });
  });

  // Register a user
  it('/api/users (POST) [201: Successfully register user]', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@hotmail.com',
        password: 'password',
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
  it('/api/users (POST) [409: Conflict, email already exists]', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@hotmail.com',
        password: 'password',
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
  it('/api/users (GET) [200: Items in list]', () => {
    return request(app.getHttpServer())
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
  it('/api/users/:id (GET) [200: Get the new user by ID]', () => {
    return request(app.getHttpServer())
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
  it('/api/users/:id (GET) [404: Non-existant User]', () => {
    return request(app.getHttpServer())
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
  it('/api/users/:id (PATCH) [200: Update user name]', () => {
    return request(app.getHttpServer())
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
  it('/api/users/:id (DELETE) [200: Remove this user]', () => {
    return request(app.getHttpServer())
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
  it('/api/users/:id (GET) [404: Do not find deleted Users]', () => {
    return request(app.getHttpServer())
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
  it('/api/users (GET) [200: Ensure deleted users not listed]', () => {
    return request(app.getHttpServer())
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
  it('/api/users (DELETE) [200: Reset table]', () => {
    return request(app.getHttpServer())
      .delete('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual([]);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe(null);
      });
  });
});
