import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Demo Data
let posts = [
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

let users = [
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

let comments = [
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
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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

      return users.filter(user =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
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
      const emailTaken = users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email already taken. Please try again.');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);
      return user;
    },

    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found.');
      }

      const deletedUser = users.splice(userIndex, 1);
      posts = posts.filter(post => {
        const match = post.author === args.id;
        if (match) {
          comments = comments.filter(comment => comment.author !== args.id);
        }

        return !match;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUser[0];
    },

    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found.');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      posts.push(post);
      return post;
    },

    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found.');
      }

      const deletedPost = posts.splice(postIndex, 1);
      comments = comments.filter(comment => comment.post !== args.id);

      return deletedPost[0];
    },

    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      const postExists = posts.some(post => post.id === args.data.post);

      if (!userExists || !postExists) {
        throw new Error('User or post does not exist');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      comments.push(comment);
      return comment;
    },

    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found.');
      }

      const deletedComment = comments.splice(commentIndex, 1);
      comments = comments.filter(comment => comment.id !== args.id);
      return deletedComment[0];
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
