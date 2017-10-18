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
  }
})

/**
 * Create new job from metadata
 *
 * @param {Object} json
 * @param {Object} methods callbacks for remove() and release() methods
 * @return {Object}
 */
job.fromJSON = (json, { remove = noop, release = noop }) => job(Object.assign(
  {},
  json,
  { remove, release }
))

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
