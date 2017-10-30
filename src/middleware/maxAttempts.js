module.exports = (max = 3) => (job, next) => {
  if (job.attempts > max) {
    return job.remove()
  }

  return next(job)
}
