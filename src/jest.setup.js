// jest.setup.js or any setup file included in your jest.config.js
jest.mock("@apollo/client", () => {
  const actualApolloClient = jest.requireActual("@apollo/client");
  return {
    ...actualApolloClient,
    gql: jest.fn().mockImplementation(() => ({})), // Mock gql to return an empty object or a valid gql query as needed
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    // Mock other Apollo hooks and functions as necessary
  };
});
