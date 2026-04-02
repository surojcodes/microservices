import express, { Express } from 'express';
import request from 'supertest';

export const createTestApp = (): Express => {
  const app = express();
  app.use(express.json());
  return app;
};

export const createAuthenticatedRequest = (
  app: Express,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  path: string,
  token?: string
) => {
  let req = request(app)[method](path);
  if (token) {
    req = req.set('Authorization', `Bearer ${token}`)
      .set('Cookie', `token=${token}`);
  }
  return req;
};
