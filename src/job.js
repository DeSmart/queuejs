const noop = _ => { }

const job = ({ name, queue, attempts = 0, payload = {}, remove = noop, release = noop }) => ({
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

  increment () {
    return job({
      name,
      queue,
      attempts: attempts + 1,
      payload,
      remove,
      release
    })
  },

  /**
   * Export job metadata to JSON
   *
   * This method will skip export of passed methods
   *
   * @return {Object}
   */
  toJSON () {
    return { name, queue, payload, attempts }
  },

  /**
   * Create copy of job with new actions
   *
   * @param {Object} actions jobs new actions;
   *                         both remove() and release() will be replaced with them
   * @return {Object}        copy of job with new actions
   */
  withActions ({ remove = noop, release = noop }) {
    return job({
      name,
      queue,
      attempts,
      payload,
      remove,
      release
    })
  }
})

/**
 * Create new job from metadata
 *
 * @param {Object} json
 * @return {Object}
 */
job.fromJSON = job

/**
 * Create new job instance
 *
 * @param {String} name
 * @param {Object} payload
 * @param {String} queue
 * @returns {Object}
 */
job.of = (name, payload = {}, queue = 'default') => job({ name, payload, queue })

module.exports = job
