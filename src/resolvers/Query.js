const Query = {
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter(
      post =>
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter(user =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  comments(parent, args, { db }, info) {
    return db.comments;
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
};

export default Query;
