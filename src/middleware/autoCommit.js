// @see https://en.wikipedia.org/wiki/Exponential_backoff#Expected_backoff
const e = c => (Math.pow(2, c) - 1) / 2

const getDelay = (attempts, max) => (attempts === 1)
  ? 0
  : Math.min(e(attempts - 1) * 10, max)

module.exports = ({
  exponential = true,
  maxDelay = 6 * 3600 // 6 hours
} = {}) => async (job, next) => {
  try {
    const result = await next(job)
    await job.remove()

    return result
  } catch (error) {
    await job.release(exponential ? getDelay(job.attempts, maxDelay) : 0)

    throw error
  }
}
