const maxAttempts = require('./src/middleware/maxAttempts')
const autoCommit = require('./src/middleware/autoCommit')
const debug = require('./src/middleware/debug')

module.exports = {
  maxAttempts,
  autoCommit,
  debug
}
