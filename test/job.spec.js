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
      attempts: 1
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

  it('creates copy of job when retrying', () => {
    const data = {
      name: 'test',
      queue: 'default',
      payload: { foo: 1 },
      release: () => { },
      remove: () => { }
    }
    const retriedJob = job(data).retry()
    const expectedData = Object.assign({ attempts: 2 }, data)

    expect(retriedJob).to.deep.include(expectedData)
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
      const remove = () => {}
      const release = () => {}
      const json = {
        name: 'test',
        queue: 'default',
        attempts: 1,
        payload: { foo: 1 }
      }

      const methods = { remove, release }
      const newJob = job.fromJSON(json, methods)

      expect(newJob).to.deep.include(Object.assign({}, json, methods))
    })
  })
})