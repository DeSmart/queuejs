const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const handlers = require('../src/handlers')
const job = require('../src/job')

chai.use(sinonChai)

const { expect } = chai

describe('job handlers', () => {
  it('dispatches job to bound handler', async () => {
    const jobHandlers = handlers()
    const spy = sinon.spy()
    const newJob = job({ name: 'test.job' })
    jobHandlers.bind('test.job', spy)

    await jobHandlers.dispatchJob(newJob)

    expect(spy).to.have.been.calledWith(newJob)
  })

  it('does not fail when dispatching job without handler', (done) => {
    const jobHandlers = handlers()
    const fn = () => {
      return jobHandlers.dispatchJob(job({ name: 'test' }))
    }

    fn().then(done, done)
  })

  it('fails to add another handler for job', () => {
    const jobHandlers = handlers()
    jobHandlers.bind('test.job', () => {})

    const fn = () => {
      jobHandlers.bind('test.job', () => {})
    }

    expect(fn).to.throw()
  })
})
