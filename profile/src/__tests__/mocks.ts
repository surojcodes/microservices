import { prisma } from '../utils/prisma';

export const prismaMock = prisma as jest.Mocked<typeof prisma>;

export const setupPrismaMocks = () => {
  jest.clearAllMocks();
  return prismaMock;
};

export const mockAxios = () => {
  const axios = require('axios');
  return axios as jest.Mocked<typeof axios>;
};
