module.exports = [
  {
    name: 'Something',
    exts: ['js'],
    getRuntime() {
      return {
        run: ['echo', 'Hello World!'],
      }
    },
  },
]
