import { apiClient } from './client';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

const GRAPHQL_ENDPOINT = '/graphql';

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const response = await apiClient.post<GraphQLResponse<T>>(GRAPHQL_ENDPOINT, {
      query,
      variables,
    });

    if (response.data.errors?.length) {
      throw new Error(response.data.errors.map((e) => e.message).join(', '));
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('GraphQL request failed');
  }
}
