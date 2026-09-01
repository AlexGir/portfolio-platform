/** GraphQL SDL. Types mirror the Zod schemas in `@portfolio/shared`. */
export const typeDefs = /* GraphQL */ `
  type Health {
    status: String!
    service: String!
    version: String!
    uptimeSeconds: Float!
    timestamp: String!
  }

  type User {
    id: ID!
    email: String!
    displayName: String!
    avatarUrl: String
    role: String!
    createdAt: String!
  }

  type Query {
    "Service health, same payload as the REST GET /health."
    health: Health!
    "The authenticated user, or null when no valid access token is provided."
    me: User
  }
`;
