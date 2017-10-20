const createHandlers = require('./handlers')
const syncConnector = require('./connector/syncConnector')

const manager = (
  connector = syncConnector(),
  handlers = createHandlers()
) => {
  connector.onJob(handlers.dispatchJob)

  return {
    push (job) {
      return connector.push(job)
    },

    handle (jobName, fn) {
      handlers.bind(jobName, fn)
    },

    listen (queue = 'default', options = {}) {
      return connector.listen(queue, options)
    }
  }
}

module.exports = manager
