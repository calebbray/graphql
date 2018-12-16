const Subscription = {
  comment: {
    subscribe(parent, { postId }, { pubSub, db }, info) {
      const post = db.posts.find(post => post.id === postId && post.published);
      if (!post) {
        throw new Error('Post not found.');
      }

      return pubSub.asyncIterator(`COMMENT ${postId}`);
    }
  },

  post: {
    subscribe(parent, args, { pubSub }, info) {
      return pubSub.asyncIterator('POST');
    }
  }
};

export default Subscription;
