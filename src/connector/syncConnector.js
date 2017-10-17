const job = require('../job')

const dispatchJob = (job, listeners) => {
  listeners.forEach(fn => fn(job))
}

module.exports = (listeners = []) => ({
  onJob (fn) {
    listeners.push(fn)
  },

  push (name, payload, queue) {
    const jobToDispatch = job({
      name,
      payload,
      queue,
      release (delay = 0) {
        const requeue = () => dispatchJob(this.retry(), listeners)

        delay ? setTimeout(requeue, delay * 1000) : requeue()
      }
    })

    dispatchJob(jobToDispatch, listeners)
  }
})
