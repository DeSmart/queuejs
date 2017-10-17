const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const manager = require('../src/manager')

chai.use(sinonChai)

const { expect } = chai

const dummyConnector = {
  push: (name, payload, queue) => {}
}

describe('manager', () => {
  it('pushes jobs to connector', () => {
    const stub = sinon.stub(dummyConnector, 'push')
    stub.returns(true)

    const queue = manager(dummyConnector)
    const payload = { foo: 1 }

    const result = queue.push('job.name', payload)

    expect(result).to.equal(true)
    expect(stub).to.have.been.calledWith('job.name', payload, 'default')

    stub.restore()
  })
})
