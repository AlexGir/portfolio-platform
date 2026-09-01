import type { RequestHandler } from 'express';
import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { createContextFactory, type ContextFactoryDeps, type GraphQLContext } from './context.js';

export const GRAPHQL_ENDPOINT = '/graphql';

/**
 * GraphQL Yoga request handler, mountable on Express with
 * `app.use(GRAPHQL_ENDPOINT, createGraphQLHandler(deps))`.
 *
 * The Yoga instance is itself a Node request listener; Express passes it
 * `(req, res)` and Yoga writes the response, so the cast to `RequestHandler`
 * is safe (the `next` argument is simply ignored).
 */
export function createGraphQLHandler(deps: ContextFactoryDeps): RequestHandler {
  const contextFactory = createContextFactory(deps);

  const yoga = createYoga({
    schema: createSchema<GraphQLContext>({ typeDefs, resolvers }),
    context: ({ request }) => contextFactory(request),
    graphqlEndpoint: GRAPHQL_ENDPOINT,
    landingPage: false,
    // Express owns CORS.
    cors: false,
  });

  return yoga as unknown as RequestHandler;
}
