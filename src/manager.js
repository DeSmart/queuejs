const EventEmitter = require('events')
const syncConnector = require('./connector/syncConnector')

const manager = (
  connector = syncConnector(),
  events = new EventEmitter()
) => {
  connector.onJob(job => {
    events.emit(job.name, job)
  })

  return {
    push (name, payload, queue = 'default') {
      return connector.push(name, payload, queue)
    },

    on (jobName, fn) {
      events.on(jobName, fn)
    }
  }
}

module.exports = manager
