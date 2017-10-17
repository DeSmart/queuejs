const syncConnector = require('./connectors/syncConnector')

const manager = (connector = syncConnector) => ({
  push (name, payload, queue = 'default') {
    return connector.push(name, payload, queue)
  }
})

module.exports = manager
