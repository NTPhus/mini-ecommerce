import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtToken: string;

  // 1. Thiết lập môi trường trước khi chạy test
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Load toàn bộ module của ứng dụng
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Quan trọng: Để test cả Validation DTO
    await app.init();

    dataSource = app.get(DataSource);

    const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'a@a.com', password: '123456' });

    jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhQGEuY29tIiwiaWF0IjoxNzY2NTYwMzY0LCJleHAiOjE3NjY4MTk1NjR9.uvCCTzL_O6d811p9lCljjie1EcvTAm7VnJ5_2GX8vjk";

  });

  // 2. Dọn dẹp Database sau khi test xong (tùy chọn)
  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('/order (POST)', () => {
    
    // CASE 1: Đặt hàng thành công (Happy Path)
    it('should create an order successfully (201)', async () => {
      const orderPayload = [
        { productId: 1, quantity: 2 ,price: 12},
        { productId: 2, quantity: 1 ,price: 15},
      ];

      const response = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${jwtToken}`) // Gửi Token qua Header
        // .set('Cookie', [`accessToken=${jwtToken}`]) // Nếu bạn dùng Cookie
        .send(orderPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.total_amount).toBeGreaterThan(0);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].product).toHaveProperty('name');
    });

    // CASE 2: Thất bại do sai Product ID (404)
    it('should throw 404 when product does not exist', async () => {
      const invalidPayload = [
        { productId: 9999, quantity: 1 } // ID không tồn tại
      ];

      const response = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidPayload);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('One or more products not found');
    });

    // CASE 3: Thất bại do chưa đăng nhập (401)
    it('should throw 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/order')
        .send([]);

      expect(response.status).toBe(401);
    });

    // CASE 4: Thất bại do dữ liệu DTO sai (400)
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