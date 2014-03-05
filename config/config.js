var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'furion'
    },
    port: 3000,
    db: 'mongodb://localhost/furion-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'furion'
    },
    port: 3000,
    db: 'mongodb://localhost/furion-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'furion'
    },
    port: 3000,
    db: 'mongodb://localhost/furion-production'
  }
};

module.exports = config[env];
