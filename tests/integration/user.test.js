const request = require('supertest');
const { faker } = require('faker');
const {status} = require('http-status');
const { v4 } = require('uuid');
const app = require('../../src/app');
const { admin, insertUsers, userOne } = require('../fixtures/user.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma')
describe('user routes', () => {
  let newUser;
  beforeEach(async () => {
    await insertUsers([admin, userOne]);
    newUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: 'password123',
      role: 'user',
    };
  });

  describe('GET /users', () => {
    test('should return 200 OK if success get users', async () => {
      await request(app).get('/users').set('Authorization', `Bearer ${adminAccessToken}`).expect(status.OK);
    });
  });

  describe('/users/:id', () => {
    test('should return 200 OK, if success get users by id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get(`/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(status.OK);
    });

    test('Should return 200 and success update users by id', async () => {
      newUser = {
        name: 'testUpdate',
      };

      const res = await request(app)
        .patch(`/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(status.OK);

      const userData = res.body.data;

      const dbUser = await prisma.user.findUnique({
        where: { id: userData.id },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({
        id: expect.anything(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        isEmailVerified: false,
      });
    });

    test('should return 200 OK if success delete users by id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(status.OK);
    });
  });

  describe('ERROR TEST', () => {
    test('should return 400 BAD REQUEST if user id is not valid', async () => {
      await request(app)
        .get(`/users/noValidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(status.BAD_REQUEST);
    });

    test('should return 401 UNAUTHORIZED if no access token', async () => {
      await request(app).get(`/user`).send(newUser).expect(status.UNAUTHORIZED);
    });

    test('should return 403 FORBIDDEN if doesnt has admin access', async () => {
      await request(app)
        .get(`/user`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUser)
        .expect(status.FORBIDDEN);
    });

    test('should return 404 NOT_FOUND if no user is found', async () => {
      await request(app).get(`/users/${v4}`).set('Authorization', `Bearer ${adminAccessToken}`).expect(status.NOT_FOUND);
    });
  });
});