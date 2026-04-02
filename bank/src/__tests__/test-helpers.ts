import axios from 'axios';
import { gql } from 'graphql-tag';

export const mockAxiosForTest = () => {
  return axios as jest.Mocked<typeof axios>;
};

export const createMockGraphQLQuery = (query: string) => {
  return query;
};

export const createMockGraphQLMutation = (mutation: string) => {
  return mutation;
};
