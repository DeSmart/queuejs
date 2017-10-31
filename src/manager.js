const syncConnector = require('./connector/syncConnector')
const createMiddelware = require('./middleware')

const manager = (
  connector = syncConnector(),
  middleware = createMiddelware()
) => {
  connector.onJob(job => {
    middleware.run(job)
  })

  return {
    push (job) {
      return connector.push(job)
    },

    listen (queue = 'default', options = {}) {
      return connector.listen(queue, options)
    },

    handle (jobName, fn) {
      return middleware.addHandler(jobName, fn)
    },

    use (fn) {
      return middleware.use(fn)
    }
  }
}

module.exports = manager
