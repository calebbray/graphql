import { GraphQLServer } from 'graphql-yoga';

// Type Definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first Query';
    },
    name() {
      return 'Caleb';
    },
    location() {
      return 'Pullman';
    },
    bio() {
      return 'I am 23';
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
