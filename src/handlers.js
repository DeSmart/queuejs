module.exports = (handlers = {}) => ({
  add (jobName, fn) {
    handlers[jobName] = fn
  },

  async dispatchJob (job) {
    await handlers[job.name](job)
  }
})
