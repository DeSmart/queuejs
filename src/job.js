const noop = _ => { }

const job = ({ name, queue, attempts = 1, payload = {}, remove = noop, release = noop }) => ({
  get name () {
    return name
  },

  get queue () {
    return queue
  },

  get attempts () {
    return attempts
  },

  get payload () {
    return Object.assign({}, payload)
  },

  remove,

  release,

  retry () {
    return job({
      name,
      queue,
      attempts: attempts + 1,
      payload,
      remove,
      release
    })
  }
})

module.exports = job
