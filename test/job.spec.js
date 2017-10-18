const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { job } = require('../')

chai.use(sinonChai)

const { expect } = chai

describe('job', () => {
  it('creates job object', () => {
    const newJob = job({ name: 'test', queue: 'default', payload: { foo: 1 } })
    expect(newJob).to.deep.include({
      name: 'test',
      queue: 'default',
      payload: { foo: 1 },
      attempts: 0
    })
  })

  it('passes remove() callback', () => {
    const spy = sinon.spy()
    const newJob = job({ remove: spy })

    newJob.remove()

    expect(spy).to.have.been.called // eslint-disable-line
  })

  it('passes release() callback', () => {
    const spy = sinon.spy()
    const newJob = job({ release: spy })

    newJob.release()

    expect(spy).to.have.been.called // eslint-disable-line
  })

  it('creates copy of job when incrementing', () => {
    const data = {
      name: 'test',
      queue: 'default',
      payload: { foo: 1 },
      release: () => { },
      remove: () => { }
    }
    const retriedJob = job(data).increment()
    const expectedData = Object.assign({ attempts: 1 }, data)

    expect(retriedJob).to.deep.include(expectedData)
  })

  it('can be created using .of()', () => {
    const newJob = job.of('test', { foo: 1 })
    const expectedJob = job({ name: 'test', queue: 'default', payload: { foo: 1 } })

    expect(newJob.toJSON()).to.deep.equal(expectedJob.toJSON())
  })

  it('can be extended with actions', () => {
    const newJob = job.of('test')
    const actions = {
      release: () => {},
      remove: () => {}
    }

    const jobWithActions = newJob.withActions(actions)

    expect(jobWithActions).to.deep.include(actions)
    expect(jobWithActions.toJSON()).to.deep.include(newJob.toJSON())
  })

  describe('serialization', () => {
    it('toJSON()', () => {
      const data = {
        name: 'test',
        queue: 'default',
        attempts: 1,
        payload: { foo: 1 }
      }
      const newJob = job(data)

      expect(newJob.toJSON()).to.deep.equal(data)
    })

    it('fromJSON()', () => {
      const json = {
        name: 'test',
        queue: 'default',
        attempts: 1,
        payload: { foo: 1 }
      }

      const newJob = job.fromJSON(json)

      expect(newJob).to.deep.include(json)
    })
  })
})
