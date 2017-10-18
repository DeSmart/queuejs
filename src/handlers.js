const getHandler = (name, handlers) => handlers[name]
  ? handlers[name]
  : () => {}

module.exports = (handlers = {}) => ({
  add (jobName, fn) {
    if (handlers[jobName]) {
      throw new Error(`job ${jobName} has defined handler`)
    }

    handlers[jobName] = fn
  },

  async dispatchJob (job) {
    await getHandler(job.name, handlers)(job)
  }
})
