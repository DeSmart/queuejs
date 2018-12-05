const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chaiAsPromisedCompat = require('chai-as-promised-compat')
const { job } = require('../../')
const { autoCommit } = require('../../middleware')

chai.use(sinonChai)
chai.use(chaiAsPromisedCompat)

const { expect } = chai
const delayedResolve = (wait = 0) => new Promise(resolve => setTimeout(resolve, wait))
const delayedReject = (wait = 0) => new Promise(
  (resolve, reject) => setTimeout(
    () => {
      reject(new Error())
    },
    wait
  )
)

describe('middleware | autoCommit', () => {
  it('removes finished job', async () => {
    const next = _ => delayedResolve().then(_ => 'foo')
    const remove = sinon.spy()

    const middleware = autoCommit({ exponential: false })
    const result = await middleware(job({ name: 'test', remove }), next)

    expect(remove).to.have.been.calledOnce // eslint-disable-line
    expect(result).to.equal('foo')
  })

  it('releases failed job', async () => {
    const next = _ => delayedReject()
    const release = sinon.spy()

    const middleware = autoCommit({ exponential: false })

    await expect(middleware(job({ name: 'test', release }), next))
      .to.eventually.be.rejectedWith(Error)

    expect(release).to.have.been.calledWith(0)
  })

  it('releases failed job with exponential delay', async () => {
    const next = _ => delayedReject()
    const release = sinon.spy()
    const middleware = autoCommit()
    const iterations = 5

    for (let i = 1; i <= iterations; i++) {
      try {
        await middleware(job({ release, attempts: i }), next)
      } catch (e) {
        // ignore
      }
    }

    for (let i = 1; i < iterations; i++) {
      const currentCall = release.getCall(i)
      const previousCall = release.getCall(i - 1)

      expect(currentCall.args[0]).to.be.gt(previousCall.args[0])
    }
  })

  it('releases failed job with exponential delay with max delay value', async () => {
    const next = _ => delayedReject()
    const release = sinon.spy()
    const middleware = autoCommit({ maxDelay: 1 })

    for (let i = 1; i <= 5; i++) {
      try {
        await middleware(job({ release, attempts: i }), next)
      } catch (e) {
        // ignore
      }
    }

    release.getCalls()
      .map(call => call.args[0])
      .forEach(releaseDelay => {
        expect(releaseDelay).to.be.lte(1)
      })
  })
})
