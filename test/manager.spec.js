const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { manager, job } = require('../')

chai.use(sinonChai)

const { expect } = chai

const dummyConnector = (listener = null) => ({
  push: (name, payload, queue) => { },

  onJob: fn => {
    listener = fn
  },

  stubJob: job => listener && listener(job),

  listen: () => {}
})

describe('manager', () => {
  it('pushes jobs to connector', () => {
    const connector = dummyConnector()
    const stub = sinon.stub(connector, 'push')
    stub.returns(true)

    const queue = manager(connector)
    const payload = { foo: 1 }

    const result = queue.push('job.name', payload)

    expect(result).to.equal(true)
    expect(stub).to.have.been.calledWith('job.name', payload, 'default')

    stub.restore()
  })

  it('allows to add job handlers', () => {
    const spy = sinon.spy()
    const expectedJob = job({ name: 'job.name', queue: 'default', payload: { foo: 1 } })

    const connector = dummyConnector()
    const queue = manager(connector)

    queue.handle('job.name', spy)
    connector.stubJob(expectedJob)

    expect(spy).to.have.been.calledWith(expectedJob)
  })

  it('proxies listen() to connector', () => {
    const connector = dummyConnector()
    const stub = sinon.stub(connector, 'listen')
    stub.returns(true)

    const queue = manager(connector)
    const result = queue.listen()

    expect(stub).to.have.been.calledWith('default')
    expect(result).to.equal(true)

    stub.restore()
  })
})
