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
    jobHandlers.add('test.job', spy)

    await jobHandlers.dispatchJob(newJob)

    expect(spy).to.have.been.calledWith(newJob)
  })
})
