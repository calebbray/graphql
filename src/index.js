import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Demo Data
const posts = [
  {
    id: '1',
    title: 'Post One',
    body: 'This is the first post.',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Post Two',
    body: 'This is the second post.',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'Post Three',
    body: 'This is the third post.',
    published: true,
    author: '2'
  }
];
const users = [
  {
    id: '1',
    name: 'Caleb',
    email: 'caleb@email.com',
    age: 23
  },
  {
    id: '2',
    name: 'Sara',
    email: 'sarah@email.com',
    age: 24
  },
  {
    id: '123098',
    name: 'Mike',
    email: 'mike@email.com',
    age: 23
  }
];

const comments = [
  {
    id: '1',
    text: 'This is the first comment',
    author: '1',
    post: '1'
  },
  {
    id: '2',
    text: 'This is the second comment',
    author: '2',
    post: '1'
  },
  {
    id: '3',
    text: 'This is the third comment',
    author: '2',
    post: '1'
  },
  {
    id: '4',
    text: 'This is the fourth comment',
    author: '1',
    post: '1'
  }
];

// Type Definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(
        post =>
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@email.com',
        age: 23
      };
    },

    post() {
      return {
        id: '123456',
        title: 'To be or not to be',
        body: 'That is the question',
        published: false
      };
    }
  },

  Mutation: {
    createUser(parent, args, ctx, info) {
      const { name, email, age } = args;
      const emailTaken = users.some(user => user.email === email);

      if (emailTaken) {
        throw new Error('Email already taken. Please try again.');
      }

      const user = {
        id: uuidv4(),
        name,
        email,
        age
      };

      users.push(user);
      return user;
    },

    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args;
      const userExists = users.some(user => user.id === author);

      if (!userExists) {
        throw new Error('User not found.');
      }

      const post = {
        id: uuidv4(),
        title,
        body,
        published,
        author
      };

      posts.push(post);
      return post;
    },

    createComment(parent, args, ctx, info) {
      const { text, author, post } = args;
      const userExists = users.some(user => user.id === author);
      const postExists = posts.some(post => post.id === post);

      if (!userExists || !postExists) {
        throw new Error('User or post does not exist');
      }

      const comment = {
        id: uuidv4(),
        text,
        author,
        post
      };

      comments.push(comment);
      return comment;
    }
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },

    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },

  User: {
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    },
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    }
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },

    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
