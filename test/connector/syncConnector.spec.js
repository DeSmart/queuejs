const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const syncConnector = require('../../src/connector/syncConnector')
const job = require('../../src/job')

chai.use(sinonChai)

const { expect } = chai

describe('connector | syncConnector', () => {
  it('pushes job immediately', () => {
    const spy = sinon.spy()

    const newJob = job.of('job.name', { foo: 1 })
    const connector = syncConnector()
    connector.onJob(spy)
    connector.push(newJob)

    expect(spy).to.have.been.called // eslint-disable-line

    const spyArgs = spy.getCall(0).args

    expect(spyArgs[0].toJSON()).to.deep.equal(newJob.increment().toJSON())
  })

  it('releases job', () => {
    const stub = sinon.stub().callsFake(job => {
      if (job.attempts === 1) {
        job.release()
      }
    })

    const newJob = job.of('job.name')
    const connector = syncConnector()
    connector.onJob(stub)

    connector.push(newJob)

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

    connector.push(job.of('job.name'))

    expect(stub).to.have.been.calledOnce // eslint-disable-line

    clock.tick(30000)

    expect(stub).to.have.been.calledTwice // eslint-disable-line

    clock.restore()
  })
})
