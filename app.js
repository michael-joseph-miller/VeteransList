const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const routers = require('./routes/index')
const watch = require('./utils/watch-files')
const { subscribe } = require('./middleware/subscribe')
const debug = require('debug')('veteranslist:app')

const app = express()

// Dev mode setup
if (process.env.NODE_ENV === 'dev') {
  // Watch sass files for changes and re-compile
  watch(__dirname)
  // Subscribe middleware for page auto-refresh
  app.get('/subscribe', subscribe)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middleware
app.use(
  express.json(),
  express.urlencoded({ extended: false }),
  express.static(path.join(__dirname, 'public')),
  logger('dev')
)

// Routers
app.use('/', routers)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.status = err.status
  res.locals.stack = req.app.get('env') === 'dev' ? err.stack : ''
  res.locals.title = 'Veterans List POW-MIA Page'
  debug(err.status + ' ' + err.message)
  debug(err.stack)
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
