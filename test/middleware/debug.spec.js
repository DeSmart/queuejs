const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chaiAsPromisedCompat = require('chai-as-promised-compat')
const { job } = require('../../')
const { debug } = require('../../middleware')

chai.use(sinonChai)
chai.use(chaiAsPromisedCompat)

const { expect } = chai

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('middleware | debug', () => {
  it('calls next fn', async () => {
    const next = sinon.stub().returns('foo')
    const middleware = debug()
    const testJob = job.of('test')

    const result = await middleware(testJob, next)

    expect(next).to.have.been.calledWith(testJob)
    expect(result).to.equal('foo')
  })

  it('displays info about starting and finishing job', async () => {
    const next = _ => wait(1000)

    const middleware = debug()
    await middleware(job.of('test'), next)
  })

  it('displays info about failed job', async () => {
    const next = _ => wait(1000).then(_ => {
      throw new Error('this had to fail')
    })

    const middleware = debug()
    const fail = _ => middleware(job.of('test'), next)

    expect(fail()).to.eventually.be.rejectedWith(Error)
  })
})
