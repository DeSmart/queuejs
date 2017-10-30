const maxAttempts = require('./src/middleware/maxAttempts')
const autoCommit = require('./src/middleware/autoCommit')

module.exports = {
  maxAttempts,
  autoCommit
}
