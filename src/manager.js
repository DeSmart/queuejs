const syncConnector = require('./connector/syncConnector')

const createPipeline = (pipes = []) => {
  const runAt = i => job => {
    const fn = pipes[i] || (_ => job)
    return fn(job, runAt(i + 1))
  }

  return {
    use (fn) {
      pipes.push(fn)
    },

    addHandler (jobName, fn) {
      this.use((job, next) => {
        return job.name === jobName
          ? fn(job)
          : next(job)
      })
    },

    run: runAt(0)
  }
}

const manager = (
  connector = syncConnector(),
  pipeline = createPipeline()
) => {
  connector.onJob(pipeline.run)

  return {
    push (job) {
      return connector.push(job)
    },

    listen (queue = 'default', options = {}) {
      return connector.listen(queue, options)
    },

    handle: pipeline.addHandler,

    use: pipeline.use
  }
}

module.exports = manager
