import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); 
    await app.init();

    dataSource = app.get(DataSource);

    jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhQGEuY29tIiwiaWF0IjoxNzY2NTYwMzY0LCJleHAiOjE3NjY4MTk1NjR9.uvCCTzL_O6d811p9lCljjie1EcvTAm7VnJ5_2GX8vjk";

  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('/order (POST)', () => {
    it('should create an order successfully (201)', async () => {
      const orderPayload = [
        { productId: 1, quantity: 2 ,price: 12},
        { productId: 2, quantity: 1 ,price: 15},
      ];

      const response = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(orderPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.total_amount).toBeGreaterThan(0);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].product).toHaveProperty('name');
    });

    it('should throw 404 when product does not exist', async () => {
      const invalidPayload = [
        { productId: 9999, quantity: 1 } 
      ];

      const response = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidPayload);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('One or more products not found');
    });

    it('should throw 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/order')
        .send([]);

      expect(response.status).toBe(401);
    });

    it('should throw 400 when quantity is negative', async () => {
      const badPayload = [{ productId: 1, quantity: -5 }];

      const response = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(badPayload);

      expect(response.status).toBe(400);
    });
  });
});