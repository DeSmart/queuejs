# @desmart/queue

This package provides a unified API across a variety of different queue backends.

# installation

```bash
npm i https://github.com/DeSmart/queuejs.git
```

# example

```js
const { manager } = require('@desmart/queue')
const syncConnector = require('@desmart/queue/src/connector/syncConnector')

const queue = manager(syncConnector())

// syncConnector will dispatch job immediately
// in this case it's required to attach listeners before job is pushed to queue
queue.on('example.job', ({ name, queue, payload, attempts }) => {
    console.log(name) // example.job
    console.log(queue) // default
    console.log(payload) // { foo: 'bar' }
    console.log(attempts) // 1
})

queue.push('example.job', {
    foo: 'bar'
})
```

# listening to new messages

```
manager :: listen(queue = 'default')
```

By default manager will **not** listen for incoming messages.

To start listening for new messages it's required to call `listen()` method.
Listener will wait for new messages, convert them to `Job` object and pass it to bound handlers.

By default listener will check for messages in `default` queue.

# connectors

Queue manager uses connectors to handle various queue backends.

This package provides two basic connectors:

* `syncConnector` fires immediately pushed to queue job
* `nullConnector` drops all pushed to queue jobs

## api

Each connector has to implement following methods:

* `onJob(fn)` accepts callback which should receive `Job` instance once new message is retrieved from backend
* `push(name, payload, queue)` push message with given payload to selected queue

# job

Job is an object containing:

* `name` (String) name of the job
* `queue` (String) name of the queue on which message had been sent
* `attempts` (Number)
* `payload` (Object)
* `remove()` (Function) remove message from the queue backend; **has to be triggered once job is processed**
* `release(delay = 0)` (Function) put job back to queue backend; optionally it can be delayed by given number of seconds

This module exports `job()` factory function:

```js
const { job } = require('@desmart/queue')

const jobToDispatch = job({ 
    name: 'example.job', 
    queue: 'default', 
    payload: { foo: 'bar' } 
})
```

# development

If you're planning to contribute to the package please make sure to adhere to following conventions.

## tests & linting

1. lint your code using [standard](https://standardjs.com/); run `npm run lint` to check if there are any linting errors
2. make sure to write tests for all the changes/bug fixes

## general practices

We're not looking back! You are encouraged to use all features from ES6.  
This package follows functional approach - if possible use pure functions, avoid classes etc.

## issues & PR

1. try to provide regression test when you find a bug
2. share some context on what you are trying to do, with enough code to reproduce the issue
