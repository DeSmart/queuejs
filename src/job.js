const noop = _ => { }

module.exports = ({ name, queue, attempts = 1, payload = {}, remove = noop, release = noop }) => ({
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

  release
})
