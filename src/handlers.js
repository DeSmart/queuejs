const getHandler = (name, handlers) => handlers[name]
  ? handlers[name]
  : () => {}

module.exports = (handlers = {}) => ({
  add (jobName, fn) {
    handlers[jobName] = fn
  },

  async dispatchJob (job) {
    await getHandler(job.name, handlers)(job)
  }
})
