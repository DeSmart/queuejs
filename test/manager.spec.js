const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { manager, job } = require('../')

chai.use(sinonChai)

const { expect } = chai

const dummyConnector = (listener = null) => ({
  push: (job) => { },

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
    const newJob = job.of('job.name', payload)

    const result = queue.push(newJob)

    expect(result).to.equal(true)
    expect(stub).to.have.been.calledWith(newJob)

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
    const options = { wait: 10 }
    stub.returns(true)

    const queue = manager(connector)
    const result = queue.listen('default', options)

    expect(stub).to.have.been.calledWith('default', options)
    expect(result).to.equal(true)

    stub.restore()
  })

  describe('pipeline', () => {
    it('allows to add jobs middleware', () => {
      const spy = sinon.spy()
      const testJob = job.of('job.name')
      const connector = dummyConnector()

      const queue = manager(connector)
      queue.use(spy)

      connector.stubJob(testJob)

      expect(spy).to.have.been.calledOnce // eslint-disable-line
      expect(spy.getCall(0).args[0]).to.equal(testJob)
    })

    it('passes modified job to handler', () => {
      const handler = sinon.spy()
      const connector = dummyConnector()
      const modifiedJob = job.of('foo')

      const queue = manager(connector)
      queue.use((job, next) => {
        next(modifiedJob)
      })

      queue.handle('foo', handler)

      connector.stubJob(job.of('job.name'))

      expect(handler).to.have.been.calledWith(modifiedJob)
    })

    it('should stop without calling next()', () => {
      const handler = sinon.spy()
      const connector = dummyConnector()

      const queue = manager(connector)
      queue.use(_ => {})

      queue.handle('foo', handler)
      connector.stubJob(job.of('job.name'))

      expect(handler).not.to.have.been.called // eslint-disable-line
    })

    it('should call multiple middlewares', () => {
      const handler = sinon.spy()
      const connector = dummyConnector()
      const fake = (job, next) => next(job)
      const middlewares = [
        sinon.stub().callsFake(fake),
        sinon.stub().callsFake(fake)
      ]

      const queue = manager(connector)

      middlewares.forEach(queue.use)

      queue.handle('job.name', handler)
      connector.stubJob(job.of('job.name'))

      expect(middlewares[0]).to.have.been.calledOnce // eslint-disable-line
      expect(middlewares[1]).to.have.been.calledOnce // eslint-disable-line
      expect(handler).to.have.been.calledOnce // eslint-disable-line
    })
  })
})
