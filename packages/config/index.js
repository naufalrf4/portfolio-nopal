module.exports = {
  eslint: {
    base: require('./eslint/base'),
    next: require('./eslint/next'),
    react: require('./eslint/react'),
    typescript: require('./eslint/typescript'),
  },
  typescript: {
    base: require('./typescript/base'),
  },
  tailwind: require('./tailwind'),
};
