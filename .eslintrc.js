module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {
    'Image': true,
    'FileReader': true,
    'Vue': true,
    'App': true,
    'MySQL': true,
    'tinyMCE': true,
    'io': true,
    'SocketIOFileUpload': true,
    'sioClient': true
  }
}
