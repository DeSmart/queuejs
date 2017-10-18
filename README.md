# @desmart/queue

This package provides a unified API across a variety of different queue backends.

# installation

```bash
npm i https://github.com/DeSmart/queuejs.git
```

# example

```js
const { manager, job } = require('@desmart/queue')
const syncConnector = require('@desmart/queue/src/connector/syncConnector')

const queue = manager(syncConnector())

// syncConnector will dispatch job immediately
// in this case it's required to attach listeners before job is pushed to queue
queue.handle('example.job', ({ name, queue, payload, attempts }) => {
    console.log(name) // example.job
    console.log(queue) // default
    console.log(payload) // { foo: 'bar' }
    console.log(attempts) // 1
})

queue.push(job.of('example.job', { foo: 'bar' }))
```

# job

Job contains information regarding task that should be handled:

* `name` (String) name of the job
* `queue` (String) name of the queue on which message had been sent
* `attempts` (Number)
* `payload` (Object)
* `remove()` (Function) remove message from the queue backend; **has to be triggered once job is processed**
* `release(delay = 0)` (Function) put job back to queue backend; optionally it can be delayed by given number of seconds

## creating new job

To create Job instance you can use `.of()` static method:

```js
const { job } = require('@desmart/queue')
job.of(name, payload, queue)
```

`payload` and `queue` are optional. By default job will use `default` queue.

## handlers

Each job received by queue backend will be dispatched to it's handler. Job can have only one dedicated handler.

```js
queue.handle('example.job', ({ name, queue, payload, attempts }) => {
    console.log(name) // example.job
    console.log(queue) // default
    console.log(payload) // { foo: 'bar' }
    console.log(attempts) // 1
})
```

## pushing to queue backend

Every job can be pushed through manager to queue backend:

```js
queue.push(job.of('example.job', { foo: 'bar' }))
```

# listening to new jobs

By default manager will **not** listen for incoming jobs.

To start listening for new jobs it's required to call `listen()` method.  
Listener will wait for new queue messages, convert them to `Job` object and pass it to bound handler.

By default listener will check for messages in `default` queue.

```js
manager.listen(queue)
```

# connectors

Queue manager uses connectors to handle various queue backends.

This package provides two basic connectors:

* `syncConnector` fires immediately pushed to queue job
* `nullConnector` drops all pushed to queue jobs

## api

Each connector has to implement following methods:

* `onJob(fn)` accepts callback which should receive `Job` instance once new message is retrieved from backend
* `push(job)` push job to queue backend

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
