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

const db = {
  users,
  posts,
  comments
};

export default db;
