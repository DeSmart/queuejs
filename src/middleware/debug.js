const debug = require('debug')('desmart:queue')

module.exports = () => async (job, next) => {
  debug(`starting job [${job.name}]`)

  try {
    const result = await next(job)
    debug(`job finished [${job.name}]`)

    return result
  } catch (error) {
    debug(`job failed [${job.name}] (${error})`)
    throw error
  }
}
