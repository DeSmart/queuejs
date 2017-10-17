const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const syncConnector = require('../../src/connector/syncConnector')

chai.use(sinonChai)

const { expect } = chai

describe('connector | syncConnector', () => {
  it('pushes job immediately', () => {
    const spy = sinon.spy()

    const connector = syncConnector()
    connector.onJob(spy)
    connector.push('job.name', { foo: 1 }, 'default')

    expect(spy).to.have.been.called // eslint-disable-line

    const spyArgs = spy.getCall(0).args

    expect(spyArgs[0]).to.deep.include({
      name: 'job.name',
      queue: 'default',
      payload: { foo: 1 }
    })
  })

  it('releases job', () => {
    const stub = sinon.stub().callsFake(job => {
      if (job.attempts === 1) {
        job.release()
      }
    })

    const connector = syncConnector()
    connector.onJob(stub)

    connector.push('job.name', {}, 'default')

    expect(stub).to.have.been.calledTwice // eslint-disable-line
    expect(stub.getCall(1).args[0]).to.include({ attempts: 2 })
  })

  it('releases job with delay', () => {
    const clock = sinon.useFakeTimers()
    const stub = sinon.stub().callsFake(job => {
      if (job.attempts === 1) {
        job.release(30)
      }
    })

    const connector = syncConnector()
    connector.onJob(stub)

    connector.push('job.name', {}, 'default')

    expect(stub).to.have.been.calledOnce // eslint-disable-line

    clock.tick(30000)

    expect(stub).to.have.been.calledTwice // eslint-disable-line

    clock.restore()
  })
})
