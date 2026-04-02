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

export const extractJWT = (response: any): string | null => {
  if (response.body?.data?.token) {
    return response.body.data.token;
  }
  const setCookie = response.headers['set-cookie'];
  if (setCookie && Array.isArray(setCookie)) {
    const tokenCookie = setCookie.find((c) => c.startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split(';')[0].replace('token=', '');
    }
  }
  return null;
};
