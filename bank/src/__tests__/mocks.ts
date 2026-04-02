import { mockAxios as createMockAxios } from 'jest-mock-extended';

export const mockAxios = () => {
  const axios = require('axios');
  return createMockAxios(axios);
};

export const setupAxiosMocks = () => {
  jest.clearAllMocks();
  return mockAxios();
};
