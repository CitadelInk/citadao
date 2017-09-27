export const routes = {
    '/': {
      title: 'Home',
    },
    '/landing': {
        title: 'Landing',
    },
    '/debug': {
        title: 'Debug',
    },
    '/user': {
        title: 'Users',
        '/:account': {
            title: 'Account',
        },
    },
    '/post/authorg/:authorg/sub/:subHash/rev/:revHash': {
        title: 'Post',
    },
  };
