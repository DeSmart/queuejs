module.exports = (pipes = []) => {
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
