# @desmart/queue

This package provides a unified API across a variety of different queue backends.

<!-- TOC -->

- [@desmart/queue](#desmartqueue)
- [installation](#installation)
- [example](#example)
- [job](#job)
    - [creating new job](#creating-new-job)
    - [handlers](#handlers)
    - [pushing to queue backend](#pushing-to-queue-backend)
- [listening to new jobs](#listening-to-new-jobs)
- [connectors](#connectors)
    - [api](#api)
- [middlewares](#middlewares)
    - [adding middleware](#adding-middleware)
    - [bundled middlewares](#bundled-middlewares)
        - [`autoCommit`](#autocommit)
        - [`maxAttempts`](#maxattempts)
        - [`debug`](#debug)
- [development](#development)
    - [tests & linting](#tests--linting)
    - [general practices](#general-practices)
    - [issues & PR](#issues--pr)

<!-- /TOC -->

# installation

```bash
npm i @desmart/queue
```

# example

```js
const { manager, job } = require('@desmart/queue')
const { syncConnector } = require('@desmart/queue/connector')

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

# middlewares

It's possible to extend behaviour of manager with middlewares.

Middleware is a function which should accept `job` and `next` callback. It's triggered once a job is fetched from backend and redirected to handler.  
Through middleware it's possible to modify job (note that job is immutable), or do some other stuff. Don't forget to call `next` once you want to pass control to another middleware.

Every middleware should (if possible) return the result of `next()`. Remember also that other middlewares may return a Promise so `async/await` may be useful here.

## adding middleware

```js
const { manager, job } = require('@desmart/queue')
const { autoCommit } = require('@desmart/queue/middleware')
const { syncConnector } = require('@desmart/queue/connector')

const queue = manager(syncConnector())
queue.use(autoCommit())

// each handle will be converted to terminating middleware - add them after all middlewares
queue.handle('job', () => {})
```

## bundled middlewares

Package comes with some bundled middlewares. They can be imported from `@desmart/queue/middleware` module.

### `autoCommit`

```js
const { autoCommit } = require('@desmart/queue/middleware')

queue.use(autoCommit({
  exponential: true,
  maxDelay: 6 * 3600
}))
```

Waits for job to finish and removes it from queue. If job failed it will be released back to queue.  
This will works only when **job handler returns a Promise**.

Job is released with exponential delay. After first attempt it will be released without a delay, with second attempt it will be delayed by 5 seconds, later by 15 seconds and so on.. By defualt, after multiple fails, job will be delayed by 6 hours.

Available options:

* `exponential` (Boolean) [`true`] should failed job be released with exponential delay
* `maxDelay` (Integer) [`21600`] maximum delay for failed jobs; used only when `exponential == true`

### `maxAttempts`

```js
const { maxAttempts } = require('@desmart/queue/middleware')

queue.use(maxAttempts(max = 3))
```

Removes automatically a job which failed more than `max` times.

### `debug`

```js
const { debug } = require('@desmart/queue/middleware')

queue.use(debug())
```

Small utility which uses [debug](https://github.com/visionmedia/debug) to print information about processed job status.

This middleware has to be used before `autoCommit`.

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
