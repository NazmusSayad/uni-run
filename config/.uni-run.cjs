module.exports = [
  {
    name: 'deno',
    exts: ['js'],
    getRuntime() {
      return {
        exec: ['echo', 'Hello World! test!!!!!'],
      }
    },
  },
]
