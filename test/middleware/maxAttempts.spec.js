const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { job } = require('../../')
const { maxAttempts } = require('../../middleware')

chai.use(sinonChai)

const { expect } = chai

describe('middleware | maxAttempts', () => {
  it('passes job if max attempts is not exceeded', () => {
    const next = sinon.stub().returns('foo')
    const middleware = maxAttempts()

    const result = middleware(job.of('test'), next)

    expect(next).to.have.been.calledOnce // eslint-disable-line
    expect(result).to.equal('foo')
  })

  it('removes job if max attempts has exceeded', () => {
    const next = sinon.spy()
    const middleware = maxAttempts(3)
    const remove = sinon.spy()
    const failedJob = job({ name: 'test', attempts: 4, remove })

    middleware(failedJob, next)

    expect(remove).to.have.been.calledOnce // eslint-disable-line
    expect(next).not.to.have.been.called // eslint-disable-line
  })
})
