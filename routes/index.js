const express = require('express')
const usersRouter = require('./usersRouter')

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

/* Mount Imported Routes */
router.use('/users', usersRouter)

module.exports = router
